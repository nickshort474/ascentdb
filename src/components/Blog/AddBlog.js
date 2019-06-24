import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {withRouter, Link} from 'react-router-dom';

import store from '../../redux/store';
import $ from 'jquery';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';
		
import ReactLoading from 'react-loading';


class AddBlog extends Component{

	constructor(){
		super();
		
		//set initial state
		this.state = {
			blogName:"",
			blogDescription:"",
			keyWord1:"",
			keyWord2:"",
			keyWord3:"",
			keyWord4:"",
			keyWord5:"",
		}
		
		//set reference to firestore
		this.firestore = firebase.firestore();

		//get user info from localstorage
		this.user = LocalStorage.loadState("user");
		
		//create blog KeyWord object
		this.blogKeywordObj = {};
		

	}
	
	componentWillMount() {
		//scroll to top
	    window.scrollTo(0, 0); 
   		
	}


	/*_handleSearchChoice(e){
		
		this.setState({
			blogType:e.target.value
		})
			
					
	}*/

	_handleKeywordInput(e){
		//set blog keyword in state for display
		this.setState({
			[e.target.id]:e.target.value
		})

		//set blog keyword in object
		this.blogKeywordObj[e.target.id] = e.target.value.trim().toLowerCase();

		//remove error indicator for input field
		$(`#${e.target.id}`).removeClass('formError');
	}

	_handleInput(e){
		
		//set state for other input fields
		this.setState({
			[e.target.id]:e.target.value
		})
		// remove formError class on user input
		$(`#${e.target.id}`).removeClass('formError');
	}

	_submitForm(e){
		e.preventDefault();
		
		//disable buttons on submit
		_disable();
		
		//set loading indicator to true
    	this.setState({
    		loading:true
    	});



    	// validate all form fields and assign errors to errorMsgs
		let errorMsgs = this._validate(this.state.blogName,this.state.blogDescription,this.state.keyWord1,this.state.keyWord2);
		
		//test for erros
		if(errorMsgs.length > 0){
			//create msgComp from erros
			let msgComp = errorMsgs.map((msg,index)=>{
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})

			let formattedComp = <div className="box">{msgComp}</div>
			
			this.setState({
				errors:formattedComp,
				loading:false
			})
			//enable buttons for re submit
			_enable();
		}else{
			
			//get whether blog has image from store (set in GetImage component)
			let storeState = store.getState();
			this.hasImage = storeState.blogHasImg;

			// test for name match
			this._testForName(()=>{
				
				//if callback no match exists so can be created
				let ref = this.firestore.collection("BlogNames").doc(this.state.blogName);
				
				//create reference to new blog location in firestore
				let docRef = ref.id;

				let now = Date.now();
				
				//create blog object
				let obj = {
					name:this.state.blogName,
	    			user:this.user,
	    			description:this.state.blogDescription,
	    			keywords:this.blogKeywordObj,
	    			creationDate:now
	    		}
	  		
	    		//if blog has image 
	    		if(this.hasImage){
	    			
	    			//add blog image to storage
	    			this._addBlogImage(docRef,(url)=>{

	    				//add referecne to image to blogObject
	    				obj["blogLogo"] = url;

	    				//set blogObject in firestore
	    				ref.set(obj).then((result)=>{
	    					//set keywords in firestore
	    					this._createKeywordReferences();
	    					//set other blog references in firestore
	    					this._sendFinalReferences();
	    					
	    				})
					})

	    		}else{
	    			//blog has no image
	    			obj["blogLogo"] = false;

	    			//set blog object in firestore
	    			ref.set(obj).then((result)=>{
	    				//set keywords in firestore
						this._createKeywordReferences();

						//set other blog references in firestore
						this._sendFinalReferences();
						
	    			})
	    		}
			})
		}
	}

	_testForName(callback){

		//create nameMatch var
		let nameMatch = false;

		//check whether blog name already exists
		let nameCheckRef = this.firestore.collection("BlogNames");
		let query = nameCheckRef.where("name", "==", this.state.blogName);

		query.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				
				// from returned data test if blog name exists set nameMatch accordinly
				if(snap.data().blogName){
					nameMatch = true;
				}else{
					nameMatch = false
				}
			})
			//test nameMatch var
			if(nameMatch === true){
				alert("Blog name already exists please try another");
				
				this.setState({
    				loading:false
    			});

				_enable();
			}else{
				callback();
			}
		})
	}



	_sendFinalReferences(){

		//set references in firestore to blog user list
		let newRef = this.firestore.collection("BlogUserList").doc(this.user).collection("blogs");
		newRef.add({"blogName":this.state.blogName});

		//set references to blog list
		let BlogRef = this.firestore.collection("Blogs").doc(this.user).collection(this.state.blogName);
		BlogRef.add({"empty":true});
		
		this.setState({
    		loading:false
    	});
		_enable();

		//redirect to MyBlog list
		this.props.history.push('/MyBlogs');
	}


	_createKeywordReferences(){
		
		//set date
		let now = Date.now();

		//create a batch write
		let batch = this.firestore.batch();

		//for each keyword at a write to the batch
		for(let val in this.blogKeywordObj){
			

			let ref = this.firestore.collection("KeyWords").doc(this.blogKeywordObj[val]).collection("blogs").doc();
			let obj = {
				blogName:this.state.blogName,
				creationDate:now
			}
			//set the batch
			batch.set(ref,obj);
		}
		//commit the batch write
		batch.commit();


		//copy complete keyword object
		let keyWordsToUpload = this.blogKeywordObj;
		
		//set counters
		let keyWordObjectLength = 0;
		let keyWordCounter = 0;

		// create reference to keyword in global keywordlist for easy searching
		for(let val in this.blogKeywordObj){
			
			//increment counter to hold reference for number of items in object
			keyWordObjectLength++;

			//test for whether there is already occurance of keyword in firestore
			let ref = this.firestore.collection("KeyWords").doc("KeyWordList").collection("list");
			let query = ref.where("word", "==", this.blogKeywordObj[val]);
			
			// eslint-disable-next-line
			query.get().then((snapshot)=>{
				
				//increment counter
				keyWordCounter++;

				snapshot.forEach((snap)=>{
					
					// if word exists snapshot will return with data, use this to remove that keyword from keyWordsToUpload
					if(snap.data().word){
						// word exists so delete from object
						delete keyWordsToUpload[val];
					}
				})
			// eslint-disable-next-line					
			}).then(()=>{
				
				//once all keywoprd have been tested keyWordCOunter matches keywordObject length so can upload non-matching keywords
				if(keyWordCounter === keyWordObjectLength){
					
					//loop through keyWordsToUpload and u 
					Object.keys(keyWordsToUpload).forEach((word)=>{
						
						ref.add({word:keyWordsToUpload[word]});
					})
				}
			})
		}

	}

	_addBlogImage(key, funcToCallBack){
		let storageRef = firebase.storage().ref();
		/*let files = document.getElementById("browse").files;
		let file;*/

		

		// get image from redux
		let file = store.getState().blogImg;

		let blogImageFileLocation = `blogLogo/${key}.jpg`;
		let uploadTask = storageRef.child(blogImageFileLocation).put(file);
		
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
		  
		  	uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			    funcToCallBack(downloadURL);
			 });

		   
		});

	}

	_validate(name, description,keyWord1,keyWord2){
	
		//store error messages in array
		const errorMsgs = [];

		//test data form each input field
		if (name.length < 1) {
		   errorMsgs.push("Please provide an blog name");
		   $('#blogName').addClass('formError');
		}

		
		if (description.length < 1) {
		   errorMsgs.push("Please provide a description for your blog");
		   $('#blogDescription').addClass('formError');
		}

		if(keyWord1 < 1){
			errorMsgs.push("Please provide a primary keyword");
		    $('#keyWord1').addClass('formError');
		}
		if(keyWord2 < 1){
			errorMsgs.push("Please provide a secondary keyword");
		    $('#keyWord2').addClass('formError');
		}
  		return errorMsgs;
	}

	render(){

		let loadingCircle;
		
		if(this.state.loading){
			loadingCircle = <ReactLoading  id="loadingCircle" type="spin" color="#00ff00" height={25} width={25} />
		}else{
			loadingCircle = <p></p>
		}
		

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box greyedContent">
					   		<Link to="/MyBlogs">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box greyedContent">
					   
				                	<h3>Add a blog</h3>
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box greyedContent">        
				                    <form onSubmit={this._submitForm.bind(this)}>
				                    	<div className="form-group">
				                            <label htmlFor="blogName">Blog name</label>
				                            <input type="text"  id="blogName" className="form-control" value={this.state.blogName} placeholder="Give your blog" onChange={this._handleInput.bind(this)}  />
				                           
				                        </div>
				                        

				                        <div className="form-group">
				                        	<label htmlFor="blogDescription">Blog Description</label>
				                        	<input type="text" id="blogDescription" className="form-control"  value={this.state.blogDescription} placeholder="Describe your blog" onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <br />
				                        <div className="form-group">
				                        	<h4>Please provide some keywords to help people find your blog:</h4>
				                            <label htmlFor="Keyword1">Keyword 1</label>
				                            <input type="text" id="keyWord1" value={this.state.keyWord1} className="form-control" onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 1" /><br />

				                            <label htmlFor="Keyword2">Keyword 2</label>
				                            <input type="text" id="keyWord2" value={this.state.keyWord2}  className="form-control" onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 2" /><br />

				                            <label htmlFor="Keyword3">Keyword 3</label>
				                            <input type="text" id="keyWord3" value={this.state.keyWord3} className="form-control"  onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 3" /><br />

				                            <label htmlFor="Keyword4">Keyword 4</label>
				                            <input type="text" id="keyWord4" value={this.state.keyWord4} className="form-control"  onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 4" /><br />

				                            <label htmlFor="Keyword5">Keyword 5</label>
				                            <input type="text" id="keyWord5" value={this.state.keyWord5} className="form-control"  onChange={this._handleKeywordInput.bind(this)} placeholder="Keyword 5" /><br />								
				                        </div>
				                        <GetImage prompt="Add image for blog display" comp="AddBlog" />
				                       	<div className="text-center">
					                       	{this.state.errors}
					                        <button type="submit" className="btn btn-primary">Submit</button>
				                        </div>
				                        <div>
				                        	{loadingCircle}
				                        </div>
				                    </form>
				                </div>
				            </div>
		                </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}

export default withRouter(AddBlog);