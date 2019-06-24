import React, {Component} from 'react';
import {withRouter,Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import {_compressImage} from '../../Components/CompressImage';
import {_handleDisable} from '../../Components/HandleDisable';


import store from '../../redux/store';
import constants from '../../redux/constants';


class NewCommunityMessage extends Component{
	
	constructor(){
		super();
		
		// save cuurent page to redux
		store.dispatch({type:constants.SAVE_PAGE, page:"NewCommunityMessage"});

		// get current user from store
		let storeState = store.getState();
		this.user = storeState.userUID;
		this.userName = storeState.userName;
		console.log(this.userName);

		// setup initial state
		this.state = {
			subject:"",
			content:"",
			items:[],
			
			
		}
		
		
	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
				
	}


	_handleBrowseClick(){
	   
	    var fileinput = document.getElementById("browse");
	    fileinput.click();
	}

	_handleSubjectChange(e){
		e.preventDefault();
		this.setState({
			subject:e.target.value
		})

	}

	_handleContentChange(e){
		e.preventDefault();
		this.setState({
			content:e.target.value
		})
	}
	
	_handleMessagePic(e){
		
		let reader = new FileReader();
		
		 reader.onload = (e) => {
			
			_compressImage(e.target.result,(result)=>{
				
				var urlCreator = window.URL || window.webkitURL;
				let objUrl = urlCreator.createObjectURL(result);
								
				this.setState({
					messagePic:objUrl,
					messageBlob:result,
					hasImage:true
				})
				
			})
			
		}
		reader.readAsDataURL(e.target.files[0]);


	}



	_handlePost(e){
		e.preventDefault();

		//this._handleDisable();
		_handleDisable();
		//determine if private message
		
		//handle public message
		
		// collect data
		let subject = e.target.subject.value;
		let content = e.target.content.value;

		// setup firestore ref
		let firestore = firebase.firestore();

		
		// set ref for user in Messages section
		let ref = firestore.collection("CommunityMessages").doc();
	
		//get date time
		let now = Date.now();
		
		//get doc id of ref
		
		console.log(ref.id);

		//upload image to storage
		this._uploadImage(ref.id, this.state.messageBlob, (url)=>{
			

			// create object data
			let obj = {
				messageSubject:subject,
				messageContents:content,
				messageImage:url,
				messageDate:now,
				messageUser:this.user,
				messageUserName:this.userName,
				messageID:ref.id
			}

			//add message data to Messages section in firestore
			ref.set(obj).then(()=>{
									
				this.props.history.push('/Community');
				
			});
		});
			
		
	}





	_uploadImage(imgRef, img, callback){

		if(this.state.hasImage){
			let storageRef = firebase.storage().ref();
			
			// upload img to storage
			let messageImageFileLocation = `message_images/${imgRef}.jpg`;
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
				}, () => {
				    // Handle successful uploads on complete
				    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
				    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
						callback(downloadURL);
				    });
				})
		}else{
			callback("no image");
		}
	}


	

	render(){

	


		return(
							
		    <div className="container">
			 	<section className="content-wrapper">
					<div className="box">
					   		<Link to="/Community">&lt; Go back</Link>
					</div>
					<div className="box">
						<div className="row">
							<h2 className="text-center">New Community Message</h2>
							
						</div>
					</div>	
				<form onSubmit={this._handlePost.bind(this)} action="">	
					<div className="box text-center">
						<div className="row form-group">
							<div className="col-sm-3">
								<label htmlFor="subject">Subject</label>
							</div>
							<div className="col-sm-9">
								<input type="text" id="subject" value={this.state.subject} placeholder="Subject" onChange={this._handleSubjectChange.bind(this)}/>
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-3">
								<label htmlFor="content">Content</label>
							</div>
							<div className="col-sm-9">
								<textarea id="content" value={this.state.content} placeholder="content" onChange={this._handleContentChange.bind(this)} />
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-3">
								<label htmlFor="image">Image</label>
							</div>
							<div className="col-sm-9">
								<input type="file" id="browse" name="fileUpload" style={{display:"none"}} onChange={this._handleMessagePic.bind(this)} />
								<input type="button" value="Add Image" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} className="btn btn-primary extraMargin"/>
							</div>	
							<div>
								<img src={this.state.messagePic}  id="messagePic"  alt="" />
							</div>
						</div>
					</div>
						
					<div className="box text-center">
						
						<button type="submit" value="Post message" className="btn btn-primary extraMargin">Submit</button>

						
					</div>

					
				</form>		
					
					
				</section>
			</div>
			

		)
	}
}

export default withRouter(NewCommunityMessage);