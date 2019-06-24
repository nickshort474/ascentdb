import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';

import MessageComp from './MessageComp';
import NewMessage from './NewMessage';

class Messages extends Component{
	
	constructor(){
		super();
		
		//set initial state
		this.state = {
			messages:[]
		}
				
	}

	componentWillMount(){
				
		//save current page to state
		store.dispatch({type:constants.SAVE_PAGE, page:`/Person/${this.props.match.params.PersonKey}/${this.props.match.params.PersonUsername}`})
		
		//set base firestore ref
		this.firestore = firebase.firestore();

		//get user id form localstorage
		this.userUID = LocalStorage.loadState("user");
		
		//gather message data
		this._gatherMessages();

	}
	

	componentWillUnmount(){

		//remove snapshot listener
		this.snapshotListener();
	}

	_gatherMessages(){
		
		//set ref to message conversation in firestore
		let ref = this.firestore.collection("Messages").doc(this.userUID).collection(this.props.match.params.PersonKey);

		//query by message date
		let query = ref.orderBy("messageDate","asc");
		
		//get message data
		this.snapshotListener = query.onSnapshot((snapshot)=>{
			
			//set empty array to store messages
			let items = [];

			//loop through snapshot 
			snapshot.forEach((snap)=>{
				
				//push each message to array
				items.push(snap.data());
				
			})

			//save array to state 
			this.setState({
				messages:items
			},()=>{
				
				//scroll to bottom of page to see lastest messages
				window.scrollTo(0, 1000);
			})

			
		})
		
	}

	render(){
		
		// loop through state to display each message using MessageComp
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
				

					<div className="row box text-center greyedContent">
						<h3>Last 10 messages</h3>
						{messages.length > 0 ? messages : <p>No messages yet</p>}
					</div>
					<NewMessage msgUser={this.props.match.params.PersonKey} />

					<div className="row box greyedContent">
						
						<Link to="/Community">&lt; Back</Link>
						
					</div>
					
				</div>
			</div>
		)
	}
}
	

	export default Messages;