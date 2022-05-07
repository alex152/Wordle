import './KeyboardButton.scss'

function KeyboardButton(props) {
    const classes = [];
    if (props.highlight) classes.push('highlight');
    if (props.grayout) classes.push('grayout');
    if (props.green) classes.push('green');
    return (
        <button className={['keyboard-button'].concat(classes).join(' ')} onClick={() => props.clickedHandler({ key: props.keyboardKey ?? props.label })} >
            {props.label}
        </button>
    );
}

export default KeyboardButton;