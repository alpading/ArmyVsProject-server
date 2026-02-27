const differentiateElem = (params, id) => {
  let thisElem = {}
	let opponentElem = {}
	if(params[0].data.id == id){
		thisElem = params[0]
		opponentElem = params[1]
	} else {
		thisElem = params[1]
		opponentElem = params[0]
	}
	return [thisElem, opponentElem]
}

export default differentiateElem