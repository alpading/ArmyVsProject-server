import axios from 'axios'
import { baseUrl } from '../modules/global.js'

async function getRandomGenreList(){
	const result = await axios.get(baseUrl + 'api/genre')
    // if(result.status == 200) return result.data
    // else return result.error
	return result.data.data
}

async function getAllGenreList(){
	const result = await axios.get(baseUrl + 'api/genre/all')
	return result.data.data
}

export { getRandomGenreList, getAllGenreList }