import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useEffect } from 'react';
import './KeyboardWrapper.scss'

function KeyboardWrapper({ onKeyPress, invalidWord, submitWord, absentLetters, foundLetters }) {
    useEffect(() => {
        const keyboard = document.querySelector('.react-simple-keyboard');
        Array.from(keyboard.querySelectorAll('.hg-button')).filter(elem => !'abcdefghijklmnopqrstuvwxyz'.split('').concat(['{enter}', '{bksp}']).includes(elem.getAttribute('data-skbtn'))).forEach(elem => elem.style.display = 'none');
        const bksp = keyboard.querySelector('[data-skbtn="{bksp}"]');
        const enter = keyboard.querySelector('[data-skbtn="{enter}"]');
        keyboard.querySelector('[data-skbtn="z"]').parentElement.appendChild(bksp);
        Object.keys(absentLetters).forEach(absentLetter => keyboard.querySelector(`[data-skbtn="${absentLetter.toLowerCase()}"]`).classList.add('absent-letter'));
        Object.keys(foundLetters).forEach(foundLetter => keyboard.querySelector(`[data-skbtn="${foundLetter.toLowerCase()}"]`).classList.add('found-letter'));
        if (invalidWord) bksp.classList.add('emphasis');
        else bksp.classList.remove('emphasis');
        if (submitWord) enter.classList.add('emphasis');
        else enter.classList.remove('emphasis');
    });
    return (
        <Keyboard
                onKeyPress={key => onKeyPress({ key: key === '{bksp}' ? 'Backspace' : key === '{enter}' ? 'Enter' : key })}
        />
    )
}

export default KeyboardWrapper;