import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';
import {_compressImage} from '../../utils/CompressImage';
import defaultLogo from '../../assets/images/default.jpg'



export default class AddBusinessImages extends Component{

	constructor(){
		super();
		
		//set initial state and variables
		this.state = {};
		this.thumbnailArray = [];
		this.imageArray = [];

		//set initial references to firestore and storage
		this.storageRef = firebase.storage().ref();
		this.firestore = firebase.firestore();
	}

	componentWillMount(){
		
		//set ref to business thumbnails section
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages");

		//get current business thumbnails
		ref.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				
				//assign thumbnail urls to state
				this.setState({
					[snap.id]:snap.data().url
				})
				
				//add thumbnail urls to array
				this.thumbnailArray.push(snap.data().url);
				
			})
		})

		//set ref to full size business images
		let ref2 = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages");

		//get urls for full size images and save to array
		ref2.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				this.imageArray.push(snap.data().url);
				
			})
		})

	}

	_handleBrowseClick(e){
	   
	   	//handle browse click for user uploading images
		let fileinput = document.getElementById(e.target.id);
	    fileinput.click();
	}

	



	_handleMessagePic(e){
		
		// get id of image being added
		let imageDisplayKey = `businessPic${e.target.id}`;
		
		//setup file reader
		let reader = new FileReader();
		
		//set onload event
		reader.onload = (e) => {
			
			//compress image using outside component
			_compressImage(e.target.result, 600, (result)=>{
				
				//add full size picture to storage
				this._addImageToStorage(result,imageDisplayKey);
				
			})
			_compressImage(e.target.result, 200, (result)=>{
				
				//display thumbnail result on screen
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);
				
				this.setState({
					[imageDisplayKey]:objUrl,
					
				})
				//add thumbnail to storage
				this._addThumbnailToStorage(result,imageDisplayKey);
				
			})
		}

		//read image data
		reader.readAsDataURL(e.target.files[0]);
	}

	

	_addImageToStorage(image,imageName){

		//set file location using business key 
		let messageImageFileLocation = `businessImages/${this.props.match.params.BusinessKey}/${imageName}.jpg`;
		
		//set upload task 
		let uploadTask = this.storageRef.child(messageImageFileLocation).put(image);
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
				
				//add download url of image to firestore 
		    	let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages").doc(imageName);
		    	let obj = {
		    		url:downloadURL,
				}

		    	ref.set(obj);

		    });
		})
	}


	_addThumbnailToStorage(image,imageName){


		//set file location using business key
		let messageImageFileLocation = `businessThumbnails/${this.props.match.params.BusinessKey}/${imageName}.jpg`;

		//set upload task for image
		let uploadTask = this.storageRef.child(messageImageFileLocation).put(image);
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
				
				//add download url of image thumbnail to firestore
		    	let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages").doc(imageName);
		    	let obj = {
		    		url:downloadURL,
				}

		    	ref.set(obj);
		    });
		})
	}



	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/SingleBusiness/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
						</div>
					</div>

					<div className="box text-center">
						<h1>Add Business images</h1>



						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 1</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="1" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="1" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic1 ? this.state.businessPic1 : defaultLogo}  id="businessPic1"  alt="" />
								</div>
							</div>

							
						</div>
					


						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 2</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="2" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="2" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic2 ? this.state.businessPic2 : defaultLogo}  id="businessPic2"   alt="" />
								</div>
							</div>

							
							
						</div>


						<div className="box">	
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 3</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="3" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="3" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic3 ? this.state.businessPic3 : defaultLogo}  id="businessPic3"  alt="" />
								</div>
							</div>

							
							
						</div>


						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 4</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="4" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="4" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic4 ? this.state.businessPic4 : defaultLogo}  id="businessPic4"  alt="" />
								</div>
							</div>

							
							
						</div>



						<div className="box">
							<div className="row">
								<div className="col-sm-3">
									<label htmlFor="image">Image 5</label>
								</div>
								<div className="col-sm-3">
									<input type="file" id="5" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
									<input type="button" value="Add Image" id="5" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
								</div>	
								<div className="col-sm-6">
									<img src={this.state.businessPic5 ? this.state.businessPic5 : defaultLogo }  id="businessPic5"  alt="" />
								</div>
							</div>

							
							
						</div>


						
					</div>
				</div>
			</div>

		)
	}
}