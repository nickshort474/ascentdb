 import React, {Component} from 'react';
import { withRouter,Link } from 'react-router-dom';
import {firebase} from '@firebase/app';

import TextArea from '../../utils/TextArea'
import {_compressImage} from '../../utils/CompressImage';
import {_enable,_disable} from '../../utils/DisableGreyOut';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';
		
import ReactLoading from 'react-loading';
import $ from 'jquery';


 class AddBlogPost extends Component{

	constructor(){
		super();
		
		//set initial state
		this.state = {
			blogContent:[],
			firstPara:"",
			firstImage:"",
		}

		//set initial variables
		this.contentNum = 0;
		this.contentLog = [];
		this.imgArray = [];
		this.paraArray = [];
		this.imageUploadCounter = 0;
		this.paraUploadCounter = 0;
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		this.hasImage = false;
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);

		//save reference to this page in store
		store.dispatch({type:constants.SAVE_PAGE, page:`/AddBlogPost/${this.props.match.params.BlogName}`});
		
		//run first instance of addPara function
	    this._addPara();
	    
	   	
	}



	_addPara(){

		//increment content number variable
		this.contentNum++

		//set current value from content number to be used when uploading content to firestore
		let currentVal = `par${this.contentNum}`;

		//set removeContent variable from current value for use in deleting content
		this.removeContentId = currentVal;

		//add currentVal to content array and paragraph array for use in upload loop
		this.contentLog.push(currentVal);
		this.paraArray.push(currentVal);

		//get all current content containers from state
		let newblogContent = this.state.blogContent;
		
		//push new content  container
		newblogContent.push(<div key={currentVal}><TextArea rows="3" id={currentVal} key={currentVal}  /></div>);
		
		//add newly updated content containers back to state
		this.setState({
			blogContent:newblogContent,
			
		},function(){
			//focus on new paragrpah ready for data entry
			document.getElementById(currentVal).focus();
			
		});
	
	}

	_removeContent(e){

		//get id
		let id = e.target.id;
		
		//get existnig content from state
		let existingBlogContent = this.state.blogContent;

		//get rid of last content from state.blogContent to update display
		existingBlogContent.pop();
				
		//get rid of last content from contentLog for uploading of content
		this.contentLog.pop();

		//get content type from id
		let contentType = id.slice(0,3);

		//test whether contentType is para or img then remove from relevant array
		if(contentType === "par"){
			this.paraArray.pop();
		}else{
			this.imgArray.pop();
		}

		//decrement content container number
		this.contentNum--;
		
		//set new content containers in state
		this.setState({
			blogContent:existingBlogContent
		})
	}


	_handleBrowseClick(){
	   //handle browse click for adding images
	    var fileinput = $("#browse");
	    fileinput.click();
	}


	_handleImageChange(event){
		
		//handle adding of images
		var reader = new FileReader();
		
		reader.onload = (e) => {
			
			//increment content number variable
			this.contentNum++;
		
			//set current value from content number
			let currentVal = `img${this.contentNum}`;
			
			//add current value to content log and remove log
			this.contentLog.push(currentVal);
			this.removeContentId = currentVal;

			//run compress image funciton (outside component)
			_compressImage(e.target.result,400,(result)=>{
				//push compressed image to image array
				this.imgArray.push(result);
				
			})
			
			//get current content containers from state
			let newblogContent = this.state.blogContent;
			//add new container
			newblogContent.push(<div key={currentVal}><img src={e.target.result} width='50%' height='50%' id={currentVal} alt="" /><br /></div>);
			
			//set updated contianers to state
			this.setState({
				blogContent:newblogContent,
				
			});
		}

		//read data
		reader.readAsDataURL(event.target.files[0]);
		//set variable for has image
		this.hasImage = true;
	}


	_handleSubmit(){
		
		//disable buttons
		_disable();

		//set state for laoding circle
		this.setState({
    		loading:true
    	});
		
		//set first content variables to true for initial writes
		this.isFirstPara = true;
		this.isFirstImage = true;
		
		this.blogPostListAdded = false;
		
		//set reference to post in users Blogs section
		let ref = this.firestore.collection("Blogs").doc(this.userUID).collection(this.props.match.params.BlogName).doc(this.state.postName).collection("contentBlocks");
		
		//set arrayNUm variable to use in looping through image array
		this.arrayNum = 0;
		
		//loop through content log
		this.contentLog.forEach((object) =>{
			

			//get string from objcet to test whether content is paragraph or image
			let strObj = object.toString().slice(0,3);
			
			//get time
			let time = Date.now();
			
			//if content is paragraph
			if(strObj === "par"){
				
				//get content of first paragraph
				let content = $(`#${object}`).val();
				
				//if first paragraph
				if(this.isFirstPara === true){

					//set variable for next test
					this.isFirstPara = false;

					//add that paragrpah to this.firstPara for adding to _addBlogPostList()
					this.firstPara = content;
					
				}
				
				//create paragraph object
				let obj = {
					type:"para",
					data:content,
					time:time
				}

				//add object to firestore
				ref.add(obj).then((docRef)=>{

					//increment upload counter
					this.paraUploadCounter++;

					// test whether firstImage has been assigned a url or post has no image and firstPara has content 
					if((this.isFirstImage === false || this.hasImage === false) && this.isFirstPara === false && this.blogPostListAdded === false){
						
						//add blog post to list
						this._addBlogPostList();
						this.blogPostListAdded = true;
					}
					//test upload counters against array lengths to check if finished uploading all content
					if(this.imageUploadCounter === this.imgArray.length && this.paraUploadCounter === this.paraArray.length){
						
						// All content has been uploaded can route back to display
						// stop loading circle
						this.setState({
    						loading:false
    					});
    					//enable all buttons
						_enable();
						//redirect to blog post list
						this.props.history.push("/MyBlogPostList/" + this.userUID + "/" + this.props.match.params.BlogName);
					}
				});
				
			}else{
				
				// get reference to firestore document for saving as file name of image in storage
				let docRef = ref.doc();

				//get image from image array
				let img = this.imgArray[this.arrayNum];
				
				//increment arrayNum ready for next image
				this.arrayNum++;
				
				//add image to storage
				this._addImageToStorage(docRef.id, img, (url)=>{
					
					//if first image set bool for next test and set first image URL for _addBlogPostList()
					if(this.isFirstImage === true){
						
						this.isFirstImage = false;
						this.firstImage = url;
					}

					//create object
					let obj = {
						type:"img",
						data:url,
						time:time
					}

					//set object in firestore
					docRef.set(obj).then(()=>{

						//test whether isFirstImage and isFirstPara are false (set at line 215, 274) so now have the content to add  to _addBlogPostList();
						if(this.isFirstImage === false && this.isFirstPara === false && this.blogPostListAdded === false){
							
							this._addBlogPostList();
							this.blogPostListAdded = true;
						}

						if(this.imageUploadCounter === this.imgArray.length && this.paraUploadCounter === this.paraArray.length){
							
							// All content has been uploaded, stop loading circle, enable buttons and route back to display
							this.setState({
    							loading:false
    						});
							_enable();
							this.props.history.push("/MyBlogPostList/" + this.userUID + "/" + this.props.match.params.BlogName);
						}

						
					});

					
					
				});
				
			}
		})
		this._addFollowersReference();
	}



	_addImageToStorage(imgRef,img,callback){
		
		//setup reference
		let storageRef = firebase.storage().ref();
		// upload img to storage
		let blogImageFileLocation = `blogImages/${this.props.match.params.BlogName}/${imgRef}.jpg`;
		let uploadTask = storageRef.child(blogImageFileLocation).put(img);

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
			}, () => {
			    // Handle successful uploads on complete
			    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
			    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
					this.imageUploadCounter++;
					callback(downloadURL);
					


			    });
			})
	}


	_addFollowersReference(){
		
		//set reference to followers of this blog 
		let ref = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
		
		//create follower array
		let followerArray = [];
		//get post name
		let postName = this.state.postName;

		//get followers of this blog
		ref.get().then((snapshot)=>{
			
			
			snapshot.forEach((snap)=>{
				//add each follower to array
				followerArray.push(snap.id);
			})
			return followerArray
		}).then((array)=>{
			
			//create batch write
			let batch = this.firestore.batch();
			
			let now = Date.now();
			
			//for each follower of this blog set a reference to this new post in their PostFollowing section for display in their feed.
			array.forEach((value)=>{
				let ref = this.firestore.collection("userUIDs").doc(value).collection("PostFollowing").doc();
				batch.set(ref, {blogName:this.props.match.params.BlogName,postName:postName,date:now,type:"blog"})
			})
			//commit batch write
			batch.commit().then((value)=>{
				
			})

		})
	}


	_addBlogPostList(){

		//set reference to blog post in blog post list
		let ref = this.firestore.collection("BlogPostList").doc(this.userUID).collection(this.props.match.params.BlogName);
		
		let currentDate = Date.now();
		
		//set object with first paragraph, date and post name to save in Blog post list
		let obj = {
			postIntro:this.firstPara,
			postName:this.state.postName,
			date:currentDate
		}

		//if post has images add first image to object
		if(this.hasImage === true){
			obj["firstImage"] = this.firstImage;
		}else{
			obj["firstImage"] = false;
		}
		//add object to firestore
		ref.add(obj).then(()=>{
			
		})
	}


	
	_handlePostName(e){
		//set post name
		this.setState({
			postName:e.target.value
		})
	}

	

	render(){
		
		//loop through blog content from state to display on page
		let blogContent = this.state.blogContent.map((content)=>{
			
			return <div key={content.key}>{content}</div>
		})


		const style = {
			width:"60%",
			fontSize:"18px"
		}
		
		let loadingCircle;

		//test for loading circle needed
		if(this.state.loading){
			loadingCircle = <ReactLoading  id="loadingCircle" type="spin" color="#00ff00" height={25} width={25} />
		}else{
			loadingCircle = <p></p>
		}

		
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row box greyedContent">
			        		<div className="col-sm-12">
			        		
			        			<Link to={`/MyBlogPostList/${this.userUID}/${this.props.match.params.BlogName}`}>&lt; Back</Link>
			        		
			        		</div>
			        	</div>
			        	<div className="row box greyedContent">
				        	<div className="col-sm-12">
				        		
				        		<div className="">
				        			
				        			
				        			<input type="text" id="postNameBox" style={style} rows="1" placeholder="Post name"  onChange={this._handlePostName.bind(this)} /><br /><br />
				        			
				        			{blogContent}
									<button className="btn btn-primarySmall" onClick={this._addPara.bind(this)}>Add paragraph</button>
									<input type="file" id="browse" name="fileupload" style={{display:"none"}} onChange={this._handleImageChange.bind(this)} />
									<input type="button" className="btn btn-primarySmall" value="Add Image" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} />
									<button className="btn btn-primarySmall" id={this.removeContentId} onClick={this._removeContent.bind(this)}>Remove last content</button>
				        		</div>
				    		</div>
				        </div>
				      
						<div className="row text-center">	
							
								
							<input type="button" className="btn btn-primarySmall" value="Save blog post" id="save" onClick={this._handleSubmit.bind(this)} />
													
								
							 

						</div>
						<div>
                        	{loadingCircle}
                        </div>
		            </section>
		        </div>
                
			</div>

		)
	}

}
export default  withRouter(AddBlogPost);