import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';

import MessageComp from '../Messages/MessageComp';


class Person extends Component{
	
	constructor(){
		super();
		
		
		this.state = {
			messages:[]
			
		}
				
	}

	componentWillMount(){
		window.scrollTo(0, 100);
		
		store.dispatch({type:constants.SAVE_PAGE, page:`/Person/${this.props.match.params.PersonKey}/${this.props.match.params.PersonUsername}`})
		
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");
		this.savedMsgState = LocalStorage.loadState("messages");
		
		this._getUserInfo();

		this._checkForNewMessages();

		//this._gatherMessages();	
		
		
/*
		if(this.savedMsgState){
			this.setState({
				messages:this.savedMsgState
			})
		}else{
			this._gatherMessages();
		}*/

		//this._gatherMessageUpdates()
	}
	
	
	
	_getUserInfo(){

		//check whether perosn you asre vieing is already friend
		let isFriend;
		let ref2 = this.firestore.collection("People").doc(this.userUID).collection("ContactList").doc(this.props.match.params.PersonKey);
		
		ref2.get().then((snapshot)=>{
			
			if(snapshot.exists){
				isFriend = true
				
			}else{
				isFriend = false;
			}
			
			this.setState({
				isFriend:isFriend
			})
			
		})
		
		//check whether a firend request has been made
		let ref3 = this.firestore.collection("People").doc(this.props.match.params.PersonKey).collection("ContactRequests");
		let query = ref3.where("requestUserUID", "==", this.userUID);
		
		query.get().then((snapshot)=>{
			console.log("line 76 " + snapshot)
			snapshot.forEach((snap)=>{
				if(snap.data().requestUserUID === this.userUID){
					// user has already sent request
					this.setState({
						requestSent:true
					})
				};
			})
		})


	}

	_checkForNewMessages(){

		let lastMsg = LocalStorage.loadState("lastMesssge");
		let ref = this.firestore.collection("Messages").doc(this.userUID).collection(this.props.match.params.PersonKey);
		let query = ref.orderBy("messageDate", "desc").limit(1);
		query.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				console.log(snap.data().messageDate)
				if(snap.data().messageDate === lastMsg){
					
					console.log("no new messages");
				}
				else{
					console.log("need to download new messages!")
				}
			})
		})
	}


	_gatherMessages(){
		
		let items = [];
		

		let ref = this.firestore.collection("Messages").doc(this.userUID).collection(this.props.match.params.PersonKey);
		let query = ref.orderBy("messageDate","asc");
		
		query.get().then((snapshot)=>{
			snapshot.forEach((snap)=>{
				
				items.push(snap.data());
				
			})
			this.setState({
				messages:items
			},()=>{
				this._saveToState(items)
				window.scrollTo(0, 500);
			})

			
		})
	}

	_saveToState(items){
		let len = items.length - 1;
		let lastItem = items[len].messageDate;
		console.log(lastItem);
		LocalStorage.saveState("messages",items);
		LocalStorage.saveState("lastMessage",lastItem);

	}







	_gatherMessageUpdates(){
		// check this.firestore.collection("Users").doc(this.userUID).collection("Messages"); for message number
	}

	/*_gatherMessageUpdates(){
		let changeLocation;
		let changeUser;

		let ref = this.firestore.collection("Users").doc(this.userUID).collection("Messages");
		let query = ref.orderBy("messageDate","asc");
		query.onSnapshot((snapshot)=>{
			snapshot.docChanges().forEach((change)=>{
				if(change.type === "added"){
					changeLocation = change.doc.data().messageLocation;
					changeUser = change.doc.data().messageUser;
				}
			})
		}).then(()=>{
			let ref2 = this.firestore.collection("Messages").doc(changeUser).collection("Messages").doc(changeLocation);
			ref2.get().then((snapshot)=>{

			})
				
		})
	}*/

	_handleContactRequest(){
		this.props.history.push(`/ContactRequest/${this.props.match.params.PersonKey}`)
	}


	render(){

		let buttonToShow;

		if(this.state.isFriend){
			buttonToShow = <Link to={`/NewMessage/${this.props.match.params.PersonUsername}/${this.props.match.params.PersonKey}`}><button className="btn-primary">PM {this.props.match.params.PersonUsername}</button></Link>
		}else if(this.state.isFriend === false && this.state.requestSent === false ){
			buttonToShow = <button className="btn-primary" onClick={this._handleContactRequest.bind(this)} style={this.buttonStyle} >Contact Request </button>
		}else if(this.state.requestSent === true){
			buttonToShow = <p>Contact Request Pending</p>
		}
		
		

		let messages = this.state.messages.map((msg,index)=>{

			let ownMsg = false;

			if(msg.messageUser === this.userUID){
				ownMsg = true
			}
			return <MessageComp  contents={msg.messageContents} ownMsg={ownMsg} user={msg.messageUser} date={msg.messageDate} key={index} />
		})



		return(
			
			<div className="container">

				<div className="content-wrapper">
				

					<div className="row box">
						<h2>Last 10 messages</h2>
						{messages}
					</div>
					<div className="row box">
						<div className="col-sm-4">
							{buttonToShow}
						</div><br />
						<div className="col-sm-4">
							<Link to={`/PersonProfile/${this.props.match.params.PersonKey}`}><button className="btn-primary">Show profile</button></Link>
						</div>
						<div className="col-sm-4">
							<Link to="/Community">&lt; Back to contact list</Link>
						</div>
					</div>
					
				</div>
			</div>
		)
	}
}
	

	export default Person;