import './Letter.css'

function Letter(props) {
    return (
        <span className={['letter'].concat(props.value?.exact ? ['letter-exact'] : props.value?.misplaced ? ['letter-misplaced'] : []).join(' ')}>
            {props.value?.char}
        </span>
    );
}

export default Letter;