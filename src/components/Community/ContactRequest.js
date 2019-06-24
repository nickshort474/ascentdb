import React, {Component} from 'react';

import {firebase} from '@firebase/app';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';


class ContactRequest extends Component{
	
	constructor(props){
		super(props);
		
		//set initial state
		this.state = {
			requestContent:""
		}

		//get user id fomr localstorage
		this.userUID = LocalStorage.loadState("user");

		//set base firestore ref
		this.firestore = firebase.firestore();
	}

	_handleInput(e){

		//handle input data
		this.setState({
			requestContent:e.target.value
		})
	}

	componentWillMount(){
		//scroll to top	
		window.scrollTo(0, 0);
	}

	_handleSubmit(e){
		e.preventDefault()

		//disable butotns on submit
		_disable();

		//test for contact request message length size minimum
		if(this.state.requestContent.length > 2){
			
			//set ref to this users firestore section
			let ref = this.firestore.collection("Users").doc(this.userUID);
			
			//get this users username
			ref.get().then((snapshot)=>{
				this.userName = snapshot.data().userName;
			}).then(()=>{
				
				// send request to viewing users contact requests section
				let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey).collection("ContactRequests");
				
				//create request object
				let obj = {
					requestUserUID:this.userUID,
					requestUserName:this.userName,
					content:this.state.requestContent
				}
				
				//add contact request
				ref.add(obj).then(()=>{
					//enable buttons
					_enable();
					//redirect back to users profile
					this.props.history.push(`/PersonProfile/${this.props.match.params.PersonKey}`)
				})
			})
			
		}else{
			//alert user of message required
			alert("please add a short request statement, who you are, why you want to make contact etc..")
			//enable buttons
			_enable();
		}
		

	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<form onSubmit={this._handleSubmit.bind(this)}>
							<h4>Contact Request</h4>
							<textarea style={{"width":"100%"}} value={this.state.requestContent} onChange={this._handleInput.bind(this)} /><br /><br />
							<input className="btn btn-primary" type="submit" value="Make contact request" /> 
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default ContactRequest