import './App.css';
import React from 'react';
import Word from './Word';

const WORD_LENGTH = 5;
const NUM_OF_TRIES = 6;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      words: Array(NUM_OF_TRIES).fill(Array(WORD_LENGTH).fill(null)),
      currWord: 0,
      currLetter: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  onKeyDown(event) {
    console.log(event);
    switch (event.code) {
      case "Enter":
        this.setState({
          currWord: this.state.currWord + 1,
          currLetter: 0
        });
        break;
      case "Backspace":
        this.setState({
          words: this.state.words.map((word, i) => (i === this.state.currWord) ? word.map((letter, j) => (j === this.state.currLetter - 1) ? null : letter) : word),
          currLetter: this.state.currLetter > 0 ? this.state.currLetter - 1 : 0
        });
        break;
      default:
        this.setState({
          words: this.state.words.map((word, i) => (i === this.state.currWord) ? word.map((letter, j) => (j === this.state.currLetter) ? event.key : letter) : word),
          currLetter: this.state.currLetter < WORD_LENGTH ? this.state.currLetter + 1 : WORD_LENGTH
        });
    }
    console.log(this.state.words[this.state.currWord]);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to my WORDLE</h1>
        </header>
        <div>
          {this.state.words.map((word, i) => <Word word={word} key={i} />)}
        </div>
      </div>
    );
  }
}

export default App;
