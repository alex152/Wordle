import './Keyboard.scss';

function KeyboardButton(props) {
    const classes = [];
    if (props.highlight) classes.push('highlight');
    if (props.absent) classes.push('absent');
    if (props.found) classes.push('found');
    return (
        <button className={['keyboard-button'].concat(classes).join(' ')} onClick={() => props.clickedHandler({ key: props.keyboardKey ?? props.label })} >
            {props.label}
        </button>
    );
}

function Keyboard(props) {
    console.log(props);
    const genCharKey = key => ({
        label: key,
        absent: props.absentLetters[key.toUpperCase()],
        found: props.foundLetters[key.toUpperCase()]
    });
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
            { label: 'Back', keyboardKey: 'Backspace', highlight: props.invalidWord },
            genCharKey('z'),
            genCharKey('x'),
            genCharKey('c'),
            genCharKey('v'),
            genCharKey('b'),
            genCharKey('n'),
            genCharKey('m'),
            { label: 'Done', keyboardKey: 'Enter', highlight: props.submit && !props.invalidWord }
        ]
    ]
    return (
        <div className='keyboard'>
            <span className='section'>
                {layout.map((row, i) => (
                    <div key={i} >
                        {
                            row.map((key, j) => (<KeyboardButton {...key} key={j} clickedHandler={props.clickedHandler} />))
                        }
                    </div>
                ))}
            </span>
        </div>
    )
}

export default Keyboard;