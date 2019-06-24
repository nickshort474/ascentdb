import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
import DefaultLogo from '../../assets/images/default.jpg';

class PersonProfile extends Component{
	
	constructor(){
		super();
		
		//set initial state
		this.state = {
			firstName:" ",
			lastName:" ",
			userNameLink:" ",
			bio:" ",
			clubs:" ",
			styles:" ",
			age:" ",
			friends:[],
			requestSent:false,
			data:false
			
		}
				
	}

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);

		//get prevPage from store for back button
		let storeState = store.getState();
		this.prevPage = storeState.page;

		//get user id from localstorage
		this.userUID = LocalStorage.loadState("user");

		//set base firestore ref
		this.firestore = firebase.firestore();
		
		// check if collection("People").doc(this.props.match.params.PersonKey) exists
		let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey);
		
		ref.get().then((snapshot)=>{
			
			if(snapshot.exists){
				//if it does

				//set variable to display of profile
				this.userExists = true;

				//get user info
				this._getUserInfo();

				//get users profile image
				this._getProfileImage();

				//set state data to true 
				this.setState({
					data:true
				});
			}else{
				
				//set state data to false so empty div shown
				this.setState({
					data:false
				});
				
				//set variable to display message about account no longer exists and show delete contact button
				this.userExists = false

			}
		})
		
	}

	
	_getUserInfo(){

		let isFriend;

		//set ref to this person in contact lists 
		let ref2 = this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey);
		
		//get data from ref
		ref2.get().then((snapshot)=>{
			
			//if snapshot exists is friend 
			if(snapshot.exists){
				isFriend = true
				
			}else{
				isFriend = false;
			}
			
			//set state for later test to decide what button to display 
			this.setState({
				isFriend:isFriend
			})
			
		})
		
		//set ref for contact requests
		let ref3 = this.firestore.collection("People").doc(this.props.match.params.PersonKey).collection("ContactRequests");
		
		//set query for requests from this user
		let query = ref3.where("requestUserUID", "==", this.userUID);
		
		//get data
		query.get().then((snapshot)=>{
			
			//loop snapshot to search for match
			snapshot.forEach((snap)=>{
				
				if(snap.data().requestUserUID === this.userUID){
					// user has already sent request
					//update state to alter buttons displayed
					this.setState({
						requestSent:true
					})
				};
			})
		})

		//set ref for this users profile
		let ref = this.firestore.collection("People").doc(this.props.match.params.PersonKey);
		
		//get users profile data
		ref.get().then((snapshot)=>{
			
			//add data to state for display
			this.setState({
				firstName:snapshot.data().firstName,
				lastName:snapshot.data().lastName,
				userName:snapshot.data().userName,
				bio:snapshot.data().bio,
				clubs:snapshot.data().clubs,
				styles:snapshot.data().styles,
				age:snapshot.data().age,
				location:snapshot.data().generalLoc,
				
				
				
			})
		})

	}

	_getProfileImage(){

		//set ref for this users profile image
		let ref = this.firestore.collection("PeopleImages").doc(this.props.match.params.PersonKey);

		//get data
		ref.get().then((snapshot)=>{
			if(snapshot.data() !== undefined){
				
				//add profile pic url to state for display
				this.setState({
					profilePic:snapshot.data().profilePicUrl
				})
			}
			
		})
	}


	_handleContactRequest(){
		// if not contact or pending contact request button for contact is shown which directs to contact request page
		this.props.history.push(`/ContactRequest/${this.props.match.params.PersonKey}`)
	}

	_deleteContact(){
		//if account is no longer active delete this contacts ref from firestore so no longer displays
		this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey).delete();

		//redirect to community page
		this.props.history.push('/Community');
	}

	render(){

		
	

		let buttonToShow;

		// test whther is friend / or request sent and display appropriate button
		if(this.state.isFriend === false && this.state.requestSent === false && this.userUID !== this.props.match.params.PersonKey ){
			buttonToShow = <button className="btn btn-primarySmall" onClick={this._handleContactRequest.bind(this)} style={this.buttonStyle} >Contact Request </button>
		}else if(this.state.requestSent === true){
			buttonToShow = <p>Contact Request Pending</p>
		}
		
		//show empty div until profile data returned
		if(!this.state.data){
			return <div />
		}

		

		return(
			
			<div className="container">

				<div className="content-wrapper">
					
					<div className="row box greyedContent">
						
							<div className="col-xs-6">
								<Link to={this.prevPage}>&lt; Back </Link>
							</div>
							<div className="col-xs-6 text-right">
								<div>{buttonToShow}</div>
							</div>
					    
					</div>


					{this.userExists ? 

						<div className="row box greyedContent">
							<div className="col-xs-12">
								<div className="row">
									<div className="col-xs-8">
										<h2>{this.state.userName}</h2>
										<p>{this.state.firstName ? "Also known as " +  this.state.firstName + " " + this.state.lastName : ""}</p>
										
									</div>
									<div className="col-xs-4">
										<img src={this.state.profilePic ? this.state.profilePic : DefaultLogo} style={{"width":"100%"}} alt="placeholder" />
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-xs-2">Bio</p>
									<div className="col-xs-10">
										<p>{this.state.bio ? this.state.bio : "No user data"}</p>
									</div>
								</div>
								<hr />
								<div className="row">
									<p className="col-xs-2">Styles</p>
									<div className="col-xs-10">
										<p>{this.state.styles ? this.state.styles : "No user data"}</p>
									</div>
								</div>
								<hr />
								
								
								<div className="row">
									<p className="col-xs-2">General Location</p>
									<div className="col-xs-10">
										<p>{this.state.location ? this.state.location : "No user data"}</p>
									</div>
								</div>
								
							</div>
						</div> 
					: 
						<div className="row box">
							<div className="col-xs-12 text-center">
								<p>Unfortunately it looks like this user has deleted their account, would you like to remove them from your contact list?</p><button className="btn btn-primaryxsall" onClick={this._deleteContact.bind(this)}>Delete contact</button>
							</div>
						</div>
						




					}
					


				</div>
			</div>
		)
	}
}
	

	export default PersonProfile;