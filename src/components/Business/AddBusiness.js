import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import '@firebase/storage';

import {Link, withRouter} from 'react-router-dom';
import $ from 'jquery';

import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';

import defaultLogo from '../../assets/images/default.jpg';
import {_disable,_enable} from '../../utils/DisableGreyOut';
import {_compressImage} from '../../utils/CompressImage';

import LocalStorage from '../../utils/LocalStorage';
import ReactLoading from 'react-loading';


const google = window.google;


class AddBusiness extends Component{

	constructor(){
		super();

		// set initial state
		this.state = {
			businessName:"",
			businessLocation:"",			
			businessSummary:"",
			businessDescription:"",
			businessEmail:"",
			businessWebpage:"",
			businessPhone:"",
			
		}

		//get user id form storage
		this.userUID = LocalStorage.loadState("user");
		
		//save current page to store
		store.dispatch({type:constants.SAVE_PAGE, page:"AddBusiness"});

  		this.textStyle = {
    		fill: '#ffffff',
   			textAnchor: 'middle'
  		};
		
  		this.businessThumbnail = null;

  		// prevent enter key from submiting data too early
		$(document).on("keypress", ":input:not(textarea):not([type=submit]):not(button)", function(event) {
   			
   			 if(event.keyCode === 13){
   			 	event.preventDefault();
   			 }
		});

	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}
	


	_handleInput(e){
		
		//handle input fields		
		this.setState({
			[e.target.id]:e.target.value
		})

		//remove error indications on new input
		$(`#${e.target.id}`).removeClass('formError');
	}

	_handleBrowseClick(){
	   
		//handle browse click for adding images	   
	    var fileinput = $("#browse");
	    fileinput.click();
	}

	_onSuggestSelect(suggest) {
		
		//handle suggestion from GeoSuggest component
		if(suggest){
			this.setState({
				businessLocation:suggest.gmaps.formatted_address,
				lat:suggest.location.lat,
				lng:suggest.location.lng
			})
		
		}

		//remove error indicator once suggestion has been selected
		$('#geoSuggest').removeClass('formError');
    	
  	}

  	_previewImage(e){
		
		//setup file reader
		let reader = new FileReader();

		//handfle onload event
		reader.onload = (e) =>{
			
			//compress image using outside component
			_compressImage(e.target.result, 200, (result)=>{
				
				//get result from compression				
				this.businessThumbnail = result;
								
			})

			//set preview image from file reader
			$('#previewImage').attr("src", e.target.result);
		}

		//read image data 
		reader.readAsDataURL(e.target.files[0]);
		
	}


	_onSubmit(e){
		e.preventDefault();

		//dsiable buttons and show loading circle
		_disable();

		this.setState({
    		loading:true
    	});

		//call validate passing values
		let errorMsgs = this._validate(this.state.businessName,this.state.businessLocation,this.state.businessSummary,this.state.businessDescription)
		
		//test whether there are any errors
		if(errorMsgs.length > 0){

			//create msgComp to display error messages
			let msgComp = errorMsgs.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>
			this.setState({
				errors:formattedComp
			})

			//enable buttons and hide loading circle
			_enable();
			this.setState({
    			loading:false
    		});
			
		}else{

			//if no errors set reference to firstore and business section
			this.firestore = firebase.firestore();
			let docId = this.firestore.collection("Business").doc();
							
			//add business image to storage
			this._addBusinessImage(docId.id, (callBackParam) =>{
				
				
				let businessLogo;

				//set businessLogo based on upload result
				if(callBackParam === "noImage"){
					businessLogo = false;
					
				}else{
					businessLogo = callBackParam;
					
				}

				let now = Date.now();

				//create data object
				let postData = {
					businessName:this.state.businessName,
					location:this.state.businessLocation,
					lng:this.state.lng,
					lat:this.state.lat,
					summary:this.state.businessSummary,
					description:this.state.businessDescription,
					phone:this.state.businessPhone,
					email:this.state.businessEmail,
					webpage:this.state.businessWebpage,
					key:docId.id,
					businessLogo:businessLogo,
					date:Date.now(),
					creator:this.userUID,
					creationDate:now

				}

				//write data to firebase
				docId.set(postData);
				
				//set reference to business in profile of user uplaoding business
				this._addBusinessToUserProfile(docId.id, () =>{
					
					//enable buttons and hide loading circle
					_enable()
					this.setState({
    					loading:false
    				});
    				
    				//redirect to thank you
					this.props.history.push('/ThankYouForListing');
				})
				
			});
			
		}
		

		
	}

	_validate(name, location, summary, description){
		
		//store error messages in array
		const errorMsgs = [];

		//run validation on each field
		if (name.length < 1) {
		   errorMsgs.push("Please provide a business name");
		   $('#businessName').addClass('formError');
		}

		if (location.length < 1) {
		   errorMsgs.push("Please provide a location for your business");
		    $('#geoSuggest').addClass('formError');
		}
		if (summary.length < 1) {
		   errorMsgs.push("Please provide a summary for your business");
		   $('#businessSummary').addClass('formError');
		}
		if (description.length < 1) {
		   errorMsgs.push("Please provide a description for your business");
		   $('#businessDescription').addClass('formError');
		}
  		return errorMsgs;
	}


	_addBusinessToUserProfile(key, funcToCallBack){
		
		//set reference to People section
		let ref = this.firestore.collection("People");

		//find current user based on their uid
		let query = ref.where("uid", "==", this.userUID);
		query.get().then((snapshot)=>{
			
			//update this users associated business
			snapshot.forEach((element)=>{
				this.firestore.collection("People").doc(this.userUID).update({business:key});
			})
			//callback to continue
			funcToCallBack();
		})
		
	}


	_addBusinessImage(key, funcToCallBack){
		
		//set initial storage reference
		let storageRef = firebase.storage().ref();

		//test whether there is image to upload	
		if(this.businessThumbnail !== null){

			//create file location using key (location of business in firestore)
			let businessImageFileLocation = `businessLogos/${key}.jpg`;

			//upload businessThumbnail to storage
			let uploadTask = storageRef.child(businessImageFileLocation).put(this.businessThumbnail);
			
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
			    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
					//callback with url of businessThumbnail
					funcToCallBack(downloadURL);
			  	})
			   
			});

		}else{
			//callback with no image
			funcToCallBack("noImage");
		}
				
		
	}

	

	




  
	render(){


		let loadingCircle;

		// show or hide loading cirlce based on state
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
					   		<Link to="/Business">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box greyedContent">
				                	<h2>Register</h2>
				                    <p>Register your business and get the benefits of CombatDB registration</p>
				                   
			                    </div>
			                </div>

			                <div className="col-sm-9">
			                	<div className="box greyedContent">

				                    <form onSubmit={this._onSubmit.bind(this)}>

				                    	<div className="form-group">
				                            <label htmlFor="businessName">Business name<span>*</span></label>
				                            <input type="text" className="form-control" id="businessName" value={this.state.businessName} onChange={this._handleInput.bind(this)}/>
				                        </div>

				                        <div className="form-group">
				                            <label>Business Address<span>*</span></label><br />
				                           
				                           <div>
					                            <Geosuggest
										          ref={el=>this._geoSuggest=el}
										          placeholder="Search for your address"
										          onSuggestSelect={this._onSuggestSelect.bind(this)}
										          location={new google.maps.LatLng()}
										          radius="20" 
										          id="geoSuggest"
										        />
									        </div>
				                        </div>
										<div className="form-group">
				                            <label htmlFor="businessSummary">Summary of your business:<span>*</span></label><br />
				                            <textarea  id="businessSummary" value={this.state.businessSummary} className="form-control" onChange={this._handleInput.bind(this)}></textarea>
				                        </div>

				                       

				                        <div className="form-group">
				                            <label htmlFor="businessDescription">Full description here:<span>*</span></label><br />
				                            <textarea id="businessDescription" value={this.state.businessDescription} className="form-control" onChange={this._handleInput.bind(this)}></textarea>
				                        </div>

				                        <div className="form-group">
				                            <label htmlFor="businessPhone">Contact number:</label><br />
				                            
				                            <input type="text" id="businessPhone" value={this.state.businessPhone} className="form-control" onChange={this._handleInput.bind(this)}/>
				                        </div>

				                        <div className="form-group">
				                            <label htmlFor="businessEmail">Contact email:</label><br />
				                            
				                            <input type="email" id="businessEmail" value={this.state.businessEmail} className="form-control" onChange={this._handleInput.bind(this)}/>
				                        </div>
				                        <div className="form-group">
				                            <label htmlFor="businessWebpage">Website:</label><br />
				                            
				                            <input type="email" id="businessWebpage" value={this.state.businessWebpage} className="form-control" onChange={this._handleInput.bind(this)}/>
				                        </div>
				                        <div className="form-group text-center">
											<p>Add a business logo:</p>
											<input type="file" id="fileUpload" style={{display:"none"}} name="pic" onChange={this._previewImage.bind(this)} accept="image/*" />
											<input type="button" className="btn btn-primary"   value="Add Image" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} /><br />
											<img src={defaultLogo} id="previewImage" className="img-thumbnail" width="200px" height="200px" alt="Preview" />
											
										</div>  
										<div className="text-center">
											{this.state.errors}
				                       		<button type="submit" className="btn btn-primary">Submit</button>
				                        </div>
				                 		 
				                    </form>
				                    <div>
	                        			{loadingCircle}
	                        		</div> 
			                    </div>
			                </div>

	                    </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}

export default withRouter(AddBusiness);