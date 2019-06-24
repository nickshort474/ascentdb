import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import MessageComp from './MessageComp';
import CommunityMessageComp from './CommunityMessageComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class Community extends Component{
	
	constructor(){
		super();
		
		store.dispatch({type:constants.SAVE_PAGE, page:"Community"});

		let storeState = store.getState();
		this.userUID = storeState.userUID;
		
		this.state = {
			items:[],
			comMsgs:[],
			signIn:false,
			communityVisible:true
		}
		
		
	}

	componentWillMount() {
		window.scrollTo(0, 0);
		

		this.firestore = firebase.firestore();
		console.log(this.userUID)
		if(this.userUID){
			
			this._gatherMessages();
			this._gatherCommunityMessages();
		}else{
			this._gatherCommunityMessages();
			
			this.setState({
				signIn:true
			})
		}

	}

	componentDidMount(){
		this.mounted = true
	}

	componentWillUnmount(){
		this.mounted = false;
	}
	
	_gatherMessages(){
		

		let userUIDRef = this.firestore.collection("userUIDs").doc(this.userUID).collection("MessageFollowing");

		let newRef = userUIDRef.orderBy("messageDate", "desc");
		let items = [];	
		
		try{

			newRef.get().then((snapshot)=>{
				
				snapshot.forEach((snap)=>{
					

					let msgRef = this.firestore.collection("Messages").doc(snap.data().messageUser).collection("messages");
					
					let limitRef = msgRef.where("messageDate", "==", snap.data().messageDate);
					
					limitRef.get().then((snapshot2)=>{
						
						snapshot2.forEach((snap2)=>{
							items.push(snap2.data())
							
							
							
						})

						if(this.mounted){
							this.setState({
								items:items,
								
							})
						}
					})



					
				})
				
			})
		}catch(e){
			console.log(e)
		}
	}
	
	_gatherCommunityMessages(){

		console.log("gather community messages");
		let ref = this.firestore.collection("CommunityMessages").orderBy("messageDate");
		
		
		let comMsgs = []

		ref.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				
				comMsgs.push(snap.data())
			})
			this.setState({
				comMsgs:comMsgs
			})
		})

	}

	_clickMessageFeed(e){
		console.log(e.target.id)

		if(e.target.id === "community"){
			this.setState({
				communityVisible:true
			})
		}else{
			this.setState({
				communityVisible:false
			})
		}
	}


	render(){

		let msgs = this.state.items.map((msg, index)=>{
			if(this.userUID === msg.messageUser){
				return <div className="row" key={index}>
							<div className="col-xs-1">
								ME
							</div>
							<div className="col-xs-11">
								<MessageComp subject={msg.messageSubject}  messageType={msg.messageType} messageID={msg.messageID} content={msg.messageContents} date={msg.messageDate} userName={msg.messageUserName} user={msg.messageUser} image={msg.messageImage} />
							</div>
						</div>
			}else{

				return <div className="row" key={index}>
							<div className="col-xs-11">
								<MessageComp subject={msg.messageSubject}  messageType={msg.messageType} messageID={msg.messageID} content={msg.messageContents} date={msg.messageDate} userName={msg.messageUserName} user={msg.messageUser} image={msg.messageImage}  />
							</div>
							<div className="col-xs-1">
								NOT ME
							</div>
						</div>
				
			}
			
		})

		let comMsgs = this.state.comMsgs.map((msg, index)=>{
			return <CommunityMessageComp  subject={msg.messageSubject}  messageType={msg.messageType} messageID={msg.messageID} content={msg.messageContents} date={msg.messageDate} userName={msg.messageUserName} user={msg.messageUser} image={msg.messageImage} key={index} />
		})



		if(this.state.signIn){
			var signIn = <p>Please <Link to="/Signin">sign in</Link> to see your messages, contacts and send new messages</p>
		}else{
			var links = <div className="row">
							<Link to="FindPeople"><button type="button" className="btn btn-primary extraMargin">Find people</button></Link>
							<Link to="ContactsList"><button type="button" className="btn btn-primary extraMargin">Your Contacts</button></Link>
						</div>
		}

		return(
			
				
		    <div className="container">
			 	<div className="content-wrapper">
					
					
					<div className="row box text-center">
						
							{/*<Link to="NewMessage/Public/null"><button type="button" className="btn btn-primary extraMargin">New Message +</button></Link>
							<Link to="FindPeople"><button type="button" className="btn btn-primary extraMargin">Find people</button></Link>
							<Link to="ContactsList"><button type="button" className="btn btn-primary extraMargin">Your Contacts</button></Link>*/}
							{links}
						
					</div>	
					<div className="row box text-center">	
						<div className="row">
							<div className="col-xs-8">
								<h2 className="text-center" style={{ cursor: 'pointer' }} id="message" onClick={this._clickMessageFeed.bind(this)}>Your Feed</h2>
							</div>
							<div className="col-xs-4">	
								<Link to="NewMessage"><button type="button" className="btn btn-primary extraMargin"><span className="glyphicon glyphicon-plus"></span></button></Link>
							</div>
						</div>

						<div className="row">	
							<div className="col-xs-8">
								<h2 className="text-center" style={{ cursor: 'pointer' }} id="community" onClick={this._clickMessageFeed.bind(this)}>Community Feed</h2>
							</div>
							<div className="col-xs-4">	
								<Link to="NewCommunityMessage"><button type="button" className="btn btn-primary extraMargin"><span className="glyphicon glyphicon-plus"></span></button></Link>
							</div>
						</div>
					</div>
					<div className="row box">	
						<div>{this.state.communityVisible ? comMsgs : msgs}</div>
						
						<div className="text-center">{signIn}</div>
					</div>
					
					
				</div>
			</div>
			

		)
	}
}

