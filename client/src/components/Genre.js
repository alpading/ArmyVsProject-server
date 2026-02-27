import styles from '../css/genre.module.css'
import { useNavigate } from 'react-router-dom'

function Genre(props) {
	const navigate = useNavigate()
	return(
		<div className={styles.genre} onClick={() => {navigate('/game', { state : props })}}>
			<div className={styles.genre__name}>
				{props.name}
			</div>
		</div>
	)
}

export default Genre