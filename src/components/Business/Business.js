import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { firebase } from '@firebase/app';



import BusinessComp from './BusinessComp';

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';



class Business extends Component{
	

	constructor(props){
		super(props);

		//save reference to page for navigation
		store.dispatch({type:constants.SAVE_PAGE, page:"Business"});
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:"Business"});
		
		//set intial state
		this.state = {
			items:[],
			imageUrl:""
			
		}
		
		//set base firestore reference
		this.firestore = firebase.firestore()
	}

	
	
	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);
		
		//initialise  array
			
		this.items = [];
	    
	    //set reference to Business section limiting to latest 10 listings
	    let ref = this.firestore.collection("Business").orderBy("creationDate","desc").limit(10);

	    //get business info
	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{
			
				//push to array
				this.items.push(element.data());
				
			})
			
			//add array to state if component is mounted
			if(this.mounted){
				this.setState({
					items:this.items
				})
				
			}
	    })

		
	}


	componentDidMount(){
		//set mounted so state is updated only on mounted component
		this.mounted = true
	}

	componentWillUnmount(){
		//set mounted to false so no state updates called once component unmouts
		this.mounted = false;
	}



	_addBusiness(){
		//get user id form localstorage
		let userUID = LocalStorage.loadState("user");
		
		//if user signed in direcet to add business
		if(userUID){
		
			this.props.history.push('/AddBusiness');

		}else{
			//alert user to sign in
			window.alert("please create an account or sign in to add a business to our databases");


		}
	}



	render(){

		//loop through business array for display
		let business = this.state.items.map((business) =>{
			
			return <BusinessComp businessName={business.businessName} summary={business.summary} businessKey={business.key} location={business.location} businessLogo={business.businessLogo} key={business.key} />
		})

		
		return(
			<div className="container">
			 	<section className="content-wrapper">
					
					<div className="row">
						<div className="col-sm-3 text-center">
							
								<Link to="FindBusiness"><button type="button" className="btn btn-primarySmall extraMargin">Find a business</button></Link>
								<button type="button" className="btn btn-primarySmall extraMargin" onClick={this._addBusiness.bind(this)}>Add a business</button>

																
						</div>
						<div className="col-sm-9">
							<div className="box greyedContent">
								<h3 className="text-center">Recently listed businesses</h3>
								<div>{business}</div>
								
							</div>

						</div>
						
					</div>
				</section>
			</div>

		)
	}
}
export default withRouter(Business);
