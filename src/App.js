import './App.scss';
import Wordle from './Wordle';
import KeyboardWrapper from './KeyboardWrapper';
import { useState, useEffect } from 'react';

const WORD_LENGTH = 5;
const NUM_ATTEMPTS = 6;

function App() {
    const [words, setWords] = useState(Array(NUM_ATTEMPTS).fill(Array(WORD_LENGTH).fill(null)))
    const [currWord, setCurrWord] = useState(0);
    const [currLetter, setCurrLetter] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [invalidWord, setInvalidWord] = useState(false);
    const [absentLetters, setAbsentLetters] = useState({});
    const [foundLetters, setFoundLetters] = useState({});
    const onKeyDown = async ({ key }) => {
        if (gameWon || gameLost || (invalidWord && key !== 'Backspace')) return;
        setInvalidWord(false);
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
                    setInvalidWord(true);
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
                setWords(tmpWords);
                setCurrWord(currWord + 1);
                setCurrLetter(0);
                setGameWon(gameWon);
                setGameLost((currWord === NUM_ATTEMPTS - 1) && !gameWon);
                setAbsentLetters(absentLetters);
                setFoundLetters(foundLetters);
                break;
            case 'Backspace':
                setWords(words.map((word, i) => (i === currWord) ? word.map((letter, j) => (j === currLetter - 1) ? null : letter) : word));
                setCurrLetter(currLetter > 0 ? currLetter - 1 : 0);
                break;
            default:
                const char = key.toUpperCase();
                if (char.length !== 1 || char < 'A' || char > 'Z') return;
                setWords(words.map((word, i) => (i === currWord) ? word.map((letter, j) => (j === currLetter) ? { char } : letter) : word));
                setCurrLetter(currLetter < WORD_LENGTH ? currLetter + 1 : WORD_LENGTH);
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
                    gameWon ? 'Great job!' :
                        gameLost ? 'Game over you lost!' :
                            invalidWord ? 'Invalid word Erase and try again' :
                                `Try guessing the ${WORD_LENGTH} letter word in ${NUM_ATTEMPTS} attempts`}
                </h2>
            </div>
            <Wordle
                words={words}
                currWord={currWord}
                currLetter={currLetter}
                invalidWord={invalidWord}
            />
            <KeyboardWrapper
                onKeyPress={onKeyDown}
                invalidWord={invalidWord}
                submitWord={words[currWord].filter(char => char).length === WORD_LENGTH}
                absentLetters={Object.keys(absentLetters)}
                foundLetters={Object.keys(foundLetters)}
            />
        </div>
    );
}

export default App;