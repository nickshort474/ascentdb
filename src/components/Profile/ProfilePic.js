import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
 
import {_disable,_enable} from '../../utils/DisableGreyOut';

import store from '../../redux/store';
import constants from '../../redux/constants';
import defaultLogo from '../../assets/images/default.jpg';

export default class ProfilePic extends Component{

	constructor(props){
		super(props);
		
		//set initial state
		this.state = {
			addedPic:false
		}

		//set base firestore reference
		this.firestore = firebase.firestore();

		//save curent page to store
		let pageRef = `ProfilePic/${this.props.match.params.UserRef}`;
		store.dispatch({type:constants.SAVE_PAGE, page:pageRef});

		
		//set ref to People images 
		let userRef = this.firestore.collection("PeopleImages").doc(this.props.match.params.UserRef);	
		
		//get users profile picture
		userRef.get().then((snapshot)=>{
			//save profile image url to state
			if(snapshot.exists){
				this.setState({
					profilePicUrl:snapshot.data().profilePicUrl
				})
			}
		})

	}


	_handleBrowseClick(){
	   //handle browse for file click 
	    var fileinput = document.getElementById("browse");
	    fileinput.click();
	}


	
	_handleProfilePic(e){
		//set reader
		let reader = new FileReader();
		
		//set onload event
		reader.onload = (e) => {
			
			//assign uploaded pic to image elements src for display
			document.getElementById('profilePic').src = e.target.result;
			
			//add data to state
			this.setState({
				profilePic:e.target.result,
				addedPic:true
			})

		}

		//read data
		reader.readAsDataURL(e.target.files[0]);
	}


	_addImageToStorage(callback){
		
		// if new image has been added 
		if(this.state.addedPic){
			
			//set base storage ref
			let storageRef = firebase.storage().ref();

			// uset image name
			let profileImageFileLocation = `profilePics/${this.props.match.params.UserRef}.jpg`;

			//set upload task
			let uploadTask = storageRef.child(profileImageFileLocation).putString(this.state.profilePic,'data_url');

			// Register three observers:
				// 1. 'state_changed' observer, called any time the state changes
				// 2. Error observer, called on failure
				// 3. Completion observer, called on successful completion
				uploadTask.on('state_changed', (snapshot)=>{
				    // Observe state change es such as progress, pause, and resume
				    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				    this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				    console.log('Upload is ' + this.progress + '% done');
				    switch (snapshot.state) {

				    	case firebase.storage.TaskState.PAUSED: // or 'paused'
				        	console.log('Upload is paused');
				        	break;

				    		case firebase.storage.TaskState.RUNNING: // or 'running'
				        	console.log('Upload is running');
				       	 break;
				       	 default:
				       	 	console.log("defaulting");

				    }

				}, (error)=> {
				    // Handle unsuccessful uploads
				    console.log(error);
				}, () => {
				    // Handle successful uploads on complete
				    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
				    	//callback with download url
						callback(downloadURL);
				    });
				})
			}
		
		
	}


	_submitForm(e){
		e.preventDefault();

		//disable buttons
		_disable();

		//add image to storage
		this._addImageToStorage((downloadURL)=>{
			//add reference to image to People section in firestore
		
			//set ref to People images
			let profileRef = this.firestore.collection("PeopleImages").doc(this.props.match.params.UserRef);

			//update download url for profile pic
			profileRef.set({profilePicUrl:downloadURL});

			//enable buttons
			_enable();

			//redirect to profile
			this.props.history.push("/Profile");
			
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
						<h2>Profile pic</h2>
						
						<div className="row">
							<input type="file" id="browse" name="fileupload" style={{display:"none"}} onChange={this._handleProfilePic.bind(this)} />
							<input type="button" value="Get image" className="btn btn-primary" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} /><br /><br />
							<img src={this.state.profilePicUrl ? this.state.profilePicUrl : defaultLogo} width='50%' height='50%' id="profilePic"  alt="" />
						</div><br />

						<div className="row">
							<input type="submit" value="Update profile pic" className="btn btn-primary" onClick={this._submitForm.bind(this)}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}