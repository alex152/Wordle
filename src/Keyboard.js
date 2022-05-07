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
                    ].map((key, i) => (<KeyboardButton keyboardKey={key} key={i} clickedHandler={props.clickedHandler} />))}
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
                    ].map((key, i) => (<KeyboardButton keyboardKey={key} key={i} clickedHandler={props.clickedHandler} />))}
                </div>
                <div>
                    {[
                        'z',
                        'x',
                        'c',
                        'v',
                        'b',
                        'n',
                        'm'
                    ].map((key, i) => (<KeyboardButton keyboardKey={key} key={i} clickedHandler={props.clickedHandler} />))}
                </div>
            </span>
            <KeyboardButton highlight={props.invalid} keyboardKey='Backspace' clickedHandler={props.clickedHandler} />
            <KeyboardButton highlight={props.submit && !props.invalid} keyboardKey='Enter' clickedHandler={props.clickedHandler} />
        </div>
    )
}

export default Keyboard;