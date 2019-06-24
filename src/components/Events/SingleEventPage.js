import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import Map from '../../utils/Map';
import ProcessEpochDisplay from '../../utils/ProcessEpochDisplay';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';

import defaultLogo from '../../assets/images/default.jpg'

export default class SingleEventPage extends Component{
	

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);

		// save current page ref to store for sign in redirect
		let pageString = `/SingleEvent/${this.props.match.params.EventKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});
	
		//get previous page from store for back button
		let storeState = store.getState();
		let previousPage = storeState.prevPage;

		//get user from localstorage
		this.user = LocalStorage.loadState("user");
		
		//set initial state
		this.setState({
			owner:false,
			previousPage:previousPage,
		})

		//gather event info
		this._getEventInfo();
		
	}

	_getEventInfo(){

		//set base firestore reference
		let firestore = firebase.firestore();

		//set ref to individual event location
		let ref = firestore.collection("Events").doc(this.props.match.params.EventKey);
		
		//set empty var / array
		let owner;
		let items = [];
		//get individual event data
		ref.get().then((snapshot)=>{
			

			//populate array with event names
			items["name"] = snapshot.data().eventName;
				
			//test whether this event is owned by viewing user to show edit buttons			
			if(snapshot.data().creator === this.user){
	    		owner = true;	
	    	}
			
			//save event data to state
			this.setState({
				eventName:snapshot.data().eventName,
				eventDescription:snapshot.data().eventDescription,
				eventTime:snapshot.data().eventTime,
				eventEmail:snapshot.data().eventEmail,
				eventWebPage:snapshot.data().eventWebPage,
				eventType:snapshot.data().eventType,
				eventLocation:snapshot.data().eventLocation,
				eventPhone:snapshot.data().eventPhone,
				eventLogo:snapshot.data().eventLogo,
				items:items,
				owner:owner
			},function(){

				//update map
				this.child._updateMap(snapshot.data().lng, snapshot.data().lat, "SingleEventPage","10",items);
			})
		})
	}


	render(){

		
		let EditEvent, EditImage;
			
		//if owner is true show edit buttons
		if(this.state.owner === true){
			EditEvent = <Link to={`/EditEvent/${this.props.match.params.EventKey}`}>Edit event information</Link>
			EditImage = <div><Link to={`/EditEventLogo/${this.props.match.params.EventKey}`}><p>Edit event image</p></Link></div>
		}

		return(
			
			<div className="container">
				<section className="content-wrapper">
					
					<div className="row">
						<div className="col-sm-12">
							<div className="box greyedContent">
						   		
						   		<Link to={this.state.previousPage}>&#60; Back</Link>
						    </div>
					    </div>
					</div>

					<div className="row">
						<div className="col-sm-12">
							<div className="row">
								<div className="col-sm-12">
									<div className="box text-center greyedContent">
										<h2>{this.state.eventName}</h2>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-12" >
									<div className="box styledDate">
										<ProcessEpochDisplay date={this.state.eventTime} hoursWanted={true} key={this.state.eventTime} />
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										<p>Location:</p> 
										<h3>{this.state.eventLocation}</h3>
									</div>
								</div>
								
							</div>

							<div className="row" >
								<div className="col-sm-12" style={this.style} >
									 <Map data={this.state.items} onRef={ref =>(this.child = ref)}/>
								</div>
							</div>


							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										<p>{this.state.eventDescription}</p>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										<p>{this.state.eventPhone  ? this.state.eventPhone : "No contact number"}</p>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										<p>{this.state.eventEmail ? this.state.eventEmail : "No email address"}</p>
									</div>
								</div>
							</div>
							
							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										<p>{this.state.eventWebPage ? this.state.eventWebPage : "No web page"}</p>
									</div>
								</div>
							</div>
						
							<div className="row">
								<div className="col-sm-12">
									<div className="box greyedContent">
										{EditEvent}
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-12">
									<div className="box">
							
										<img src={this.state.eventLogo ? this.state.eventLogo : defaultLogo} className="imageFit" alt="event logo" /><br />
										{EditImage}
									</div>
								</div>
							</div>
						</div> 

						

							


							
							
						
					</div>
				
				

				</section>
			</div>
		)
	}
}