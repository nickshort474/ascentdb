import {createStore} from 'redux';
import reducer from './reducer';

//save to session storage
const saveState = (state) => {
	try{

		const serialisedState = JSON.stringify(state);

		window.sessionStorage.setItem('appState',serialisedState);
	}catch(err){

	}
}

//load from session storage
const loadState = () => {
	try{
		const serialisedState = window.sessionStorage.getItem("appState");

		if(!serialisedState){
			return undefined;
		}
		return JSON.parse(serialisedState);
	}catch(err){
		return undefined;
	}
}

//bakcup store in session storage on page refreshes

//load old state from storage and create store from it
const oldState = loadState();
const store = createStore(reducer, oldState);

// subscribe to store to listen for changes
store.subscribe(()=>{
	//when store is changed backup store state to localstorage
	saveState(store.getState());
});

export default store;