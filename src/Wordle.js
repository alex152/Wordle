import './Wordle.scss';
import React from 'react';

function Letter(props) {
    const classes = [];
    if (props.exact) classes.push('exact');
    if (props.misplaced) classes.push('misplaced');
    if (props.current) classes.push('current');
    return (
        <span className={['letter'].concat(classes).join(' ')}>
            {props.char}
        </span>
    );
}

function Word(props) {
    const classes = [];
    if (props.invalid) classes.push('invalid');
    if (props.current) classes.push('current');
    return (
        <div className={['word'].concat(classes).join(' ')}>
            {props.word.map((letter, i) => <Letter {...letter} key={i} />)}
        </div>
    );
}

function Wordle(props) {
    return (
        <div className='wordle-outer-container'>
            <div className='wordle-inner-container'>
                {props.words.map((word, i) => <Word word={(i === props.currWord) ? word.map((letter, j) => (j === props.currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === props.currWord} invalid={(i === props.currWord) && props.invalidWord} key={i} />)}
            </div>
        </div>
    );
}

export default Wordle;