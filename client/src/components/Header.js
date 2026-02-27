import styles from '../css/header.module.css'
import { useNavigate } from 'react-router-dom'

function Header() {
	const navigate = useNavigate()
	return(
		<div>
			<div className={styles.header}>
				<div className={styles.header__title} onClick={() => {navigate('/')}}>
					군대 밸런스 게임
				</div>
			</div>
			<div className={styles.header__blank}>
			</div>
		</div>
	)
}

export default Header