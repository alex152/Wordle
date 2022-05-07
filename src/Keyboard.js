import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function KeyboardButton(props) {
    const classes = [];
    if (props.highlight) classes.push('highlight');
    if (props.grayout) classes.push('grayout');
    if (props.green) classes.push('green');
    return (
        <Button className={classes.join(' ')} onClick={() => props.clickedHandler({ key: props.keyboardKey ?? props.label })} >
            {props.label}
        </Button>
    );
}

function Keyboard(props) {
    return (
        <Stack>
            <ButtonGroup>
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
            </ButtonGroup>
            <ButtonGroup>
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
            </ButtonGroup>
            <ButtonGroup>
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
            </ButtonGroup>
        </Stack>
    )
}

export default Keyboard;