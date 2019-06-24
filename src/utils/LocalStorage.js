

const saveState = (name,state) => {
	try{
		//convert passed data to JSON
		const serialisedState = JSON.stringify(state);

		//save JSON data to localstorage under passed in name
		window.localStorage.setItem(name,serialisedState);
	}catch(err){

	}
}

const loadState = (name) => {
	try{
		//get JSON data form lcoalstorage
		const serialisedState = window.localStorage.getItem(name);

		//if no data return undefined
		if(!serialisedState){
			return undefined;
		}
		//return parsed JSON data
		return JSON.parse(serialisedState);
	}catch(err){
		return undefined;
	}
}

//export functions
exports.saveState = saveState;
exports.loadState = loadState;