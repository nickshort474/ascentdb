import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import Map from '../../utils/Map';

import Geosuggest from 'react-geosuggest';

import constants from '../../redux/constants';
import store from '../../redux/store';

import BusinessComp from './BusinessComp';

const google = window.google;


export default class FindBusiness extends Component{

	constructor(){
		super();
		
		//dispatch reference to page to store
		store.dispatch({type:constants.SAVE_PAGE, page:"FindBusiness"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"FindBusiness"});
		
		//set initial variable / reference
		this.first = false;
		this.firestore = firebase.firestore();
		
		
		//set initial state
		this.state = {
			items:"",
			businessComps:[],
			radius:"25"
			
		}
		
	}
	
	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);

	}

	componentDidMount(){

		//get store reference
		let storeState = store.getState();

		// test whether has been previous search so can show search results from previous search allowing user to go through multiple options
		let hasSavedSearch = storeState.hasSavedBusinessSearch;
		
		//if true load state and apply
		if(hasSavedSearch){

			//get previous search values from store
			let businessSearchValues = storeState.businessSearchValues;

			//set variables from stored search
			this.lat = businessSearchValues.lat;
			this.lng = businessSearchValues.lng;
			
			//set state from stored values
			this.setState({
				location:storeState.businessSearchTerm,
				items:storeState.businessSearchObj,
				businessComps:storeState.businessSearchObj,
				radius:businessSearchValues.radius
			},()=>{
				//update map based on previous search values
				this.child._updateMap(this.lng, this.lat, "FindBusiness",this.state.radius, this.state.items);
			})
		}else{

		}
		
		
	}
	
	_distanceChange(evt){
		
		//set state from distance change option group
		this.setState({
			radius:evt.target.value,
		})
		
		//test whether this is first selection of distance option 		
		if(!this.first){
			//if first option selection switch bool
			this.first = true;
		}else{

			//if not first selection and search suggestion already exists gatherCoords to populate map
			if(this.hasSuggestion){
				this._gatherCoords();
			}
		}
		
		
	}

	_onSuggestSelect(suggest) {
		
		//handle suggestion from GeoSuggest component
		if(suggest){

			//set has suggestion to true ready for distance change test
			this.hasSuggestion = true;
			
			//get data from suggestion
	    	this.location = suggest.gmaps.formatted_address;
	    	this.lat = suggest.location.lat;
	    	this.lng = suggest.location.lng;
	    	
	    	//save suggestion data to object
	    	let searchValues = {
	    		lat:suggest.location.lat,
	    		lng:suggest.location.lng,
	    		radius:this.state.radius
	    	}

	    	//save object and location to store for later use
	    	store.dispatch({type:constants.SAVE_BUSINESS_SEARCH_TERM, businessSearchTerm:this.location})
	    	store.dispatch({type:constants.SAVE_BUSINESS_SEARCH_VALUES, businessSearchValues:searchValues})
	    	store.dispatch({type:constants.HAS_SAVED_BUSINESS_SEARCH, hasSavedBusinessSearch:true})
	    	
	    	//run gather coords to populate map
	    	this._gatherCoords();
    	}
		
  	}


  	_gatherCoords(){
  		
  		// calculate which business to return from firestore based on lat and lng of search suggestion and distance supplied	   
	    
  		//calculate lat points of distance given
	    let latDifference =   this.state.radius / 69;

	    //calculate upper and lower latitudes which fall within distance provided
	    let lowerLat = this.lat - latDifference;
	    let upperLat = this.lat + latDifference;

	    //longitude calculations based on locations latitude

	    //calculate longitude number based on its latitude
	    let longRadians = this._toRadians(this.lat);
	    
	    //mulitple by 69.172
	    let milesPerLong = longRadians * 69.172;
	   
	    //work out upper and lower longitude for distance given
	    let longDifference = this.state.radius / milesPerLong;
	    let lowerLong = this.lng - longDifference;
	    let upperLong = this.lng + longDifference;
	  


	    //set reference to business in firestore
	    let businessReference = this.firestore.collection("Business");

	    //get all business within latitude coords
	    let query = businessReference.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	   
	   	//create empty array
		let items = [];

		//get data
	    query.get().then((snapshot)=>{
	    	snapshot.forEach((doc)=> {
	    		
	    		// for returned data sort for business within longitude coords
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
					
					//push to array				
					items.push(doc.data());
					
	    		}
	    	});

	    	//add array to store for later use
			store.dispatch({type:constants.SAVE_SEARCHED_BUSINESS,businessSearchObj:items})

			//add array to state
	    	this.setState({
	    		businessComps:items
	    	});

	    	//update map with data
			this.child._updateMap(this.lng, this.lat, "FindBusiness",this.state.radius, items);
	    })

  	}


  	_toRadians (angle) {
  		//work out radians from degrees
  		return angle * (Math.PI / 180);
	}

	

	render(){
		let businessComps;

		//loop thorugh data from display
		businessComps = this.state.businessComps.map((business,index)=>{
			return <BusinessComp businessName={business.businessName} summary={business.summary} location={business.location} key={index} businessLogo={business.businessLogo} businessKey={business.key} />		
		})
		

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box  greyedContent">
					   		<Link to="/Business">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box greyedContent">
					   
				                	<h2>Find A Business</h2>
				                    <p>Find somewhere to train, shop or anything martial arts related near you.</p>
				                    
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box greyedContent">


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
									          initialValue={this.state.location}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20" 

									        />
				                           
				                        </div>
				                      
				                        <Map data={this.state.items} onRef={ref =>(this.child = ref)} />

				                 

				                        <div className="box">
				                        	{businessComps}
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