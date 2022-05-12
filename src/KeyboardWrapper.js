import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useEffect } from 'react';

function KeyboardWrapper({ onKeyPress, absentLetters, foundLetters }) {
    useEffect(() => {
        const keyboard = document.querySelector('.react-simple-keyboard');
        Array.from(keyboard.querySelectorAll('.hg-button')).filter(elem => !'abcdefghijklmnopqrstuvwxyz'.split('').concat(['{enter}', '{bksp}']).includes(elem.getAttribute('data-skbtn'))).forEach(elem => elem.style.display = 'none');
        keyboard.querySelector('[data-skbtn="z"]').parentElement.appendChild(keyboard.querySelector('[data-skbtn="{bksp}"]'));
        absentLetters.forEach(absentLetter => keyboard.querySelector(`[data-skbtn="${absentLetter.toLowerCase()}"]`).style.background = 'gray');
        foundLetters.forEach(foundLetter => keyboard.querySelector(`[data-skbtn="${foundLetter.toLowerCase()}"]`).style.background = 'yellowgreen');
    });
    return (
        <Keyboard
                onKeyPress={key => onKeyPress({ key: key === '{bksp}' ? 'Backspace' : key === '{enter}' ? 'Enter' : key })}
        />
    )
}

export default KeyboardWrapper;