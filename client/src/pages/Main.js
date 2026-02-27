import { useEffect } from 'react'
import { useAtom } from 'jotai'
import Genre from '../components/Genre.js'

import styles from '../css/main.module.css'
import { getRandomGenreList, getAllGenreList } from '../apis/genre.js'
import { randomGenreListAtom, isListModeActiveAtom } from '../store/jotai.js'

function Main() {
	const [ randomGenreList, setRandomGenreList ] = useAtom(randomGenreListAtom)
	const [ isListModeActive, setIsListModeActive ] = useAtom(isListModeActiveAtom)
	
	useEffect(() => {
		async function axios(){
			const result = await getRandomGenreList()
			await setRandomGenreList(result)
			setIsListModeActive(false)
		}
		axios()
	},[])
	
	return(
		<div className={styles.main}>
			<div className={styles.main__wrapper}>
				{
					!isListModeActive&&<div className={styles.main__banner_wrapper}>
						<div className={styles.main__banner}>
						</div>
					<div className={styles.main__middle_nav}>
						<div className={styles.main__refresh_button} onClick={async()=>{
								const result = await getRandomGenreList()
								await setRandomGenreList(result)
							}}></div>

						<div className={styles.main__list_button} onClick={async()=>{
								setIsListModeActive(true)
								const allGenreList = await getAllGenreList()
								setRandomGenreList(allGenreList)
							}}></div>
					</div>
				</div>
				}
				
				{
					isListModeActive&&<div className={styles.main__back_button}onClick={() => {
							setIsListModeActive(false)
							window.location.reload()
						}}>
						이전으로
					</div>
				}
				
				<div className={styles.main__genre_container}>
					{randomGenreList.map((e)=><Genre name={e.name} id={e.id} />)}
				</div>
			</div>
		</div>
	)
}

export default Main