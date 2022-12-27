# Wordle

This is a simple wordle app written in React.js with a serverless Google Cloud Functions backend and data stored in Firebase.

## Live version

https://AlexanderBiba.github.io/wordle/

## Implementation

Frontend code [App.js](https://github.com/AlexanderBiba/wordle/blob/master/src/App.js) is written in React and uses [react-simple-keyboard](https://github.com/hodgef/react-simple-keyboard) for the keyboard. When a user submits a word, the api `checkWord` is called to validate and test the word.

Backend code [index.js](https://github.com/AlexanderBiba/wordle/blob/master/functions/index.js) contains a single request `checkWord` that validates wrther the word is a valid English word, then comapres letter by letter the input word with the daily word, and returns an array of digits, one for every letter, 0: letter missing, 1: letter in wrong location, 2: letter in correct location

Valid 5 letter English words were extracted from [english-words](https://github.com/dwyl/english-words) and stored in a Firebase database.

Daily word is chosen randomly from [words.js](https://github.com/AlexanderBiba/wordle/blob/master/functions/words.js). The list is derived from [google-10000-english](https://github.com/first20hours/google-10000-english).
