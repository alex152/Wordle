import functions from "firebase-functions";
import admin from "firebase-admin";
import wordleWords from "./words.js";
import cors from "cors";

const corsHandler = cors({ origin: "https://alexanderbiba.github.io" });

const pad = (num) => `${num < 10 ? "0" : ""}${num}`;
const getDateStr = (date = new Date()) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;

const guessResult = {
  missing: 0,
  present: 1,
  correct: 2,
};

admin.initializeApp();
const db = admin.firestore();

export const checkWord = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      if (!request.query.word || request.query.word.length !== 5) {
        response.send({
          error: "INVALID_REQUEST",
        });
        return;
      }
      const today = getDateStr();
      if (!(await db.collection("state").doc(today).get()).exists) {
        await db
          .collection("state")
          .doc(today)
          .set({
            word: wordleWords[Math.floor(Math.random() * wordleWords.length)],
          });
      }
      const requestWord = request.query.word.toLowerCase();
      if (!(await db.collection("words").doc(requestWord).get()).exists) {
        response.send({
          error: "INVALID_WORD",
        });
        return;
      }
      const dailyWord = (
        await db.collection("state").doc(getDateStr(new Date())).get()
      )
        .data()
        .word.toLowerCase();
      const dailyWordLetters = new Set(dailyWord);
      response.send(
        dailyWord
          .split("")
          .map((letter, i) =>
            requestWord[i] === letter
              ? guessResult.correct
              : dailyWordLetters.has(requestWord[i])
              ? guessResult.present
              : guessResult.missing
          )
      );
    });
  }
);
