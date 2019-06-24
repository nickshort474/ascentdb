import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import Map from '../../utils/Map';
import Geosuggest from 'react-geosuggest';

import store from '../../redux/store';
import constants from '../../redux/constants';

import AutoSuggest from '../../utils/AutoSuggest'; 


const google = window.google;

export default class SearchForPeople extends Component{
	

	constructor(){
		super();

		//set initial state		
		this.state = {
			items:[],
			searchName:""
		}

		//save current page to store
		store.dispatch({type:constants.SAVE_PAGE, page:"/SearchForPeople"});

		//set base firestore ref
		this.firestore = firebase.firestore();

		//set initial variables
		this.radius = "10";
  		this.first = false;	
	}

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);

		//create empty array
		let usernameList = [];

		//clear searchTerm every time come to SearchPeoplepage
		store.dispatch({type:constants.SAVE_PEOPLE_SEARCH_TERM, peopleSearchTerm:undefined})
		
		//set ref to usernames section
		let ref = this.firestore.collection("Usernames");
		
		//get data
		ref.get().then((snapshot)=>{
			
			//loop through data
			snapshot.forEach((snap)=>{
				//push data to array
				usernameList.push(snap.id)
			})
			
			//save array to state for autosuggest component
			this.setState({
				usernameList:usernameList
			})
			
						
		})
	}

	

	_distanceChange(e){

		//handle distance change input
		this.radius = e.target.value;

		// if first choice no suggest has been made so don't gather coords
		if(!this.first){
			this.first = true;
		}else{
			//gather coords 
			this._gatherCoords();
		}
		
	}

	_gatherCoords(){
  		
  		//work work lat and lng distances based on provided distance	   
	    let latDifference =   this.radius / 69;
	    let lowerLat = this.lat - latDifference;
	    let upperLat = this.lat + latDifference;

	    let longRadians = this._toRadians(this.lat);
	    
	    let milesPerLong = longRadians * 69.172;
	   
	    let longDifference = this.radius / milesPerLong;
	    let lowerLong = this.lng - longDifference;
	    let upperLong = this.lng + longDifference;
	   


	    //set referecne to people section in firestore
	    let ref = this.firestore.collection("People");

	    //query people based on their provided lat
	    let query = ref.where("lat","<=" , upperLat).where("lat", ">=", lowerLat);
	 
	 	//set empty array
		let items = [];

		//get data
	    query.get().then((snapshot)=>{
	    	
	    	//loop through snapshot
	    	snapshot.forEach((doc)=> {
	    		
	    		//sort returned data for matches within calculated lng
	    		if(doc.data().lng >= lowerLong && doc.data().lng <= upperLong){
					
					//push data to array	
					items.push(doc.data());
					
	    		}
	    	});
	    	//update map accordingly
			this.child._updateMap(this.lng,this.lat, "FindPeople",this.radius, items);
	    })
	   

	    

  	}
	_toRadians (angle) {
		//work out radians
  		return angle * (Math.PI / 180);
	}

	_onSuggestSelect(suggest) {
		
		//handle suggest from GeoSuggest component
		if(suggest){
			//gather data
			this.location = suggest.gmaps.formatted_address;
			this.lat = suggest.location.lat;
    		this.lng = suggest.location.lng;
    		//run gather coords
    		this._gatherCoords()
		}
    	
  	}

  



	_submitNameForm(e){
		e.preventDefault();

		//get search term from store (populated in AutoSuggest component)
		let storeState = store.getState();
		let searchTerm = storeState.peopleSearchTerm;	
		
		// if searchTerm !exist then alert user to select name from suggestions
		if(searchTerm === undefined){
			
			alert("please select a keyword from the search list")
			
		}else{
			//if search term (username) exists use it to get that users id from usernames section
			let ref = this.firestore.collection("Usernames").doc(searchTerm);
			
			//get users id
			ref.get().then((snapshot)=>{
				//direct to profile page using id		
				this.props.history.push("/PersonProfile/" + snapshot.data().uid);
			})
		}

	}

	render(){

		

		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">

			        	<div className="box greyedContent">
					   		<Link to="/Community">&lt; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box greyedContent">
					   
				                	<h2>Find people</h2>
				                    <p>Find people near you!</p>
				                    <ul>
				                    	<li>Find someone to train with</li>
				                        <li>Search for sparring match</li>
				                        <li>Search for a challenge</li>
				                        <li>Search for similar people to connect with</li> 
					                </ul>
				                </div>
				            </div>
				            <div className="col-sm-9">
				            	<div className="box greyedContent">        
				                    <form>
				                    	<h3>Search by location:</h3>
				                    	<div className="form-group">
				                            <label htmlFor="distance">Distance from:</label>
				                           
				                           	<select onChange={this._distanceChange.bind(this)} >
				                           		<option value="10">10</option>
				                           		<option value="25">25</option>
				                           		<option value="50">50</option>
				                           		<option value="100">100</option>
				                           		<option value="world">World</option>
				                           	</select>
				                        </div>
				                    	<div className="form-group">
				                            
				                            <Geosuggest
									          ref={el=>this._geoSuggest=el}
									          placeholder="Search for your address"
									          onSuggestSelect={this._onSuggestSelect.bind(this)}
									          location={new google.maps.LatLng()}
									          radius="20" 

									        />
				                        
				                        </div>
				                        <Map data={this.state.items} onRef={ref =>(this.child = ref)} />
				                    </form>

				                    <hr />

				                    <form onSubmit={this._submitNameForm.bind(this)}>
				                        <h3>Search by name:</h3>
				                        {/*<input type="text" value={this.state.searchName} onChange={this._handleInput.bind(this)} /><br />*/}
				                        <AutoSuggest list={this.state.usernameList}  page="searchForPeople" />
				                        <hr />

				                        <button type="submit" className="btn btn-primary">Show users profile</button>

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