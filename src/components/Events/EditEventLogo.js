import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';


import GetImage from '../../utils/GetImage';
import {_disable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
/*import constants from '../../redux/constants';*/


export default class EditEventLogo extends Component{

	constructor(){
		super();
		
		//set initial state
		this.state = {
			caption0:"",
			urlReturned:false
		}

	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0,0);

		//set base firestore ref
		this.firestore = firebase.firestore()

		//set ref to event section in firestore
		let ref = this.firestore.collection("Events").doc(this.props.match.params.EventKey);

		//get current event logo from firestore
		ref.get().then((snapshot)=>{
		
			this.setState({
				eventLogo:snapshot.data().eventLogo,
				urlReturned:true
			})
			
		})
	}
	

	_handleImageSubmit(e){
		
		//disable
		_disable();

		//set storage reference
		let storageRef = firebase.storage().ref();
		
		//get event image from store (set in GetImage component)
		let img  = store.getState().eventImg;
		
		//set file name and location	
		let messageImageFileLocation = `eventLogos/${this.props.match.params.EventKey}.jpg`;

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
		    // eslint-disable-next-line
		}, () => {
		    // Handle successful uploads on complete
		    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
				//send download url to function to handle adding ref to firestore
				this._uploadRefToFirestore(downloadURL);		
		    });
		})
		
				
	}

	_uploadRefToFirestore(downloadURL){
		
		//create ref to event location
		let ref = this.firestore.collection("Events").doc(this.props.match.params.EventKey);

			
		//create object with downloadURL
		let obj = {
			eventLogo:downloadURL
		}

		// update firestore with new image ref
		ref.update(obj).then(()=>{
			//redirect back to single event page
			this.props.history.push(`/SingleEvent/${this.props.match.params.EventKey}`)
			
		});
		
		
	}

	render(){
		
		
		let imagePicker;

		//once image has been returned from firestore show imagePicker
		if(this.state.urlReturned){
			imagePicker = <GetImage prompt="Please choose new event image" src={this.state.eventLogo} comp="EditEventLogo"/>
		}

		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/SingleEvent/' + this.props.match.params.EventKey}>&#60; Back</Link></p>
							
						</div>
					</div>

					<div className="box text-center">
						<h1>Add Event images</h1>

					
						{imagePicker}

						
						<div className="row text-center">

							<button className="btn-primary" onClick={this._handleImageSubmit.bind(this)}>Upload images</button>
						</div>
					</div>
				</div>
			</div>

		)
	}
}