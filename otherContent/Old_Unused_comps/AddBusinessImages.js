import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import {_compressImage} from '../../utils/CompressImage';




export default class AddBusinessImages extends Component{

	constructor(){
		super();
		this.state = {
			caption1:"",
			caption2:"",
			caption3:"",
			caption4:"",
			caption5:""
			
		}

		this.imageArray = [];
		this.thumbnailArray = [];
		this.captionObj = {};
		//set references
		this.storageRef = firebase.storage().ref();
	}

	componentWillMount(){
		
	
		this.firestore = firebase.firestore()
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages");

		ref.get().then((snapshot)=>{
			
			let count = 1;
			
			snapshot.forEach((snap)=>{
				
				let str = String(snap.id)
				let num = str.substr(5,1);
				this.setState({
					[`caption${num}`]:snap.data().caption,
					[`businessPic${num}`]:snap.data().url
				})
				
				this.thumbnailArray.push(snap.data().url);
				this.captionObj[count] = snap.data().caption;
				
				
			})
		})

		let ref2 = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages");
		ref2.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				let str = String(snap.id)
				let num = str.substr(5,1);

				this.imageArray.push(snap.data().url);
				
			})
		})

	}

	_handleBrowseClick(e){
	   
		let fileinput = document.getElementById(e.target.id);
	    fileinput.click();
	}

	



	_handleMessagePic(e){
		
		
		let imageDisplayKey = `businessPic${e.target.id}`;
		

		let blobKey = `imageBlob${e.target.id}`

		let reader = new FileReader();
		
		 reader.onload = (e) => {
			
			_compressImage(e.target.result, 600, (result)=>{
				
				//var urlCreator = window.URL || window.webkitURL;
				//let objUrl = urlCreator.createObjectURL(result);
				

				/*this.setState({
					[imageDisplayKey]:objUrl,
					[blobKey]:result
				})*/
				this.imageArray.push(result)
				
			})
			_compressImage(e.target.result, 200, (result)=>{
				
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);
				

				this.setState({
					[imageDisplayKey]:objUrl,
					[blobKey]:result
				})
				this.thumbnailArray.push(result)
				
			})
		}

		reader.readAsDataURL(e.target.files[0]);
	}

	_handleCaptionChange(e){
		
		// set state for displaying of caption value in input box
		this.setState({
			[`caption${e.target.id}`]:e.target.value
		})

		//add caption to caption object to loop through when adding data to firestore
		this.captionObj[e.target.id] = e.target.value;
		
	}

	_handleImageSubmit(e){
		
		//set variables
		let downloadArray = [];
		let uploadCounter = 0;

		for(let i = 0; i < this.imageArray.length; i++){
			
			if(typeof this.imageArray[i] !== "string"){
				//upload images
				
				let num = i + 1;
					// get image from image array
					let img = this.imageArray[i];

					// set the image name in storage to image1, image2 etc
					let imageRef = `image${num}`;
					
					
					let messageImageFileLocation = `businessImages/${this.props.match.params.BusinessKey}/${imageRef}.jpg`;
					let uploadTask = this.storageRef.child(messageImageFileLocation).put(img);
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
					    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
					    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
							
							// add the url of image to download array
							downloadArray.push(downloadURL);
							
							//increment counter 
							uploadCounter++;
							
							if(uploadCounter === this.imageArray.length){
								//once all image uploads have been completed add reference to images to firestore
								this._uploadRefToFirestore(downloadArray,"mainImages",()=>{
									this._handleThumbnailSubmit();
								});
							}
					    });
					})
			}else{
				//do nothing
				
				downloadArray.push(this.imageArray[i])
				uploadCounter++;
				if(uploadCounter === this.imageArray.length){
					//once all image uploads have been completed add reference to images to firestore
					this._uploadRefToFirestore(downloadArray,"mainImages",()=>{
						this._handleThumbnailSubmit();
					});
				}
			}

					
		}
				
	}

	_handleThumbnailSubmit(){
			
		//set variables
		let thumbnailDownloadArray = [];
		let uploadCounter = 0;

		for(let i = 0; i < this.thumbnailArray.length; i++){
			
			if(typeof this.thumbnailArray[i] !== "string"){

					let num = i + 1;
					// get image from image array
					let img = this.thumbnailArray[i];

					// set the image name in storage to image1, image2 etc
					let imageRef = `thumbnail${num}`;
					
					
					let messageImageFileLocation = `businessThumbnails/${this.props.match.params.BusinessKey}/${imageRef}.jpg`;
					let uploadTask = this.storageRef.child(messageImageFileLocation).put(img);
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
					    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
					    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
							
							// add the url of image to download array
							thumbnailDownloadArray.push(downloadURL);
							
							//increment counter 
							uploadCounter++;
							
							if(uploadCounter === this.imageArray.length){
								//once all image uploads have been completed add reference to images to firestore
								this._uploadRefToFirestore(thumbnailDownloadArray,"thumbnails",()=>{
									this.props.history.push(`/Business/${this.props.match.params.BusinessKey}`)
								});
							}
					    });
					})
			}else{
				thumbnailDownloadArray.push(this.thumbnailArray[i])
				uploadCounter++;
				if(uploadCounter === this.thumbnailDownloadArray.length){
					//once all image uploads have been completed add reference to images to firestore
					this._uploadRefToFirestore(thumbnailDownloadArray,"mainImages",()=>{
						this._handleThumbnailSubmit();
					});
				}
			}
		}
				
	}


	_uploadRefToFirestore(downloadArray,type,callback){
		// create references
		let firestore = firebase.firestore();
		let batch = firestore.batch();


		if(type === "thumbnails"){
			for(let i = 1; i < downloadArray.length; i++){
			

				//let num = i + 1;

				//create ref for each downloadURl / image
				let ref = firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessThumbnailImages").doc(`image${i}`);
				
				// create data from download array and caption obj
				let obj = {
					url:downloadArray[i],
					caption:this.captionObj[i]
				}
				// add to batch
				batch.set(ref,obj);
			}

		}else{
			//loop through download array
			for(let i = 1; i < downloadArray.length; i++){
			
				//let num = i + 1;
				
				//create ref for each downloadURl / image
				let ref = firestore.collection("Business").doc(this.props.match.params.BusinessKey).collection("businessImages").doc(`image${i}`);
				
				// create data from download array and caption obj
				let obj = {
					url:downloadArray[i],
					caption:this.captionObj[i]
				}
				// add to batch
				batch.set(ref,obj);
			}
		}

		// commit batch write
		batch.commit().then(()=>{
			//this.props.history.push(`/Business/${this.props.match.params.BusinessKey}`)
			callback()
		});
		
	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="row">
						<div className="col-sm-12">
							<p className="box"><Link to={'/Business/' + this.props.match.params.BusinessKey}>&#60; Back</Link></p>
							
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
									<img src={this.state.businessPic1}  id="businessPic1"  alt="" />
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
									<p>Image 1 caption:</p>
								</div>
								<div className="col-sm-6">
									<input type="text" id="1" onChange={this._handleCaptionChange.bind(this)} value={this.state.caption1} />
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
									<img src={this.state.businessPic2}  id="businessPic1"  alt="" />
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
									<p>Image 2 caption:</p>
								</div>
								<div className="col-sm-6">
									<input type="text" id="2" onChange={this._handleCaptionChange.bind(this)} value={this.state.caption2} />
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
									<img src={this.state.businessPic3}  id="businessPic2"  alt="" />
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
									<p>Image 3 caption:</p>
								</div>
								<div className="col-sm-6">
									<input type="text" id="3" onChange={this._handleCaptionChange.bind(this)} value={this.state.caption3} />
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
									<img src={this.state.businessPic3}  id="businessPic3"  alt="" />
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
									<p>Image 4 caption:</p>
								</div>
								<div className="col-sm-6">
									<input type="text" id="4" onChange={this._handleCaptionChange.bind(this)} value={this.state.caption4} />
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
									<img src={this.state.businessPic5}  id="businessPic4"  alt="" />
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
									<p>Image 5 caption:</p>
								</div>
								<div className="col-sm-6">
									<input type="text" id="5" onChange={this._handleCaptionChange.bind(this)} value={this.state.caption5} />
								</div>
							</div>
							
						</div>


						<div className="row text-center">

							<button onClick={this._handleImageSubmit.bind(this)}>Upload images</button>
						</div>
					</div>
				</div>
			</div>

		)
	}
}