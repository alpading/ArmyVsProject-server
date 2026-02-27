import styles from '../css/game.module.css'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAtom } from 'jotai'

import Elem from '../components/Elem.js'

import { getRandomElemList } from '../apis/elem.js'
import { gameProgressAtom, gameElemAtom, isButtonActiveAtom, isIntroActiveAtom } from '../store/jotai.js'

function Game(){
	const [ gameProgress, setGameProgress ] = useAtom(gameProgressAtom)
	const [ gameElem, setGameElem ] = useAtom(gameElemAtom)
	const [ isButtonActive, setIsButtonActive ] = useAtom(isButtonActiveAtom)
	const [ isIntroActive, setIsIntroActive ] = useAtom(isIntroActiveAtom)
	
	useEffect(() => {
		async function axios(){
			const result = await getRandomElemList(location.state.id)
			// selected : -1 (선택못받음) 0 (미결정) 1 (선택받음)
			await setGameElem([{'data' : result[0], 'selected' : 0}, { 'data' : result[1], 'selected' : 0}])
			await setGameProgress(0)
			await setIsButtonActive(true)
			await setIsIntroActive(true)
			await setTimeout(()=>{
				setIsIntroActive(false)
			},2000)
			
			await window.sessionStorage.setItem('elemList', JSON.stringify(result))
		}
		axios()
	},[])
	
	const location = useLocation()
	
	return(
		<div className={styles.game}>
			<div className={ isIntroActive ? styles.game__intro_active : styles.game__intro_deactive}>
				<div className={styles.game__intro_genre_name}>
					{location.state.name}
				</div>
			</div>
			<div className={styles.game__genre_name}>
				{ location.state.name }
			</div>
			<div className={styles.game__progress}>
				{ gameProgress + 1 } / 10
			</div>
			<div className={styles.game__elem_wrapper}>
				<div className={styles.game__elem_container}>
					{gameElem.map((e)=><Elem elemName={e.data.name} elemId={e.data.id} genreName={location.state.name} genreId={location.state.id}/>)}
				</div>
			</div>
		</div>
	)
}

export default Game