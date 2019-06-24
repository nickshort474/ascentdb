import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import { withFirebase } from '../Firebase';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';

class SignOutButton extends Component{
	

	_onClick(e){
		
		//on sign out use funciton in firebase.js
		this.props.firebase.doSignOut().then(()=>{

			//signed out so clear all data from store ready for another user or another fresh session
			store.dispatch({type:constants.CLEAR_STORE});
		
			//delete user from LocalStorage to match google auth
			LocalStorage.saveState("user",null);
			LocalStorage.saveState("token",null);
			//redirect
			this.props.history.push('/Home');
			
		})
	}

	render(){

		return(
			<button type="button" className="btn btn-primary" onClick={this._onClick.bind(this)}>Sign Out</button>
		)
	}
}

export default withRouter(withFirebase(SignOutButton))

