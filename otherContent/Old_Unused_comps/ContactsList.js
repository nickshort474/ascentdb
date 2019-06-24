import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withFirebase} from '../Firebase';

import PersonComp from './PersonComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';


class ContactsList extends Component {
	
	constructor(props){
		super(props);
		this.state = {
			items:[],
			requestList:[]
			
		}
		store.dispatch({type:constants.SAVE_PAGE, page:"ContactsList"});
	}

	componentWillMount() {
		window.scrollTo(0, 0);
		let storeState = store.getState();

		this.userUID = storeState.userUID;
		
		this.userUID = LocalStorage.loadState("user");
		this.firestore = this.props.firebase.mainRef();

		if(this.userUID){
			console.log("user signed in");
			this._getContactsList();
			this._getFriendRequests();
		}else{
			this.setState({
				signInNeeded:true
			})
		}
		
		
		

		
	}

	_getContactsList(){
		
		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactList");
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


	_getFriendRequests(){
		let requestList = []

		let ref = this.firestore.collection("People").doc(this.userUID).collection("ContactRequests");
		ref.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				requestList.push(snap.data())
			})
			this.setState({
				requestList:requestList
			})
		})
	}

	_handleRequestYes(e){
		console.log(e.target.id)
		// send users info (UID) to ..... People / request.userUID e.target.value / friends
		/*let ref = this.firestore.collection("People").doc(e.target.id).collection("friends").doc(this.userUID);
		let obj = {
			userName:this.userName,
			userUID:this.userUID
		}

		ref.set(obj);

		

		this._deleteRequest(e.target.id);*/
		

	}

	_handleRequestNo(e){
		console.log(e.target.id)
		//this._deleteRequest(e.target.id);
	}

	_deleteRequest(id){
		console.log(id)
		let ref = this.firestore.collection("People").doc(this.userUID).collection("friendRequests").where("userUID", "==" , id);
		ref.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				snap.ref.delete()
			})
			this.setState({
				requestList:[]
			})
		})
		

	}


	render(){


		let people = this.state.items.map((person)=>{

			return <PersonComp  userName={person.userName} uid={person.userUID}  key={person.userUID} />
		})

		let friends = this.state.requestList.map((request,index)=>{
			
			return <div key={index}>{request.requestUserName} would like to be your friend<button id={request.requestUserUID} onClick={this._handleRequestYes.bind(this)}>Yes</button><button id={request.userUID} onClick={this._handleRequestNo.bind(this)}>No</button></div>
		})

		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Community">&lt; Go Back</Link>
					</div>
					<div className="box text-center">
						
						<div>{friends}</div>
						
					</div>
					<div className="box text-center">
						
						<div>{people}</div>
						
					</div>
				</div>
			</div>
		)
		
	}
}


export default withFirebase(ContactsList);