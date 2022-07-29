import './Wordle.scss';

function Letter({ exact, misplaced, current, char }) {
    const classes = [];
    if (!char) classes.push('empty');
    if (exact) classes.push('exact');
    if (misplaced) classes.push('misplaced');
    if (current) classes.push('current');
    return (<div className={['letter'].concat(classes).join(' ')}><span>{char ?? '\0'}</span></div>);
}

function Word({ word, invalid, current }) {
    const classes = [];
    if (invalid) classes.push('invalid');
    if (current) classes.push('current');
    return (
        <div className={['word'].concat(classes).join(' ')}>
            {word.map((letter, i) => <Letter {...letter} key={i} />)}
        </div>
    );
}

function Wordle({ words, currWord, currLetter, invalidWord }) {
    return (
        <div className='wordle-wrapper'>
            <div className='wordle'>
                {words.map((word, i) => <Word word={(i === currWord) ? word.map((letter, j) => (j === currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === currWord} invalid={(i === currWord) && invalidWord} key={i} />)}
            </div>
        </div>
    );
}

export default Wordle;