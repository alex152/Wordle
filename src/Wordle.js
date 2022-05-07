import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

function Letter(props) {
  const classes = ['m-2', 'text-center', 'border', 'flex-fill'];
  if (props.exact) classes.push('exact');
  if (props.misplaced) classes.push('misplaced');
  if (props.current) classes.push('current');
  return (
    <div className={classes.join(' ')}>
      {props.char ?? '\0'}
    </div>
  );
}

function Word(props) {
  const classes = ['border', 'd-flex', 'flex-fill'];
  if (props.invalid) classes.push('invalid');
  if (props.current) classes.push('current');
  return (
    <div className={classes.join(' ')}>
      {props.word.map((letter, i) => <Letter {...(letter ?? {})} key={i} />)}
    </div>
  );
}

function Wordle(props) {
  return (
    <div className='d-flex flex-column flex-fill'>
        {props.words.map((word, i) => <Word word={(i === props.currWord) ? word.map((letter, j) => (j === props.currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === props.currWord} invalid={(i === props.currWord) && props.invalidWord} key={i} />)}
    </div>
  );
}

export default Wordle;