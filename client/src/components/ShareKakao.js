import styles from '../css/shareKakao.module.css'

import { shareKakaoImage, baseUrl, reactAppKey } from '../modules/global.js'


const { Kakao } = window

const ShareKakao = (props) => {
	if (!Kakao.isInitialized()) {
    Kakao.init(reactAppKey)
	}

	
	const kakaoShare = () => {
		Kakao.Share.sendCustom({
			templateId: 119667,
			templateArgs: {
				genreName: `${props.genreName}`,
				elemName: `${props.elemName}`,
			},
		})
	}
	
	return(
		<div className={styles.shareKakao__button} onClick={()=>{kakaoShare()}}>
			카카오톡 공유하기
		</div>
	)
}

export default ShareKakao