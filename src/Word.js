import './Word.css'
import Letter from './Letter'

function Word(props) {
    return (
        <div className='word'>
            {props.word.map((letter, i) => <Letter value={letter} key={i}/>)}
        </div>
    );
}

export default Word;