import './App.scss';
import Wordle from './Wordle';
import KeyboardWrapper from './KeyboardWrapper';
import { useState, useEffect } from 'react';

const WORD_LENGTH = 5;
const NUM_ATTEMPTS = 6;

const useLocalStorage = (key, defaultVal) => {
    const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key)) ?? defaultVal);
    useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
    return [value, setValue];
}

function App() {
    const today = new Date().setHours(0, 0, 0, 0);
    if (JSON.parse(localStorage.getItem('date')) < today) {
        localStorage.clear();
        localStorage.setItem('date', today);
    };
    const [state, setState] = useLocalStorage('wordleState', {
        words: Array(NUM_ATTEMPTS).fill(Array(WORD_LENGTH).fill(null)),
        currWord: 0,
        currLetter: 0,
        gameWon: false,
        gameLost: false,
        invalidWord: false,
        absentLetters: {},
        foundLetters: {}
    });
    const onKeyDown = async ({ key }) => {
        const { words, currWord, currLetter, gameWon, gameLost, invalidWord, absentLetters, foundLetters } = state;
        if (gameWon || gameLost || (invalidWord && key !== 'Backspace')) return;
        state.invalidWord = false;
        switch (key) {
            case 'Enter':
                if (currLetter < WORD_LENGTH) return;
                const guess = words[currWord].map(({ char }) => char).join('');
                const validateResponse = await (await fetch(new URL(`words/${guess}`, 'https://wordsapiv1.p.rapidapi.com'), {
                    headers: {
                        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
                        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
                    }
                })).json();
                if (validateResponse.success === false) {
                    setState({
                        ...state,
                        invalidWord: true
                    });
                    return;
                };
                const guessRequest = new URL('daily', 'https://v1.wordle.k2bd.dev');
                guessRequest.searchParams.append('guess', guess);
                const guessResponse = await (await fetch(guessRequest)).json();
                const tmpWords = words.map((word, i) => {
                    if (i !== currWord) return word;
                    return word.map((letter, j) => {
                        switch (guessResponse[j].result) {
                            case 'correct':
                                foundLetters[letter.char] = true;
                                return { ...letter, exact: true };
                            case 'present':
                                foundLetters[letter.char] = true;
                                return { ...letter, misplaced: true };
                            default:
                                absentLetters[letter.char] = true;
                                return letter;
                        }
                    })
                })
                const gameWon = tmpWords[currWord].every(letter => letter.exact);
                setState({
                    ...state,
                    words: tmpWords,
                    currWord: currWord + 1,
                    currLetter: 0,
                    gameWon: gameWon,
                    gameLost: (currWord === NUM_ATTEMPTS - 1) && !gameWon,
                    absentLetters: absentLetters,
                    foundLetters: foundLetters
                });
                break;
            case 'Backspace':
                setState({
                    ...state,
                    words: words.map((word, i) => (i === currWord) ? word.map((letter, j) => (j === currLetter - 1) ? null : letter) : word),
                    currLetter: currLetter > 0 ? currLetter - 1 : 0
                });
                break;
            default:
                const char = key.toUpperCase();
                if (char.length !== 1 || char < 'A' || char > 'Z') return;
                setState({
                    ...state,
                    words: words.map((word, i) => (i === currWord) ? word.map((letter, j) => (j === currLetter) ? { char } : letter) : word),
                    currLetter: currLetter < WORD_LENGTH ? currLetter + 1 : WORD_LENGTH
                });
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    });

    return (
        <div className='wordle'>
            <h1 className='title'>Welcome to my daily WORDLE!</h1>
            <div className='status'>
                <h2>{
                    state.gameWon ? 'Great job come back tomorrow!' :
                        state.gameLost ? 'Game over try again tomorrow!' :
                            state.invalidWord ? 'Invalid word Erase and try again' :
                                `Try guessing the ${WORD_LENGTH} letter word in ${NUM_ATTEMPTS} attempts`}
                </h2>
            </div>
            <Wordle {...state} />
            <KeyboardWrapper {...state} onKeyPress={onKeyDown} submitWord={!state.invalidWord && state.words[state.currWord]?.filter(char => char).length === WORD_LENGTH} />
        </div>
    );
}

export default App;