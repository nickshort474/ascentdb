import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

import PersonComp from './PersonComp';

import {AuthUserContext} from '../Session';

const CommunitySignedIn = () => (
	
	<AuthUserContext.Consumer>
		{authUser =>
			(authUser) ? <Community propName={authUser} /> : <SignIn />
		}
	</AuthUserContext.Consumer>

)

class SignIn extends Component{

	constructor(){
		super();

		//store reference to page for rediret after signin
		store.dispatch({type:constants.SAVE_PAGE, page:"Community"});
	}
		
	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box text-center">
						<p>Please <Link to="/Signin">sign in</Link> to see your community</p>
					</div>
				</div>
			</div>
		)
	}
}	

class Community extends Component{

	constructor(props){
		super(props);
		
		//store reference to page for rediret after signin
		store.dispatch({type:constants.SAVE_PAGE, page:"/Community"});
		
		//create base firestore reference
		this.firestore = firebase.firestore();

		//set initial state
		this.state = {
			items:[],
			requestList:[],
			data:false
		}
		
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}

	componentDidMount(){

		//get user uid from  authUserContext
		this.userUID = this.props.propName.uid;
		
		//if signed in get contacts and contact requests
		if(this.userUID){
			this._getPeople();
			this._getContactRequests();
		}

	}

	componentWillUnmount(){

		//cancel snapshot listener
		this.snapshotListener();
	}

	_getPeople(){
		
		//set reference to Contacts list
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList");
		
		//create empty array
		let items = [];
			
		//set up snapshot listener	
		this.snapshotListener = ref.onSnapshot((snapshot)=>{
		
			//loop through snapshot
			snapshot.forEach( (snap)=> {
				
				//push contacts to array
				items.push(snap.data());
				
			});
		
			//save array and condtional to state
			this.setState({
				items:items,
				data:true
			})
		})
	}


	_getContactRequests(){

		//set reference to contact requests
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactRequests");

		//create empty array
		let requestList = [];

		//get contact requests from firestore
		ref.get().then((snapshot)=>{
			
			//if snapshot exists there are contact requests
			if(snapshot){
				//loop through requests and push to array
				snapshot.forEach((snap)=>{
					requestList.push(snap.data())
				})

				//add array to state for display
				this.setState({
					requestList:requestList
				})
			}else{
				//no contact requests
			}
		})
		

	}

	_handleRequestYes(e){
		
		//get id and username of contact request from display
		let contactUID = e.target.id;
		let contactUserName = e.target.value;

		//set ref to user section
		let ref = this.firestore.collection("Users").doc(this.userUID);
		
		//get own username from firestore	
		ref.get().then((snapshot)=>{
			this.userName = snapshot.data().userName;
		}).then(()=>{

			// send username and uid to requesting users ContactList
			let ref = this.firestore.collection("People").doc(contactUID).collection("ContactList").doc(this.userUID);
			let obj = {
				userName:this.userName,
				userUID:this.userUID
			}

			//set value
			ref.set(obj).then(()=>{

				//then add their contact details to own ContactList
				let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(contactUID);
			
				let obj = {
					userName:contactUserName,
					userUID:contactUID
				}
				ref.set(obj).then(()=>{
					//then remove ContactRequest
					this._deleteRequest(contactUID);
				})
			});

			
	

		})
	}

	_handleRequestNo(e){
		// handle delete request on click
		this._deleteRequest(e.target.id);
	}

	_deleteRequest(id){
		
		//set ref top contact requests
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactRequests").where("requestUserUID", "==" , id);
		
		//get the request form firestore
		ref.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				
				//delete from firestore
				snap.ref.delete()
			})
			//run get contact requests again to update display of contact requests
			this._getContactRequests();
		})
		
	}

	render(){

		let contactList, requests;

		//loop through items to display all contacts/people
		contactList = this.state.items.map((contact,index)=>{
			return <div key={index}><PersonComp userName={contact.userName} uid={contact.userUID} haveReplied={contact.haveReplied}  /><hr className="ruleLessMargin"/></div>
		})
		
				
		//loop through contact requests to display
		requests = this.state.requestList.map((request,index)=>{
			
			return <div className="well msgCompStyle" key={index}><b>{request.requestUserName}</b> would like to make contact<br />
						<p><i>"{request.content}"</i></p>
						Add contact?<button id={request.requestUserUID} value={request.requestUserName} onClick={this._handleRequestYes.bind(this)}>Yes</button>
						<button id={request.requestUserUID} onClick={this._handleRequestNo.bind(this)}>No</button>
					</div>
		})

		let signInMessage = <p>Please <Link to="/Signin">sign in</Link> to see you community</p>
		
		//display empty div until contacts have been returned form firestore
		if(!this.state.data){
			return <div />
		}

		return(

		    <div className="container">
				<div className="content-wrapper">
					<div className="row text-center ">
						
							<div>{this.userUID ? <Link to="/SearchForPeople"><button type="button" className="btn btn-primary">Find people</button></Link> : signInMessage} </div>
						
					</div><br />
									
					
						
						
					
					<div className="box text-center greyedContent">
						
						<h3>Your Community</h3>
						<hr className="ruleLessMargin"/>
						<div>
							{requests}
						</div>
						
						<div className="text-center">	
							{contactList}
						</div>

					</div>
					
				</div>
			</div>
		)
	}
}


//export default Community;
export default CommunitySignedIn;
