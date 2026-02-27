import axios from 'axios'
import { baseUrl } from '../modules/global.js'

async function postSelection(params){
	const result = await axios.post(baseUrl + `api/selection`, {
		'selectedElemId' : params[0],
		'unselectedElemId' : params[1]
	})
	return result.data.data
}

async function getSelectionStat(params){
	const result = await axios.get(baseUrl + `api/selection/stat/${params[0]}/${params[1]}`)
	return result.data.data
}

export { postSelection, getSelectionStat }