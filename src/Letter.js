import './Letter.css'

function Letter(props) {
    const classes = [];
    if (props.value?.exact) classes.push('exact');
    if (props.value?.misplaced) classes.push('misplaced');
    if (props.value?.current) classes.push('current');
    return (
        <span className={['letter'].concat(classes).join(' ')}>
            {props.value?.char}
        </span>
    );
}

export default Letter;