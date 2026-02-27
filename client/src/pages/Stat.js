import styles from '../css/stat.module.css'
import calculateWinRate from '../modules/calculateWinRate.js'
import ElemRankingStat from '../components/ElemRankingStat.js'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'

import { getElemListRanking } from '../apis/elem.js'

import { elemListRankingAtom } from '../store/jotai.js'

function Stat() {
	const [ elemListRanking, setElemListRanking ] = useAtom(elemListRankingAtom)
	const location = useLocation() 
	const navigate = useNavigate()
	
	useEffect(() => {
		async function axios(){
			const result = await getElemListRanking(parseInt(location.state.genreId))
			const elemStat = calculateWinRate(result)
			setElemListRanking(elemStat)
		}
		axios()
	},[])
	
	return(
		<div className={styles.stat}>
			<div className={styles.stat__genreName}>
				{location.state.genreName}
			</div>
			<div className={styles.stat__button_nav}>
				<div className={styles.stat__home_button} onClick={()=>{navigate('/')}}>
					처음으로
				</div>
				<div className={styles.stat__return_button} onClick={()=>{navigate(-1)}}>
					이전으로
				</div>
			</div>
			<div className={styles.stat__elemRankingStat_container}>
				{elemListRanking.map((elem, index) => {
					return <ElemRankingStat id={index} elemName={elem.name} winCount={elem.win_count} winRate={elem.win_rate}/>
				})}
			</div>
		</div>
	)
}

export default Stat