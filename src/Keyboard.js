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
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} />))}
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
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} />))}
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
                    ].map((key, i) => (<KeyboardButton label={key} key={i} clickedHandler={props.clickedHandler} />))}
                </div>
            </span>
            <KeyboardButton highlight={props.invalid} label='⌫' keyboardKey='Backspace' clickedHandler={props.clickedHandler} />
            <KeyboardButton highlight={props.submit && !props.invalid} label='⏎' keyboardKey='Enter' clickedHandler={props.clickedHandler} />
        </div>
    )
}

export default Keyboard;