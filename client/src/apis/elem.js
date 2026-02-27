import axios from 'axios'
import { baseUrl } from '../modules/global.js'

async function getRandomElemList(param){
	const result = await axios.get(baseUrl + `api/elem/list/${param}`)
	return result.data.data
}

async function getElem(param){
	const result = await axios.get(baseUrl + `api/elem/${param}`)
	return result.data.data
}

async function getElemListRanking(param){
	const result = await axios.get(baseUrl + `api/elem/${param}/list/ranking`)
	return result.data.data
}

async function putElemWinCount(param){
	const result = await axios.put(baseUrl + `api/elem/win`, {
		'elemId' : param
	})
	return result.data.data
}

export { getRandomElemList, getElem, getElemListRanking, putElemWinCount }