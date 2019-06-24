import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';


export default class Username extends Component{

	constructor(){
		super();

		//set initial state
		this.state = {
			userName:""
		}

		//get user id form localstorage
		this.userUID = LocalStorage.loadState("user");

		//set base firestore ref
		this.firestore = firebase.firestore();

	}

	componentWillMount(){
		
		//get existing username from firestore
		let ref = this.firestore.collection('Users').doc(this.userUID);
		ref.get().then((snapshot)=>{
			
			let username = snapshot.data().userName;

			this.setState({
				userName:username,
				oldUsername:username
			})
		})
	}

	_changeUsername(e){
		//handle input of username
		this.setState({
			userName:e.target.value
		})
	}



	_submitForm(){

		// check for matching usernames first
		let ref = this.firestore.collection('Usernames').doc(this.state.userName);
		let match = false;

		

		ref.get().then((snapshot)=>{
			
			//if snapshot exists then username is already in firestore
			if(snapshot.exists){
				alert(this.state.userName + " already exists please try another user name");
				match = true;
			}else{
				match = false;
			}
			
		}).then(()=>{

			//if match is false then update username across all section of firestore that name exists in
			if(!match){
				
				this.firestore.collection('Users').doc(this.userUID).update({userName:this.state.userName});
				//delete doc of old username 
				this.firestore.collection('Usernames').doc(this.state.oldUsername).delete();
				//add new doc with new username
				this.firestore.collection('Usernames').doc(this.state.userName).set({uid:this.userUID});

				//update username in People section
				this.firestore.collection("People").doc(this.userUID).update({userName:this.state.userName})

				//redirect back to profile
				this.props.history.push("/Profile");

				
			}
		})
	}	


	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Profile">&lt; Back</Link>
					</div>
					<div className="box text-center">		
						<h2>Change username</h2><br />
						<div className="row">
							
							<label>Username:</label>
							<input type="text" value={this.state.userName} onChange={this._changeUsername.bind(this)}/>
							
						</div><br />
						<div className="row text-center">
							<button className="btn btn-primary"  onClick={this._submitForm.bind(this)}>Update username</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}