import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function KeyboardButton(props) {
    const classes = ['m-1'];
    if (props.highlight) classes.push('btn-info');
    if (props.absent) classes.push('btn-secondary');
    if (props.found) classes.push('btn-success');
    return (
        <Button className={classes.join(' ')} onClick={() => props.clickedHandler({ key: props.keyboardKey ?? props.label })} >
            {props.label}
        </Button>
    );
}

function Keyboard(props) {
    const genCharKey = key => ({
        label: key,
        absent: props.absentLetters[key.toUpperCase()],
        found: props.foundLetters[key.toUpperCase()]
    })
    const layout = [
        [
            genCharKey('q'),
            genCharKey('w'),
            genCharKey('e'),
            genCharKey('r'),
            genCharKey('t'),
            genCharKey('y'),
            genCharKey('u'),
            genCharKey('i'),
            genCharKey('o'),
            genCharKey('p')
        ],
        [
            genCharKey('a'),
            genCharKey('s'),
            genCharKey('d'),
            genCharKey('f'),
            genCharKey('g'),
            genCharKey('h'),
            genCharKey('j'),
            genCharKey('k'),
            genCharKey('l')
        ],
        [
            { label: 'Back', keyboardKey: 'Backspace', highlight: props.invalid },
            genCharKey('z'),
            genCharKey('x'),
            genCharKey('c'),
            genCharKey('v'),
            genCharKey('b'),
            genCharKey('n'),
            genCharKey('m'),
            { label: 'Done', keyboardKey: 'Enter', highlight: props.submit && !props.invalid }
        ]
    ]
    return (
        <Container>
            {layout.map((row, i) => (
                <Row key={i} >
                    <Col className='d-flex justify-content-center' key={i} >
                        {
                            row.map((key, j) => (
                                <KeyboardButton {...key} key={j} clickedHandler={props.clickedHandler} />)
                            )
                        }
                    </Col>
                </Row>
            ))}
        </Container>
    )
}

export default Keyboard;