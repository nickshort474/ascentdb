import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { firebase } from '@firebase/app';

import Review from './ReviewComp';
import Map from '../../utils/Map';

import store from '../../redux/store';
import constants from '../../redux/constants';

import defaultLogo from '../../assets/images/default.jpg'

import LocalStorage from '../../utils/LocalStorage';


export default class SingleBusinessPage extends Component{
	
	
	componentWillMount() {
		window.scrollTo(0, 0);

		// get previous page from redux for back button
		let storeState = store.getState();
		let previousPage = storeState.prevPage;
		
		this.user = LocalStorage.loadState("user");

		// save current page ref to redux
		let pageString = `/SingleBusiness/${this.props.match.params.BusinessKey}`
		store.dispatch({type:constants.SAVE_PAGE, page:pageString});

		//create ref to firestore
		this.firestore = firebase.firestore();
		
		//save state
		this.setState({
			previousPage:previousPage,
			reviews:[],
			owner:false
		})
		
		//collect business information and reviews
		this._getBusinessInfo();
		this._getReviews();
		
	    
	}

	_getBusinessInfo(){
		
		//create reference to business section of firestore
		let ref = this.firestore.collection("Business").doc(this.props.match.params.BusinessKey);

		let owner = false;
		//gather all business data
		ref.get().then((snapshot)=>{ 
			
			//check whether person viewing page is owner/creator so they can alter content
			
			if(snapshot.data().creator === this.user){
	    		owner = true;	
	    	}

	    	//save returned data to state
			this.setState({
	    		businessName:snapshot.data().businessName,
				location:snapshot.data().location,
				businessLogo:snapshot.data().businessLogo,
				summary:snapshot.data().summary,
				fullDescription:snapshot.data().description,
				phone:snapshot.data().phone,
				email:snapshot.data().email,
				webpage:snapshot.data().webpage,
				owner:owner,
				items:snapshot.data(),
				images:snapshot.data().businessImages
	    	},function(){
	    		//call map update 
	    		this.child._updateMap(snapshot.data().lng, snapshot.data().lat, "SingleBusinessPage", "10");
	    		
	    	});
		});

	}
	

	_getReviews(){

		// set up review section ref
		let firebaseRef = this.firestore.collection("Reviews").doc(this.props.match.params.BusinessKey).collection("Review")

		//set review array
		let reviews = [];

		//get data
		firebaseRef.get().then((snapshot)=>{

			//loop through snapshot
			snapshot.forEach((snap)=>{
				//push to review array
				reviews.push(snap.data());
			})
			//save review array to state
			this.setState({
				reviews:reviews
			})
		})


	}


	render(){


		let EditPage,EditLogo;

		//map state review array to Review components
		let reviews = this.state.reviews.map((review) => {
			
			return <Review title={review.Title} body={review.Comment} userUID={review.UserUID} user={review.Username} stars={review.Stars} key={review.Title} />
		})

		if(this.state.owner === true){
			
			EditPage = <Link to={`/EditBusiness/${this.props.match.params.BusinessKey}`}><p>Edit the information on this page</p></Link>
			/*AddImages = <Link to={`/AddBusinessImages/${this.props.match.params.BusinessKey}`}><p>Click here to add images to your page</p></Link>*/
			EditLogo = <div><Link to={`/EditBusinessLogo/${this.props.match.params.BusinessKey}`}><p>Edit your business logo</p></Link></div>
		}

		let leaveReview;

		if(this.user && !this.state.owner){
			leaveReview = <div className="row"><div className="box greyedContent"><Link to={`/Review/${this.props.match.params.BusinessKey}`}><p>Leave a review for this business</p></Link></div></div>
		}else if(this.state.owner){
			leaveReview = null
		}else{
			leaveReview = <div className="row"><div className="box greyedContent">Please sign in to leave a review of this business</div></div>
		}

		return(
			<div className="container">
				<section className="content-wrapper">
					
					<div className="row">
						<div className="box greyedContent">
							<Link to={'/' + this.state.previousPage}>&#60; Back</Link>
							
						</div>
					</div>

					<div className="row">

						<div className="col-xs-12">
							<div className="row">
								
								<div className="text-center ">
									<h2 className="box greyedContent col-sm-6">{this.state.businessName}</h2>
								</div>
								<div className="text-center col-sm-6">
									<img src={this.state.businessLogo ? this.state.businessLogo: defaultLogo}  className=""   alt="Business logo" />
								</div>
								
							</div>
							
							<div className="text-center">
								{EditLogo}
							</div>
							<div className="row">
								
								<p className="box text-center greyedContent">{this.state.summary}</p>
								
							</div>

							<div className="row box greyedContent">
								<Map initialCenter={this.state.initialCenter} data={this.state.items} onRef={ref =>(this.child = ref)}/>
								<p className="text-center">{this.state.location}</p>
							</div>

							
							<div className="row">
								<div className="box  greyedContent">
								<ul className="contactInfo">
									{this.state.email !== "" ? <li>{this.state.email}</li> : null}
									{this.state.phone !== "" ? <li>{this.state.phone}</li> : null}
									{this.state.webpage !== "" ? <li>{this.state.webpage}</li> : null}
								</ul>
								</div>
								
							</div>
							
							<div className="row">
								
								<p className="box greyedContent">{this.state.fullDescription}</p>
								
							</div>
								
							
							
							<div>
								{reviews}
							</div>
							
								{leaveReview}
							
							{EditPage ? 
							<div className="row">
								<div className="box">
									{EditPage}
								</div>
							</div>
							: null}
							
							



						</div>

						

					</div>	
					

				</section>
			</div>

		)
	}
}