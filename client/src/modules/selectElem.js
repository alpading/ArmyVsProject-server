import { postSelection, getSelectionStat } from '../apis/selection'

const selectElem = async(params) => {
	// 선택 저장
	const selectedElemId = params[0]
	const unselectedElemId = params[1][0].data.id == selectedElemId ? params[1][1].data.id : params[1][0].data.id
	//console.log(selectedElemId, unselectedElemId)
	await postSelection([selectedElemId, unselectedElemId])
	
	// 선택 통계 반환
	const selectionStat = await getSelectionStat([selectedElemId, unselectedElemId])
	return selectionStat
}

export default selectElem