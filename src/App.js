import './App.scss';
import React from 'react';
import Wordle from './Wordle';
import Keyboard from './Keyboard';

const WORD_LENGTH = 5;
const NUM_OF_TRIES = 6;

class App extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            words: Array(NUM_OF_TRIES).fill(Array(WORD_LENGTH).fill(null)),
            currWord: 0,
            currLetter: 0,
            gameWon: false,
            gameLost: false,
            invalidWord: false,
            absentLetters: {},
            foundLetters: {}
        }
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    async onKeyDown({ key }) {
        if (this.state.gameWon || this.state.gameLost || (this.state.invalidWord && key !== 'Backspace')) return;
        this.setState({ invalidWord: false });
        switch (key) {
            case 'Enter':
                if (this.state.currLetter < WORD_LENGTH) return;
                const guess = this.state.words[this.state.currWord].map(({ char }) => char).join('');
                const validateResponse = await (await fetch(new URL(`words/${guess}`, 'https://wordsapiv1.p.rapidapi.com'), {
                    headers: {
                        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST,
                        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
                    }
                })).json();
                if (validateResponse.success === false) {
                    this.setState({ invalidWord: true });
                    return;
                };
                const guessRequest = new URL('daily', 'https://v1.wordle.k2bd.dev');
                guessRequest.searchParams.append('guess', guess);
                const guessResponse = await (await fetch(guessRequest)).json();
                const absentLetters = this.state.absentLetters;
                const foundLetters = this.state.foundLetters;
                const words = this.state.words.map((word, i) => {
                    if (i !== this.state.currWord) return word;
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
                });
                const gameWon = words[this.state.currWord].every(letter => letter.exact);
                this.setState({
                    words,
                    currWord: this.state.currWord + 1,
                    currLetter: 0,
                    gameWon,
                    gameLost: (this.state.currWord === NUM_OF_TRIES - 1) && !gameWon,
                    absentLetters,
                    foundLetters
                });
                break;
            case 'Backspace':
                this.setState({
                    words: this.state.words.map((word, i) => (i === this.state.currWord) ? word.map((letter, j) => (j === this.state.currLetter - 1) ? null : letter) : word),
                    currLetter: this.state.currLetter > 0 ? this.state.currLetter - 1 : 0
                });
                break;
            default:
                const char = key.toUpperCase();
                if (char.length !== 1 || char < 'A' || char > 'Z') return;
                this.setState({
                    words: this.state.words.map((word, i) => (i === this.state.currWord) ? word.map((letter, j) => (j === this.state.currLetter) ? { char } : letter) : word),
                    currLetter: this.state.currLetter < WORD_LENGTH ? this.state.currLetter + 1 : WORD_LENGTH
                });
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
    }
    render() {
        return (
            <div className='wordle'>
                <h1 className='title'>Welcome to my WORDLE!</h1>
                <div className='status'>
                    <h2>{
                        this.state.gameWon ? 'Great job!' :
                            this.state.gameLost ? 'Game over you lost!' :
                                this.state.invalidWord ? 'Invalid word! Erase and try again' :
                                    'Type in letters one by one, <Enter> to submit, <Backspace> to erase'}
                    </h2>
                </div>
                <Wordle {...this.state} />
                <Keyboard clickedHandler={this.onKeyDown} absentLetters={this.state.absentLetters} foundLetters={this.state.foundLetters} invalid={this.state.invalidWord} submit={this.state.currLetter === WORD_LENGTH} />
            </div>
        );
    }
}

export default App;