import './KeyboardButton.css'

function KeyboardButton(props) {
    const classes = [];
    if (props.highlight) classes.push('highlight');
    return (
        <button className={['keyboard-button'].concat(classes).join(' ')} onClick={() => props.clickedHandler({ key: props.keyboardKey })} >
            {props.keyboardKey}
        </button>
    );
}

export default KeyboardButton;