import "./App.scss";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useState, useEffect } from "react";

const WORD_LENGTH = 5;
const NUM_ATTEMPTS = 6;

const useLocalStorage = (key, defaultVal) => {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) ?? defaultVal
  );
  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value]
  );
  return [value, setValue];
};

const pad = (num) => `${num < 10 ? "0" : ""}${num}`;
const getDateStr = (date = new Date()) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}`;

function Word({ word, invalid, current }) {
  const classes = [];
  if (invalid) classes.push("invalid");
  if (current) classes.push("current");
  return (
    <div className={["word"].concat(classes).join(" ")}>
      {word.map(({ exact, misplaced, current, char }, i) => {
        const classes = [];
        if (!char) classes.push("empty");
        if (exact) classes.push("exact");
        if (misplaced) classes.push("misplaced");
        if (current) classes.push("current");
        return (
          <div key={i} className={["letter"].concat(classes).join(" ")}>
            <span>{char ?? "\0"}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const today = getDateStr();
  const storedDate = localStorage.getItem("date");
  if (!storedDate || storedDate < today) {
    localStorage.clear();
    localStorage.setItem("date", today);
  }
  const [loading, setLoading] = useState(false);
  const [state, setState] = useLocalStorage("wordleState", {
    words: Array(NUM_ATTEMPTS).fill(Array(WORD_LENGTH).fill({})),
    currWord: 0,
    currLetter: 0,
    gameWon: false,
    gameLost: false,
    invalidWord: false,
    absentLetters: {},
    foundLetters: {},
  });
  const onKeyDown = async ({ key }) => {
    const {
      words,
      currWord,
      currLetter,
      gameWon,
      gameLost,
      invalidWord,
      absentLetters,
      foundLetters,
    } = state;
    if (gameWon || gameLost || (invalidWord && key !== "Backspace")) return;
    state.invalidWord = false;
    switch (key) {
      case "Enter":
        if (currLetter < WORD_LENGTH) return;
        const guessRequest = new URL(
          "checkWord",
          "https://us-central1-wordle-117cf.cloudfunctions.net"
        );
        guessRequest.searchParams.append(
          "word",
          words[currWord].map(({ char }) => char).join("")
        );
        setLoading(true);
        const guessResponse = await (await fetch(guessRequest)).json();
        setLoading(false);
        if (guessResponse.error === "INVALID_WORD") {
          setState({
            ...state,
            invalidWord: true,
          });
          return;
        } else if (guessResponse.error) {
          console.error(guessResponse);
          return;
        }
        const tmpWords = words.map((word, i) => {
          if (i !== currWord) return word;
          return word.map((letter, j) => {
            switch (guessResponse[j]) {
              case 2:
                foundLetters[letter.char] = true;
                return { ...letter, exact: true };
              case 1:
                foundLetters[letter.char] = true;
                return { ...letter, misplaced: true };
              default:
                absentLetters[letter.char] = true;
                return letter;
            }
          });
        });
        const gameWon = tmpWords[currWord].every((letter) => letter.exact);
        setState({
          ...state,
          words: tmpWords,
          currWord: gameWon ? null : currWord + 1,
          currLetter: gameWon ? null : 0,
          gameWon: gameWon,
          gameLost: currWord === NUM_ATTEMPTS - 1 && !gameWon,
          absentLetters,
          foundLetters,
        });
        break;
      case "Backspace":
        setState({
          ...state,
          words: words.map((word, i) =>
            i === currWord
              ? word.map((letter, j) => (j === currLetter - 1 ? {} : letter))
              : word
          ),
          currLetter: Math.max(currLetter - 1, 0),
        });
        break;
      default:
        const char = key.toUpperCase();
        if (char.length !== 1 || char < "A" || char > "Z") return;
        setState({
          ...state,
          words: words.map((word, i) =>
            i === currWord
              ? word.map((letter, j) => (j === currLetter ? { char } : letter))
              : word
          ),
          currLetter: Math.min(currLetter + 1, WORD_LENGTH),
        });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="app">
      <h1 className="header">Daily Wordle</h1>
      <div className="status-wrapper">
        <h2
          className={["status"]
            .concat(
              loading
                ? ["loading"]
                : state.invalidWord
                ? ["invalid"]
                : state.gameWon
                ? ["win"]
                : state.gameLost
                ? ["lose"]
                : []
            )
            .join(" ")}
        >
          {loading
            ? "Checking word..."
            : state.gameWon
            ? "Great job come back tomorrow!"
            : state.gameLost
            ? "Game over try again tomorrow!"
            : state.invalidWord
            ? "Invalid word Erase and try again"
            : state.currWord
            ? `${NUM_ATTEMPTS - state.currWord} attempts left`
            : `Try guessing the ${WORD_LENGTH} letter word in ${NUM_ATTEMPTS} attempts`}
        </h2>
      </div>
      <div className="wordle-wrapper">
        <div className="wordle">
          {state.words.map((word, i) => (
            <Word
              word={
                i === state.currWord
                  ? word.map((letter, j) =>
                      j === state.currLetter
                        ? { ...letter, current: true }
                        : { ...letter, current: false }
                    )
                  : word
              }
              current={i === state.currWord}
              invalid={i === state.currWord && state.invalidWord}
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="keyboard-wrapper">
        <Keyboard
          onKeyPress={(key) =>
            onKeyDown({
              key:
                key === "{bksp}"
                  ? "Backspace"
                  : key === "{enter}"
                  ? "Enter"
                  : key,
            })
          }
          layout={{
            default: [
              ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].join(" "),
              ["a", "s", "d", "f", "g", "h", "j", "k", "l"].join(" "),
              [
                "{backspace}",
                "z",
                "x",
                "c",
                "v",
                "b",
                "n",
                "m",
                "{enter}",
              ].join(" "),
            ],
          }}
          display={{
            "{backspace}": "⌫",
            "{enter}": "⏎",
          }}
          buttonTheme={(state.invalidWord
            ? [
                {
                  class: "emphasis",
                  buttons: "{bksp}",
                },
              ]
            : []
          )
            .concat(
              !state.invalidWord &&
                state.words[state.currWord]?.filter(({ char }) => char)
                  .length === WORD_LENGTH
                ? [
                    {
                      class: "emphasis",
                      buttons: "{enter}",
                    },
                  ]
                : []
            )
            .concat(
              Object.keys(state.absentLetters).length
                ? [
                    {
                      class: "absent-letter",
                      buttons: Object.keys(state.absentLetters)
                        .map((c) => c.toLowerCase())
                        .join(" "),
                    },
                  ]
                : []
            )
            .concat(
              Object.keys(state.foundLetters).length
                ? [
                    {
                      class: "found-letter",
                      buttons: Object.keys(state.foundLetters)
                        .map((c) => c.toLowerCase())
                        .join(" "),
                    },
                  ]
                : []
            )}
          physicalKeyboardHighlight={true}
        />
      </div>
    </div>
  );
}
