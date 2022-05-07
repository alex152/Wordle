import './KeyboardButton.css'

function KeyboardButton(props) {
    return (
        <button className='keyboard-button' onClick={() => props.clickedHandler({ key: props.keyboardKey })} >
            {props.keyboardKey}
        </button>
    );
}

export default KeyboardButton;