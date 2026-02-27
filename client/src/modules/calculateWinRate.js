const calculateWinRate = (params) => {
	const calculateResult = params
	let totalWinCount = 0
	calculateResult.forEach( elem => { totalWinCount += elem.win_count })
	if(totalWinCount == 0) totalWinCount ++
	calculateResult.forEach( elem => { elem.win_rate = (( elem.win_count / totalWinCount )*100).toFixed(2)})
	return calculateResult
	}

export default calculateWinRate 