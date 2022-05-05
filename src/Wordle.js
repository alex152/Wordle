import './Wordle.css';
import React from 'react';
import Word from './Word';

const WORD_LENGTH = 5;
const NUM_OF_TRIES = 6;

class Wordle extends React.Component {
  constructor(params) {
    super(params);
    this.state = {
      word: params.word.toUpperCase(),
      words: Array(NUM_OF_TRIES).fill(Array(WORD_LENGTH).fill(null)),
      currWord: 0,
      currLetter: 0,
      gameWon: false,
      gameLost: false
    }
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  onKeyDown(event) {
    if (this.state.gameWon || this.state.gameLost) return;
    switch (event.key) {
      case 'Enter':
        if (this.state.currLetter < WORD_LENGTH) return;
        const words = this.state.words.map((word, i) => {
          if (i !== this.state.currWord) return word;
          return word.map((letter, j) => {
            switch (this.state.word.indexOf(letter.char)) {
              case -1: return letter;
              case j: return { ...letter, exact: true };
              default: return { ...letter, misplaced: true };
            }
          })
        });
        const gameWon = words[this.state.currWord].every(letter => letter.exact);
        this.setState({
          words,
          currWord: this.state.currWord + 1,
          currLetter: 0,
          gameWon,
          gameLost: (this.state.currWord === NUM_OF_TRIES - 1) && !gameWon
        });
        break;
      case 'Backspace':
        this.setState({
          words: this.state.words.map((word, i) => (i === this.state.currWord) ? word.map((letter, j) => (j === this.state.currLetter - 1) ? null : letter) : word),
          currLetter: this.state.currLetter > 0 ? this.state.currLetter - 1 : 0
        });
        break;
      default:
        const char = event.key.toUpperCase();
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
      <div className='Wordle'>
        <header className='Wordle-header'>
          <h1>Welcome to my WORDLE</h1>
        </header>
        <div className='Wordle-container'>
          {this.state.words.map((word, i) => <Word word={word} key={i} />)}
        </div>
        {this.state.gameWon ? <div>Great job!</div> : null}
        {this.state.gameLost ? <div>Game over you lost, the word is {this.state.word}</div> : null}
      </div>
    );
  }
}

export default Wordle;