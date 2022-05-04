import Letter from './Letter'

function Word(props) {
    return (
        <div>
            {props.word.map((letter, i) => <Letter value={letter} key={i}/>)}
        </div>
    );
}

export default Word;