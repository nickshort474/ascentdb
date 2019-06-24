import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';
import PersonComp from './PersonComp';

import store from '../../redux/store';
import constants from '../../redux/constants';



class FindPeople extends Component{
	

	constructor(props){
		super(props);
		store.dispatch({type:constants.SAVE_PAGE, page:"FindPeople"});
		
		this.state = {
			items:[],
			
		}
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		this._getLatestPeople();
	}

	componentWillMount(){
		window.scrollTo(0, 0);

	}

	_getLatestPeople(){
		
		let ref = this.firestore.collection("People").orderBy("profileCreated", "desc");
		
		let items = [];
				
		ref.get().then((snapshot)=>{
			
			snapshot.forEach( (element)=> {
				
				if(element.data().uid !== this.userUID){
					items.push(element.data());
				}
				
			});
			
			this.setState({
				items:items
			})
		})
	}


	render(){

		let latestUser = this.state.items.map((user)=>{
			return <PersonComp  userName={user.userName} uid={user.uid}  key={user.uid} />
		})

		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">

			        	<div className="row box">
					   		<Link to="/Community">&lt; Go back</Link>
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
				            	<div className="row box text-center">  
				            		Search for people to connect with:<Link to="/SearchForPeople"><button className="btn btn-primary">Search</button></Link> 
				            		  
				                    {/*<form>
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
				                        <input type="text" value={this.state.searchName} onChange={this._handleInput.bind(this)} /><br />
				                       
				                        <hr />

				                        <button type="submit" className="btn btn-primary">Submit</button>

				                    </form>*/}
				                </div>
				                <div className="row box text-center">
				                	Latest members of our community: {latestUser}   
				                </div>
				            </div>

		                </div>

		            </section>
		        </div>
			</div>

		)
	}
}

export default FindPeople;