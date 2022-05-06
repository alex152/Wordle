import './Word.css'
import Letter from './Letter'

function Word(props) {
    const classes = [];
    if (props.invalid) classes.push('invalid');
    if (props.current) classes.push('current');
    return (
        <div className={['word'].concat(classes).join(' ')}>
            {props.word.map((letter, i) => <Letter value={letter} key={i}/>)}
        </div>
    );
}

export default Word;