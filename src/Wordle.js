function Letter(props) {
  const classes = ['rounded ', 'border', 'm-1', 'text-center', 'd-flex', 'flex-fill', 'justify-content-center', 'align-items-center'];
  if (props.exact) classes.push('bg-success');
  else if (props.misplaced) classes.push('bg-warning');
  else if (props.current) classes.push('bg-primary');
  else if (props.char) classes.push('bg-info');
  else classes.push('bg-light');
  return (
    <div style={{ width: '1em' }}className={classes.join(' ')}>
      {props.char ?? '\0'}
    </div>
  );
}

function Word(props) {
  const classes = ['rounded', 'border', 'd-flex', 'flex-fill', 'm-1'];
  if (props.invalid) classes.push('bg-danger');
  else if (props.current) classes.push('bg-accent1');
  else classes.push('bg-accent2');
  return (
    <div className={classes.join(' ')}>
      {props.word.map((letter, i) => <Letter {...(letter ?? {})} key={i} />)}
    </div>
  );
}

function Wordle(props) {
  return (
      <div className={['d-flex', 'flex-column', 'flex-fill', 'm-3'].join(' ')}>
        {props.words.map((word, i) => <Word word={(i === props.currWord) ? word.map((letter, j) => (j === props.currLetter) ? { ...letter, current: true } : { ...letter, current: false }) : word} current={i === props.currWord} invalid={(i === props.currWord) && props.invalidWord} key={i} />)}
      </div>
  );
}

export default Wordle;