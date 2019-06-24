import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import Geosuggest from 'react-geosuggest'; 

import Datetime from 'react-datetime';
import moment from 'moment';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import $ from 'jquery';

import store from '../../redux/store';
import constants from '../../redux/constants';

const google = window.google;

export default class EditEvent extends Component{

	constructor(){
		super()

		//set initial state
		this.state = {
			eventName:" ",
			eventLocation:" ",
			eventDescription:" ",
			eventPhone:" ",
			eventEmail:" "
				
		}
	}


	componentWillMount() {
		//scroll to top
		window.scrollTo(0, 0);

		//save current page to store
		let pageString = `EditEvent/${this.props.match.params.EventKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});


		//create ref to firestore
		this.firestore = firebase.firestore();
		

		this.textAreaStyle = {
			width:"100%",
			height:"100%"
		}
				
		//collect Event information and reviews
		this._getEventInfo();

	}

	componentDidMount(){

		//get ref to date time component
		this.eventDateTimeDiv = document.getElementById("dateTimeContainer");
	}

	_getEventInfo(){
		
		//create reference to Event section of firestore
		let ref = this.firestore.collection("Events").doc(this.props.match.params.EventKey);

		
		//gather all Event data
		ref.get().then((snapshot)=>{ 
			
			let date = moment(snapshot.data().eventTime);
			
	    	//save returned data to state
			this.setState({
	    		eventName:snapshot.data().eventName,
				eventLocation:snapshot.data().eventLocation,				
				eventDescription:snapshot.data().eventDescription,
				eventPhone:snapshot.data().eventPhone,
				eventEmail:snapshot.data().eventEmail,
				eventTime:date,
				eventTimeSave:snapshot.data().eventTime,
				lat:snapshot.data().lat,
				lng:snapshot.data().lng
				
	    	})
		})

	}


	_handleInput(e){
		
		//handle input data
		this.setState({
			[e.target.id]:e.target.value
		})
		// remove formError class on user input
		$(`#${e.target.id}`).removeClass('formError');
	}

	_onSuggestSelect(suggest) {
		
		//on suggest from GeoSuggest component
		if(suggest){
			
			//save suggest data to state
	    	this.setState({
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,
	    		eventLocation:suggest.gmaps.formatted_address
	    			
	    	})
	    	//remove form error indicator on suggestion
	    	$('#geoSuggest').removeClass('formError');
	    }else{
	    	//if no valid suggestion add error indicator
			$('#geoSuggest').addClass('formError');
			//clear location data from state
			this.setState({
				eventLocation:""
			})
		}
	     
  	}

		
	_handleDateTimeChange(dateObject){
		
		//handle data from DateTime component
		if(typeof dateObject === 'object'){
			
			//get unix time from date time object			
			let unix = moment().date(dateObject.date()).valueOf();
			
			//save data to state				
			this.setState({
				eventTime:unix,
				eventTimeFormat:true
			})
			
			//remove error indicator on correct dateobject retrun			
			this.eventDateTimeDiv.setAttribute("style", "border:none")
		}else{
			
			//if non dateObject returned clear state
			this.setState({
				eventTime:1,
				eventTimeFormat:false
			})
			//add immediate red border for text input of time suggest box
			this.eventDateTimeDiv.setAttribute("style", "border:2px solid red")
		}
	}

	_handleEventType(e){

		//handle input of event type to show input text box if selection is other
		if(e.target.value === "Other"){
			this.reasonChoice = <div><input type="text" placeholder="Enter event type" /></div>
			this.setState({update:true});
		}else{
			this.reasonChoice = <div></div>;
			this.setState({update:true});
		}
	}


	_onSubmit(e){

		//disable buttons
		_disable();
			
		//run vlaidation of input		
		let errorMsgs = this._validate(this.state.eventName,this.state.eventLocation,this.state.eventTime,this.state.eventDescription);
		
		//if errors in array handle
		if(errorMsgs.length > 0){

			//create message comp
			let msgComp = errorMsgs.map((msg,index)=>{
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>

			//add message comp to state for display
			this.setState({
				errors:formattedComp
			})

			//enable buttons
			_enable();
		}else{
			
			//no errors so submit data
			//set ref to event section in firstore
			let ref = this.firestore.collection("Events").doc(this.props.match.params.EventKey);
		
			//create event object
			let obj = {
				eventName:this.state.eventName,
				eventLocation:this.state.eventLocation,
				eventTime:this.state.eventTimeSave,
				eventDescription:this.state.eventDescription,
				eventPhone:this.state.eventPhone,
				eventEmail:this.state.eventEmail,
				lat:this.state.lat,
				lng:this.state.lng
				
			}

			//update event in firestore
			ref.update(obj).then(()=>{
				this.props.history.push('/Events');
			})
			
		}
		
	}

	_validate(name, location, time, description){
	
		//store error messages in array
		const errorMsgs = [];

		//validate each field
		if (name.length < 1) {
		   errorMsgs.push("Please provide an event name");
		   $('#eventName').addClass('formError');
		}

		if (location.length < 1) {
		   errorMsgs.push("Please provide a location for your event");
		    $('#geoSuggest').addClass('formError');
		}
		if (time === 1) {
		   errorMsgs.push("Please provide a time for your event");
		   $('#dateTimeContainer').addClass('formError');
		}
		if (description.length < 1) {
		   errorMsgs.push("Please provide a description for your event");
		   $('#eventDescription').addClass('formError');
		}
		//return array
  		return errorMsgs;
	}


	render(){
		return(
			<div className="container">
				<section className="content-wrapper">
					
					<div className="row">
						<div className="col-sm-12 box">
							<Link to={'/SingleEvent/' + this.props.match.params.EventKey}>&#60; Back</Link>
							
						</div>
					</div>
					
					<form onSubmit={this._onSubmit.bind(this)}>
		                <div className="col-sm-12">
		                	<div className="box">
		                    

		                    	<div className="form-group">
		                            <label htmlFor="eventName">Event name<span>*</span></label>
		                            <input type="text" className="form-control" id="eventName" value={this.state.eventName}  onChange={this._handleInput.bind(this)} />
		                        </div>

		                        <div className="form-group">
		                            <label>Location<span>*</span></label>
		                            <Geosuggest 
		                            	ref={el=>this._geoSuggest=el}
		                            	initialValue={this.state.eventLocation}	
		                              	placeholder="Search for your address"
						          		onSuggestSelect={this._onSuggestSelect.bind(this)}
						          		location={new google.maps.LatLng(53.558572, 9.9278215)}
						         		radius="20"
						         		id="geoSuggest"
						         	/>

		                        </div>

		                       <div className="form-group">
		                       		
		                       		
		                       		<div>
		                       			<p>Date and time:<span>*</span></p>
		                       			<div id='dateTimeContainer' style={this.dateTimeStyle}>
		                       			<Datetime dateFormat="dddd, MMMM Do YYYY"  id="dateTime" value={this.state.eventTime} onChange={this._handleDateTimeChange.bind(this)}/>
		                       			</div>
		                       		</div>
		                       </div>
								<div className="form-group">
		                            <label htmlFor="eventDescription">Description<span>*</span></label><br />
		                            <textarea style={this.textAreaStyle} id="eventDescription" value={this.state.eventDescription} placeholder="Describe your event here"  onChange={this._handleInput.bind(this)}></textarea>
		                        </div>
		                        <div className="form-group">
		                            <label htmlFor="styles">Event type:</label><br />
		                           	<select id="eventType" onChange={this._handleEventType.bind(this)}>
									    	<option value="Tournament">Tournament</option>
									    	<option value="Challenge">Challenge</option>
									    	<option value="Display">Display</option>
									    	<option value="Other">Other</option>
									</select> 
									{this.reasonChoice}
		                        </div>


		                        

		                        <div className="form-group">
		                            <label htmlFor="eventPhone">Phone number</label><br />
		                            <input tpye="text" id="eventPhone" value={this.state.eventPhone} placeholder="Provide a contact number"  onChange={this._handleInput.bind(this)} />
		                        </div>
		                        <div className="form-group">
		                            <label htmlFor="eventEmail">Email address</label><br />
		                            <input type="text" id="eventEmail" value={this.state.eventEmail} placeholder="Provide an email address"  onChange={this._handleInput.bind(this)} />
		                        </div>

		                       
		                        <div className="text-center">
		                        	{this.state.errors}
									<button type="submit" className="btn btn-primary">Submit</button>
		                        	

		                        </div>
		                       
		                    
		                    </div>
		                </div>
				    </form>
				</section>
			</div>
		)
	}
}