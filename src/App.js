import './App.scss';
import Wordle from './Wordle';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
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
                    currWord: gameWon ? null : currWord + 1,
                    currLetter: gameWon ? null : 0,
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
                    currLetter: Math.max(currLetter - 1, 0)
                });
                break;
            default:
                const char = key.toUpperCase();
                if (char.length !== 1 || char < 'A' || char > 'Z') return;
                setState({
                    ...state,
                    words: words.map((word, i) => (i === currWord) ? word.map((letter, j) => (j === currLetter) ? { char } : letter) : word),
                    currLetter: Math.min(currLetter + 1, WORD_LENGTH)
                });
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    });

    return (
        <div className='app'>
            <div className='header'>
                <h1 className='title'>Daily Wordle</h1>
            </div>
            <div className='status-wrapper'>
                <h2 className={['status'].concat(state.invalidWord ? ['invalid'] : state.gameWon ? ['win'] : state.gameLost ? ['lose'] : []).join(' ')}>{
                    state.gameWon ? 'Great job come back tomorrow!' :
                        state.gameLost ? 'Game over try again tomorrow!' :
                            state.invalidWord ? 'Invalid word Erase and try again' :
                                `Try guessing the ${WORD_LENGTH} letter word in ${NUM_ATTEMPTS} attempts`}
                </h2>
            </div>
            <Wordle {...state} />
            <div className='keyboard-wrapper'>
                <Keyboard
                    onKeyPress={key => onKeyDown({ key: key === '{bksp}' ? 'Backspace' : key === '{enter}' ? 'Enter' : key })}
                    layout={{
                        default: [
                            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].join(' '),
                            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '{enter}'].join(' '),
                            ['z', 'x', 'c', 'v', 'b', 'n', 'm', '{bksp}'].join(' ')
                        ]
                    }}
                    buttonTheme={(state.invalidWord ? [{
                        class: 'emphasis',
                        buttons: '{bksp}'
                    }] : []).concat(!state.invalidWord && state.words[state.currWord]?.filter(char => char).length === WORD_LENGTH ? [{
                        class: 'emphasis',
                        buttons: '{enter}'
                    }] : []).concat(Object.keys(state.absentLetters).length ? [{
                        class: 'absent-letter',
                        buttons: Object.keys(state.absentLetters).map(c => c.toLowerCase()).join(' ')
                    }] : []).concat(Object.keys(state.foundLetters).length ? [{
                        class: 'found-letter',
                        buttons: Object.keys(state.foundLetters).map(c => c.toLowerCase()).join(' ')
                    }] : [])}
                />
            </div>
        </div>
    );
}

export default App;