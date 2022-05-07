function Letter(props) {
  const classes = ['m-1', 'text-center', 'border', 'd-flex', 'flex-fill', 'justify-content-center', 'align-items-center'];
  if (props.exact) classes.push('bg-success');
  if (props.misplaced) classes.push('bg-warning');
  if (props.current) classes.push('bg-primary');
  return (
    <div style={{width: '1em'}} className={classes.join(' ')}>
      {props.char ?? '\0'}
    </div>
  );
}

function Word(props) {
  const classes = ['border', 'd-flex', 'flex-fill'];
  if (props.invalid) classes.push('bg-danger');
  if (props.current) classes.push('bg-secondary');
  return (
    <div className={classes.join(' ')}>
      {props.word.map((letter, i) => <Letter {...(letter ?? {})} key={i} />)}
    </div>
  );
}

function Wordle(props) {
  return (
    <div className='d-flex flex-column flex-fill border m-3'>
        {props.words.map((word, i) => <Word word={(i === props.currWord) ? word.map((letter, j) => (j === props.currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === props.currWord} invalid={(i === props.currWord) && props.invalidWord} key={i} />)}
    </div>
  );
}

export default Wordle;