import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
/*import constants from '../../redux/constants';*/


export default class EditBusinessLogo extends Component{

	constructor(){
		super();
		
		//set initial state
		this.state = {
			caption0:"",
			urlReturned:false
		}

		
		
	}

	componentWillMount(){

		//set base firstore reference
		this.firestore = firebase.firestore()

		//set referecne to business section in firestore
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		//get business data
		ref.get().then((snapshot)=>{
		
			//add business logo to store 
			this.setState({
				businessLogo:snapshot.data().businessLogo,
				urlReturned:true
			})
			
		})
	}

	

	_handleImageSubmit(e){
		
		//disable buttons
		_disable();

		//set references
		let storageRef = firebase.storage().ref();
		
		//set variables
		let img  = store.getState().businessImg;
		
		//set file location	
		let messageImageFileLocation = `businessLogos/${this.props.match.params.BusinessKey}.jpg`;
		
		//set upload task
		let uploadTask = storageRef.child(messageImageFileLocation).put(img);
		// Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on('state_changed', (snapshot)=>{
		    // Observe state change events such as progress, pause, and resume
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

		    switch (snapshot.state) {

		    	case firebase.storage.TaskState.PAUSED: // or 'paused'
		        	break;

		    		case firebase.storage.TaskState.RUNNING: // or 'running'
		       	 break;
		       	 default:

		    }

		}, (error)=> {
		    // Handle unsuccessful uploads
		    // eslint-disable-next-line
		}, () => {
		    // Handle successful uploads on complete
		    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{

		    	//get downloadURL and send it to firstore
				this._uploadRefToFirestore(downloadURL);		
		    });
		})
		
				
	}

	_uploadRefToFirestore(downloadURL){
		
		//create ref to image in firestore
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		// create object using downloadURL
		let obj = {
			businessLogo:downloadURL
		}

		// update firestore
		ref.update(obj).then(()=>{

			//enable buttons
			_enable();

			//redirect to business page
			this.props.history.push(`/Business/${this.props.match.params.BusinessKey}`)
		});
		
		
	}

	render(){
		
		
		let imagePicker;
		
		if(this.state.urlReturned){
			imagePicker = <GetImage prompt="Please choose new business logo" src={this.state.businessLogo} comp="EditBusinessLogo"/>
		}

		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/Business/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>

					<div className="box text-center">
						<h1>Edit Business logo</h1>

					
						{imagePicker}


						<div className="row text-center">

							<button className="btn-primary" onClick={this._handleImageSubmit.bind(this)}>Upload</button>
						</div>
					</div>
				</div>
			</div>

		)
	}
}