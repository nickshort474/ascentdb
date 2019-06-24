import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import Map from '../../utils/Map';

import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';
import SingleEventComp from './SingleEventComp';

const google = window.google;

export default class FindEvents extends Component{

	constructor(){
		super();

		//save page reference to store for sign in and back navigation
		store.dispatch({type:constants.SAVE_PAGE, page:"/FindEvents"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"/FindEvents"});
		
		
  		//set initial state
		this.state = {
			items:[],
			eventComps:[],
			radius:"25"
		}

		//set initial variables
		this.first = false;
  		this.firestore = firebase.firestore();	
		this.radius = "25";
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
			   
	}

	componentDidMount(){
		
		//get store state
		let storeState = store.getState();

		// get state of previouslySavedeventSearch from redux
		let hasSavedSearch = storeState.hasSavedEventSearch;
		
		//if true load state and apply
		if(hasSavedSearch){
			//get previous search values
			let eventSearchValues = storeState.eventSearchValues;

			//set lat and lng
			this.lat = eventSearchValues.lat;
			this.lng = eventSearchValues.lng;
			
			//save previous search vlaues to state
			this.setState({
				location:storeState.eventSearchTerm,
				items:storeState.eventSearchObj,
				eventComps:storeState.eventSearchObj,
				radius:eventSearchValues.radius
			},()=>{
				//update map
				this.child._updateMap(this.lng, this.lat, "FindEvents",this.state.radius, this.state.items);
			})
		}else{

		}

	}

	_distanceChange(e){

		//handle distance change
		this.setState({
			radius:e.target.value
		})
			
		//if first distance selection do nothing until location search has been done
		if(!this.first){
			this.first = true;
		}else{
			//if suggestion has been made  gather coords for search
			if(this.hasSuggestion){
				this._gatherCoords();
			}
		}
			
		
		
	}

	_onSuggestSelect(suggest) {
		
		//handle suggestion from GeoSuggest component
		if(suggest){
			//set variable for distance test
			this.hasSuggestion = true;
	    	
	    	//gater suggestion data
	    	this.location = suggest.gmaps.formatted_address;
	    	this.lat = suggest.location.lat;
	    	this.lng = suggest.location.lng;
	    	
	    	//save suggestion data to object
	    	let searchValues = {
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,
	    		radius:this.state.radius
	    	}

	    	//save suggestion data to store for later use when navigating back here
	    	store.dispatch({type:constants.SAVE_EVENT_SEARCH_TERM, eventSearchTerm:this.location})
	    	store.dispatch({type:constants.SAVE_EVENT_SEARCH_VALUES, eventSearchValues:searchValues})
	    	store.dispatch({type:constants.HAS_SAVED_EVENT_SEARCH, hasSavedEventSearch:true})

	    	//gather coords for firestore search
	    	this._gatherCoords()

    	}
    	

  	}


	_gatherCoords(){
  		
  		//work out upper and lower lat points from distance provided	   
	    let latDifference =   this.state.radius / 69;
	    let lowerLat = this.lat - latDifference;
	    let upperLat = this.lat + latDifference;

	    //work out upper and lower lng points form distance and latitude
	    let longRadians = this._toRadians(this.lat);
	    let milesPerLong = longRadians * 69.172;
	    let longDifference = this.state.radius / milesPerLong;
	    let lowerLong = this.lng - longDifference;
	    let upperLong = this.lng + longDifference;
	   
	    //set ref to events section
	    let eventReference = this.firestore.collection("Events");

	    //set query to elements in events that fall within upper and lower latitude
	    let query = eventReference.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	 
	    //set empty array
	    let items = [];

	    //get query
	    query.get().then((snapshot)=>{

	    	//loop through snapshsot
	    	snapshot.forEach((doc)=> {
	    		
	    		//for each returned element test whether falls with upper and lower longitude points
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
					
					//push matching events to array
					items.push(doc.data());
	    		}
	    	});

	    	//save array to store for later use
	    	store.dispatch({type:constants.SAVE_SEARCHED_EVENTS,eventSearchObj:items})

	    	//save array to state for display
	    	this.setState({
	    		eventComps:items
	    	});

	    	//update map with data
			this.child._updateMap(this.lng,this.lat, "FindEvents",this.state.radius, items);

	    })
	   

	    

  	}
	_toRadians (angle) {
		//work out radians
  		return angle * (Math.PI / 180);
	}


	render(){

		let eventComps;

		//loop through state to display event components
		eventComps = this.state.eventComps.map((event,index)=>{

			return <SingleEventComp name={event.eventName} description={event.eventDescription} location={event.eventLocation}  logo={event.eventLogo} date={event.eventTime} id={event.eventID} key={index}/>		
		})



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
					   
				                	<h2>Find an Event</h2>
				                    <p>Find a event near you!</p>
				                    
				                        <ul>
				                        	<li>Tournaments</li>
				                        	<li>Displays</li>
				                        	<li>Challenge Matches</li>
				                        </ul>
				                        
				                       
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form>
				                    	<div className="form-group">
				                            <label htmlFor="distance">Distance from:</label>
				                           
				                           	<select value={this.state.radius} onChange={this._distanceChange.bind(this)} >
				                           		<option value="10">10</option>
				                           		<option value="25">25</option>
				                           		<option value="50">50</option>
				                           		<option value="100">100</option>
				                           		<option value="1000">World</option>
				                           	</select>
				                        </div>

				                    	<div className="form-group">
				                            <label htmlFor="searchTerm">Location</label>
				                           
				                            <Geosuggest
									          ref={el=>this._geoSuggest=el}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20"
									          initialValue={this.state.location} 

									        />

				                           	<Map data={this.state.items} onRef={ref =>(this.child = ref)} />
				                           	
				                        </div>
				                        <div className="box">
				                        	{eventComps}
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