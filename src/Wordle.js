import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Letter(props) {
  const classes = ['text-center', 'border'];
  if (props.exact) classes.push('exact');
  if (props.misplaced) classes.push('misplaced');
  if (props.current) classes.push('current');
  return (
    <Col>
      <div className={classes.join(' ')} >{props.char ?? '\0'}</div>
    </Col>
  );
}

function Word(props) {
  const classes = [];
  if (props.invalid) classes.push('invalid');
  if (props.current) classes.push('current');
  return (
    <Row className={classes.join(' ')}>
      {props.word.map((letter, i) => <Letter {...(letter ?? {})} key={i} />)}
    </Row>
  );
}

function Wordle(props) {
  return (
    <Container>
      {props.words.map((word, i) => <Word word={(i === props.currWord) ? word.map((letter, j) => (j === props.currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === props.currWord} invalid={(i === props.currWord) && props.invalidWord} key={i} />)}
    </Container>
  );
}

export default Wordle;