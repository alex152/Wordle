import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Letter(props) {
    const classes = [];
    if (props.value?.exact) classes.push('exact');
    if (props.value?.misplaced) classes.push('misplaced');
    if (props.value?.current) classes.push('current');
    return (
        <Form.Control value={props.value?.char ?? ''} disabled/>
    );
}

function Word(props) {
    const classes = [];
    if (props.invalid) classes.push('invalid');
    if (props.current) classes.push('current');
    return (
        <InputGroup className={classes.join(' ')}>
            {props.word.map((letter, i) => <Letter value={letter} key={i}/>)}
        </InputGroup>
    );
}

export default Word;