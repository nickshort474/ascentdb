import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {firebase} from '@firebase/app';


import Datetime from 'react-datetime';
import moment from 'moment';
import Geosuggest from 'react-geosuggest'; 
import $ from 'jquery';

import GetImage from '../../utils/GetImage';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';
import ReactLoading from 'react-loading';

const google = window.google;


class AddEvents extends Component{

	constructor(){
		super();
		
		//set initial state
		this.state = {
			eventName:"",
			eventLocation:"",
			eventDescription:"",
			eventPhone:"",
			eventEmail:"",
			eventWebPage:"",
			eventTime:"",
			eventTimeFormat:false
			
		}

		//save page to store
		store.dispatch({type:constants.SAVE_PAGE, page:"AddEvents"});

		//set event has image to false ready for adding of new image in GetImage component
		store.dispatch({type:constants.EVENT_HAS_IMAGE, eventHasImg:false})
		
		//get user id form store		
		this.userUID = LocalStorage.loadState("user");
		
		//set base firestore ref
		this.firestore = firebase.firestore();

		//set initial variables
		this.hasImage = false;
		

		// prevent enter key from submiting data too early
		$(document).on("keypress", ":input:not(textarea):not([type=submit])", function(event) {
   			
   			 if(event.keyCode === 13){
   			 	event.preventDefault();
   			 }
		});

	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}

	componentDidMount(){

		//get reference to date time container
		this.eventDateTimeDiv = document.getElementById("dateTimeContainer");
	}


	_onSuggestSelect(suggest) {
		
		//handle suggestion from GeoSuggest component
		if(suggest){
			
	    	this.setState({
	    		eventLocation:suggest.gmaps.formatted_address,
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,

	    	})
				    	
	    }

	    //remove error indicator on new input
	    $('#geoSuggest').removeClass('formError');
  	}

	
	_handleInput(e){
		
		//handle input field data
		this.setState({
			[e.target.id]:e.target.value
		})

		//remove error indicator on new input
		$(`#${e.target.id}`).removeClass('formError');
	}


	_handleDateTimeChange(dateObject){
		
		//handle date time selection from DateTime component
		if(typeof dateObject === 'object'){
			
			//set unix time from date time component
			let unix = moment(dateObject).unix() * 1000;
			
			//set sate to display time	
			this.setState({
				eventTime:unix,
				eventTimeFormat:true
			})
			
			//remove error indicator
			this.eventDateTimeDiv.setAttribute("style", "border:none")
		}else{
			
			// false input to DateTime
			this.setState({
				eventTime:1,
				eventTimeFormat:false
			})
			//add red border for text input of time suggest box to indicate error
			this.eventDateTimeDiv.setAttribute("style", "border:2px solid red")
		}
	}
		
	

	_onSubmit(e){
		e.preventDefault();
		
		//disable buttons
		_disable();

		//show loading circle
		this.setState({
    		loading:true
    	});	

		//validate form fields
		let errorMsgs = this._validate();
		
		// if returned error msg array has errors
		if(errorMsgs.length > 0){
			
			//create error msg component
			let msgComp = errorMsgs.map((msg,index)=>{
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})

			let formattedComp = <div className="box">{msgComp}</div>
			//set state to display error messages
			this.setState({
				errors:formattedComp
			})
			
			//enable buttons and clear loading circle
			_enable();
			this.setState({
    			loading:false
    		});	
		}else{
			// no errors
			//get whether event has associated image from store (saved in GetImage comp)
			let storeState = store.getState();
			this.hasImage = storeState.eventHasImg;

			//test for matching event names
			this._testForName(()=>{
				
				//if name doesnt exist callback continues

				//set ref to events section
				let ref = this.firestore.collection("Events").doc();

				//get ref to doc
				let docRef = ref.id;
				
				//set date
				let now = Date.now();

				//create date object
				let eventObj = {
					eventName:this.state.eventName,
					eventLocation:this.state.eventLocation, 
					eventDescription:this.state.eventDescription,
					eventPhone:this.state.eventPhone,
					eventEmail:this.state.eventEmail,
					eventWebPage:this.state.eventWebPage,
					eventTime:this.state.eventTime,
					lat:this.state.lat,
					lng:this.state.lng,
					creator:this.userUID,
					hasLogo:this.hasImage,
					eventID:docRef,
					creationDate:now
				}

				//if event has image
				if(this.hasImage){

					//add image to storageusing document reference
					this._addEventImage(docRef,(url)=>{
						
						//get returned image url from upload and add to event object
						eventObj["eventLogo"] = url;
						
						//add object to firestore
						ref.set(eventObj).then(()=>{
							
							//enable buttons
							_enable();

							//clear loading circle
							this.setState({
				    			loading:false
				    		});	

							//redirect back to events page
							this.props.history.push('/Events');
						})
					})
				}else{
					//if no image add false ref to event object
					eventObj["eventLogo"] = false;
					
					//add object to firestore
					ref.set(eventObj).then(()=>{
						
						//enable buttons
						_enable();

						//clear loading circle
						this.setState({
			    			loading:false
			    		});	

						//redirect to events page
						this.props.history.push('/Events');
					})
				}
			});
		}
		

		
	
	}

	_validate(name, location, time, description){
	
		//store error messages in array
		const errorMsgs = [];

		//validate input data
		if (this.state.eventName.length < 1) {
		   errorMsgs.push("Please provide an event name");
		   $('#eventName').addClass('formError');
		}

		if (this.state.eventLocation.length < 1) {
		   errorMsgs.push("Please provide a location for your event");
		    $('#geoSuggest').addClass('formError');
		}
		if (this.state.eventTime === 1) {
		   errorMsgs.push("Please provide a time for your event");
		   $('#dateTimeContainer').addClass('formError');
		}
		if (this.state.eventDescription.length < 1) {
		   errorMsgs.push("Please provide a description for your event");
		   $('#eventDescription').addClass('formError');
		}

		//return array
  		return errorMsgs;
	}

	_testForName(callback){
		//check whether event name already exists

		//set name match var
		let nameMatch = false;

		//set ref to events section
		let nameCheckRef = this.firestore.collection("Events");

		//set query with newly chosen event name
		let query = nameCheckRef.where("eventName", "==", this.state.eventName);
		
		//get query
		query.get().then((snapshot)=>{
			
			//loop through snapshot
			snapshot.forEach((snap)=>{
				
				//if data in snapshot then name exists
				if(snap.data().eventName){
					nameMatch = true;
				}else{
					nameMatch = false
				}
			})

			//if name match is true name exists 
			if(nameMatch === true){

				//stop laoding circle
				this.setState({
			    	loading:false
			    });	

				//enable buttons
				_enable();
				//inform user
				alert("Event name already exists please try another");
				
			}else{
				//name doesnt exist, callback to continue
				callback();
			}

			
			
		})
	}


	_addEventImage(key, funcToCallBack){
		
		//set up storage ref
		let storageRef = firebase.storage().ref();
		
		// get image from redux
		let file = store.getState().eventImg;

		//set up file name based on doc id fro firestore passed in
		let eventImageFileLocation = `eventLogos/${key}.jpg`;

		//set upload task
		let uploadTask = storageRef.child(eventImageFileLocation).put(file);
		
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
		    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			    //pass download url back
			    funcToCallBack(downloadURL);
			 });

		   
		});

		
				
		
	}

	render(){

		let loadingCircle;

		//set loading circle
		if(this.state.loading){
			loadingCircle = <ReactLoading  id="loadingCircle" type="spin" color="#00ff00" height={25} width={25} />
		}else{
			loadingCircle = <p></p>
		}


		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	
			        	<div className="box">
					   		<Link to="Events">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
				                	<h2>Register</h2>
				                   
				                    <ul>
				                    	<li>Free event advertising on the site.</li>
				                        <li>A place to promote your organization.</li>
				                        <li>Attract more people, sell more tickets</li>
				                        
				                    </ul>
			                    </div>
			                </div>

			                <form onSubmit={this._onSubmit.bind(this)}>
				                <div className="col-sm-9">
				                	<div className="box">
				                    

				                    	<div className="form-group">
				                            <label htmlFor="eventName">Event name <span>*</span></label>
				                           <input type="text" className="form-control"   id="eventName" value={this.state.eventName} onChange={this._handleInput.bind(this)} />
				                        </div>

				                        <div className="form-group">
				                            <label>Event location <span>*</span></label>
				                            <Geosuggest ref={el=>this._geoSuggest=el}	
				                              	placeholder="Search for your address"
								          		onSuggestSelect={this._onSuggestSelect.bind(this)}
								          		location={new google.maps.LatLng()}
								         		radius="20"
								         		id="geoSuggest"
								         		
								         	/>

					                       
				                        </div>

				                       <div className="form-group">
				                       		
				                       		<label>Event time <span>*</span></label>
				                       		<div id='dateTimeContainer' style={this.dateTimeStyle}>
				                       			<Datetime id="dateTime"  dateFormat="dddd, MMMM Do YYYY"  onChange={this._handleDateTimeChange.bind(this)}/>
				                       		</div>
				                       </div>

										<div className="form-group">
				                            <label htmlFor="eventDescription">Description<span>*</span></label><br />
				                            <textarea  id="eventDescription"  value={this.state.eventDescription} className="form-control"   onChange={this._handleInput.bind(this)}></textarea>
				                        </div>


				                        <div className="form-group">
				                            <label htmlFor="eventPhone">Phone number</label><br />
				                            <input type="text" id="eventPhone" value={this.state.eventPhone} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <div className="form-group">
				                            <label htmlFor="eventEmail">Contact Email address</label><br />
				                            <input type="text" id="eventEmail" value={this.state.eventEmail} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <div className="form-group">
				                            <label htmlFor="eventWebPage">Event Webpage</label><br />
				                            <input type="text" id="eventWebPage" value={this.state.eventWebPage} className="form-control"   onChange={this._handleInput.bind(this)} />
				                        </div>
				                        <GetImage prompt="Please provide an image for your Event" comp="AddEvents" />

				                        <div className="text-center">
				                        	{this.state.errors}
											<button type="submit" className="btn btn-primary">Submit</button>
				                        	

				                        </div>
				                       
				                    
				                    </div>
				                </div>
				            </form>
				            <div>
	                        	{loadingCircle}
	                        </div> 
	                    </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}
export default withRouter(AddEvents);