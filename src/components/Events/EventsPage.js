import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import SingleEventComp from './SingleEventComp';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';

export default class EventsPage extends Component{
	
	
	constructor(){
		super();
		
		//save page to sore for redirect after sign in
		store.dispatch({type:constants.SAVE_PAGE, page:"/Events"});

		//save event page as previous page for routing back to after either search or newly listed.
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"/Events"});

		//set initial state
		this.state = {
			items:[]
		}

		
	}
	

	componentWillMount() {
		//scroll to top
		window.scrollTo(0, 0);

		//set empty array 
		this.items = [];
	
		//set base firestore ref
		this.firestore = firebase.firestore();

		//set ref to events section
		let ref = this.firestore.collection("Events").orderBy("creationDate","desc").limit(10);
		
		//get latest 10 events
		ref.get().then((snapshot)=>{
			
			//loop through snapshot
			snapshot.forEach((element)=>{
				
				//push items to array
				this.items.push(element.data());
			})
			
			//if mounted add array to state
			if(this.mounted){
				this.setState({
					items:this.items
				})
				
			}
		})
		
	    
	}

	componentDidMount(){
		//set mounted
		this.mounted = true;
	}

	componentWillUnmount(){
		//set as false  so no state set after unmounting
		this.mounted = false;
	}

	_addEvent(){

		//get user id form localstorage
		let userUID = LocalStorage.loadState("user");
		
		//if user signed in
		if(userUID){
			// redirect to AddEvents page
			this.props.history.push('/AddEvents');
			

		}else{
			//alert user to sign in
			window.alert("please create an account or sign in to add a business to our databases");
		}
	}


	render(){


		//loop through state for display
		let events = this.state.items.map((event)=>{
			
			return <SingleEventComp name={event.eventName}  logo={event.eventLogo} description={event.eventDescription} date={event.eventTime} location={event.eventLocation} id={event.eventID} key={event.eventID} />
		})

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			                <div className="col-sm-3 text-center">

				                
									<Link to="FindEvents"><button type="button" className="btn btn-primarySmall extraMargin">Find an event</button></Link>
									<button type="button" className="btn btn-primarySmall extraMargin" onClick={this._addEvent.bind(this)}>Add an event</button>

				                
				                
			                </div>
			            	<div className="col-sm-9">
			                	<div className="box greyedContent">
			                		<h3 className="text-center">Newly listed Events</h3>
			                		
			                		{events}
			                		
			                	</div>
			                	
			                </div>

			                
			            </div>
			        </section>
			    </div>
			</div>

		)
	}
}