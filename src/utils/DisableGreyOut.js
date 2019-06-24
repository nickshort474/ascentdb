const _disable = () => {
	
	//grey out box
	let elem = document.getElementsByClassName("content-wrapper")[0];
	elem.style.opacity = "0.5"

	//disable input boxes
	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputs[i].disabled = true;
		
	}

	//disable buttons
	let buttons = document.getElementsByTagName("button");
	for(let i = 0; i < buttons.length; i++){
		buttons[i].disabled = true;
		
	}

	
}

const _enable = () => {

	//remove greyed out
	let elem = document.getElementsByClassName("content-wrapper")[0];
	elem.style.opacity = "1"

	//enable inputs
	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		inputs[i].disabled = false;
		
	}

	//enable buttons
	let buttons = document.getElementsByTagName("button");
	for(let i = 0; i < buttons.length; i++){
		buttons[i].disabled = false;
		
	}
}

//export functions
exports._disable = _disable;
exports._enable = _enable;  