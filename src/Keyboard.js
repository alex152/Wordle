import './Keyboard.css';
import KeyboardButton from './KeyboardButton';

function Keyboard(props) {
    return (
        <div className='keyboard'>
            <span className='section'>
                <div>
                    {[
                        'q',
                        'w',
                        'e',
                        'r',
                        't',
                        'y',
                        'u',
                        'i',
                        'o',
                        'p'
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} grayout={props.absentLetters[key.toUpperCase()]} green={props.foundLetters[key.toUpperCase()]} />))}
                </div>
                <div>
                    {[
                        'a',
                        's',
                        'd',
                        'f',
                        'g',
                        'h',
                        'j',
                        'k',
                        'l'
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} grayout={props.absentLetters[key.toUpperCase()]} green={props.foundLetters[key.toUpperCase()]} />))}
                </div>
                <div>
                    <KeyboardButton highlight={props.invalid} label='Back' keyboardKey='Backspace' clickedHandler={props.clickedHandler} />
                    {[
                        'z',
                        'x',
                        'c',
                        'v',
                        'b',
                        'n',
                        'm'
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} grayout={props.absentLetters[key.toUpperCase()]} green={props.foundLetters[key.toUpperCase()]} />))}
                    <KeyboardButton highlight={props.submit && !props.invalid} label='Done' keyboardKey='Enter' clickedHandler={props.clickedHandler} />
                </div>
            </span>
        </div>
    )
}

export default Keyboard;