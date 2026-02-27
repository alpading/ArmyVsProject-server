import styles from '../css/gameResult.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAtom } from 'jotai'

import ShareKakao from '../components/ShareKakao.js'
import { getElemListRanking, putElemWinCount } from '../apis/elem.js'
import calculateWinRate from '../modules/calculateWinRate.js'
import { elemWinRateAtom } from '../store/jotai.js'

function GameResult(){
	const [elemWinRate, setElemWinRate] = useAtom(elemWinRateAtom)
	const location = useLocation()
	const navigate = useNavigate()
	
	useEffect(() => {
		async function axios(){
			const result = await getElemListRanking(parseInt(location.state.genreId))
			const elemStat = calculateWinRate(result)
			elemStat.forEach((elem) => {
				if(elem.id == location.state.elemId){
					setElemWinRate(elem.win_rate)
				}
			})
			return result
		}
		axios()
	},[])
	
	return(
		<div className={styles.gameResult}>
			<div className={styles.gameResult__content}>
				<div className={styles.gameResult__genreName}>
					{location.state.genreName}
				</div>
				<div className={styles.gameResult__elemName}>
					{location.state.elemName}
				</div>
				<div className={styles.gameResult__stat}>
					{elemWinRate}%의 사용자가 <br/> 같은 결과를 선택했습니다.
				</div>
				<div className={styles.gameResult__statPage_button} onClick={() => {navigate('/stat', { state : { genreId : location.state.genreId, genreName : location.state.genreName} })}}>
					순위 보러 가기
				</div>
			</div>
			{<ShareKakao genreName={location.state.genreName} elemName={location.state.elemName}/>}
		</div>
	)
}

export default GameResult