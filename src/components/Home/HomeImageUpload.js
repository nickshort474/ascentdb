import React, {Component} from 'react';
import firebase from '@firebase/app';

import defaultLogo from '../../assets/images/defaultLarge.jpg';
import {_compressImage} from '../../utils/CompressImage';
import {_disable, _enable} from '../../utils/DisableGreyOut';
import LocalStorage from '../../utils/LocalStorage';


class HomeImageUpload extends Component{
	
	constructor(){
		super();

		//set initial state
		this.state = {
			homeImage:""
		}

		//set base firestore / strioage refs
		this.storageRef = firebase.storage().ref();
		this.firestore = firebase.firestore();

		//get user id from localstorage
		this.userUID = LocalStorage.loadState("user");
		
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}


	_handleBrowseClick(e){
	    //handle browse click for image upload 
		let fileinput = document.getElementById(e.target.id);
	    fileinput.click();
	}

	_handleMessagePic(e){
		
		//setup reader
		let reader = new FileReader();
		
		//set onload event
		reader.onload = (e) => {
			
			//send image to compression
			_compressImage(e.target.result, 600, (result)=>{
				
				//get result of compression
				this.result = result;

				//convert result to objectURL to display thumbnail on screen
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);

				//set to state
				this.setState({
					homeImage:objUrl
				})
			})
			
		}
		//read image data
		reader.readAsDataURL(e.target.files[0]);
	}

	_onSubmit(){

		//disbale buttons
		_disable()

		//if image has been uploaded
		if(this.result){

			//set ref to HomeIMage in firestore
			let ref = this.firestore.collection("HomeImages").doc();

			//get document id
			let id = ref.id;

			//set image file name in storage
			let messageImageFileLocation = `homepageImages/${id}.jpg`;

			//set upload task
			let uploadTask = this.storageRef.child(messageImageFileLocation).put(this.result);
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
					//create object with downloadURL of stored image and user id
			    	let obj = {
			    		downloadURL:downloadURL,
			    		user:this.userUID

			    	}

			    	//add object to firestore
					ref.set(obj).then(()=>{

						alert("Thank you for you submission")
						//enable buttons
						_enable();
						//redirect home
						this.props.history.push("/Home")
					})
			    

			    });
			})
		}else{
			alert("please choose an image to upload")
			_enable()
		}
		
	}
	
	
	render(){
		return(
			<div>
				<div className="container"> 
					<div className="content-wrapper text-center">
						<h2>Upload Image</h2>
					

						<div className="box greyedContent">
							<div className="row">
								
								
								<input type="file" id="4" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
								<input type="button" value="Add Image" id="4" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								
								<img src={this.state.homeImage ? this.state.homeImage : defaultLogo}  id="businessPic4" style={{"width":"100%"}} alt="" />
								
								<button className="btn btn-primary" onClick={this._onSubmit.bind(this)}>Upload</button>
							</div>
						</div>
												
					</div>
				</div>
			</div>

		)
	}
}
export default HomeImageUpload;
		