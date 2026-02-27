import styles from '../css/elemRankingStat.module.css'

function ElemRankingStat(props) {
	
	return(
		<div className={styles.elemRankingStat__wrapper}>
			<div className={styles.elemRankingStat__rank}>
				{props.id + 1}위
			</div>
			<div className={props.id == 0 ? styles.elemRankingStatFirst
											: (props.id == 1) ? styles.elemRankingStatSecond
											: (props.id == 2) ? styles.elemRankingStatThird
											: styles.elemRankingStat}>
				<div className={styles.elemRankingStat__topNav}>
					<div className={styles.elemRankingStat__elemName}>
						{props.elemName}
					</div>
				</div>
				<div className={styles.elemRankingStati_bottomNav}>
					<div className={styles.elemRankingStat__winCount}>
						우승 횟수 : {props.winCount}
					</div>
					<div className={styles.elemRankingStat__winRate}>
						승률 : {props.winRate}%
					</div>
				</div>
			</div>
		</div>
	)
}

export default ElemRankingStat