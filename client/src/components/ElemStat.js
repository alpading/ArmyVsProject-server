import styles from '../css/elemStat.module.css'

function ElemStat(props) {
	
	
	return(
		<div className={`${styles.elemStat__background} ${props.isSelected == true ? styles.elemStat__background_selected : styles.elemStat__background_unselected}`}>
			<div className={styles.elemStat}>
				{props.winRate.toFixed(2)}%가 선택함
			</div>
		</div>
	)
}

export default ElemStat