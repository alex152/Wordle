import './Letter.css'

function Letter(props) {
    return (
        <span className={['Letter'].concat(props.value?.exact ? ['Letter-exact'] : props.value?.misplaced ? ['Letter-misplaced'] : []).join(' ')}>
            {props.value?.char ?? '_'}
        </span>
    );
}

export default Letter;