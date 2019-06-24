import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import ProcessEpoch from '../../Components/ProcessEpoch';

import store from '../../redux/store';

export default class MessageComp extends Component{
	
	constructor(){
		super();

		this.userStyle = {
			marginBottom:"0"
		}
		this.state={
			replies:[],
			replyCount:0,
			showAll:false

			
		}
		this.counter = 0
		
	}

	componentWillMount(){
		
		this.contentStyle = {};
		let storeState = store.getState();
		this.user = storeState.userUID;

		if(this.props.messageType === "friends"){
			this.contentStyle = {
				backgroundColor:"red"
			}

		}else if(this.props.messageType === "private"){
			this.contentStyle = {
				backgroundColor:"blue"
			}
		}

		if(this.props.image === "no image"){
			this.image = null;
		}else{
			this.image = <img src={this.props.image} className="img-thumbnail" alt="user provided"/>
		}

		this.firestore = firebase.firestore()
		let replies = [];
		let replyCount = 0;

		let replyRef = this.firestore.collection("Messages").doc(this.props.user).collection("messages").doc(this.props.messageID).collection("MessageReplies").orderBy("date");
		
		replyRef.get().then((snapshot)=>{
		 	snapshot.forEach((snap)=>{
		 		replyCount++;
		 		replies.push(snap.data());
		 	})
		 	this.setState({
		 		replies:replies,
		 		replyCount:replyCount,
		 		messageUser:this.props.user,
		 		messageID:this.props.messageID
		 	})
		 	
		})
	}


	_showAllReplies(){
		this.setState({
			showAll:true
		})
		
	}

	_showLessReplies(){
		this.setState({
			showAll:false
		})
		this.counter = 0;
		
	}


	render(){
		
		let showMoreLessButton;
		
		// eslint-disable-next-line
		let replies = this.state.replies.map((reply,index)=>{
			this.counter++;
			
			if(this.state.showAll === false & this.counter <= 2){
				return <div key={index}>
							<p>{index + 1}. {reply.content}
								<span className="text-muted text-10">
									{/* test for privateReply as to whether username acts as link to user profile */}
									{reply.privateReply === "Yes" 	? 	<Link to={`/User/${reply.userUID}`} className="msgCompStyle"> {reply.user}</Link>	 : 		<span> {reply.user}</span>	}
									
								</span> 
							</p>	
						</div>

			}else if(this.state.showAll === true){
				return <div key={index}>
							<p>{index + 1}. {reply.content}
								<span className="text-muted text-10">
									{/* test for privateReply as to whether username acts as link to user profile */}
									{reply.privateReply === "Yes" 	? 	<Link to={`/User/${reply.userUID}`} className="msgCompStyle"> {reply.user}</Link>	 : 		<span> {reply.user}</span> 	}
								</span> 
								</p>
						</div>
			}
			
		})

		if(this.state.replyCount > 3){
			if(this.state.showAll !== true){
				showMoreLessButton = <div className="msgCompStyle">	<button onClick={this._showAllReplies.bind(this)}>Show more replies.</button></div>
			}else{
				showMoreLessButton = <div className="msgCompStyle">	<button onClick={this._showLessReplies.bind(this)}>Show less replies.</button></div>
			}
			
		}

		return(
			<div>
				<section className="well msgWell" style={this.contentStyle}>
					
						<div className="row msgCompStyle">
							<h2 title="title here">{this.props.subject} </h2>
						</div>
						
						<div className="row msgCompStyle">
							<p className="col-sm-8">{this.props.content}</p>
							<p className="col-sm-4">{/*<img src={this.props.image} className="img-thumbnail" alt="placeholder"/>*/}{this.image}</p>
						</div>


						<div className="row">
							<p style={this.userStyle}>
								<small className="text-muted">Posted by: {this.props.userName}</small>
							</p>
							<div>						
								<small className="text-muted"><ProcessEpoch date={this.props.date} /></small>
							</div>
						</div>
						<div className="row">
							<Link to={`/MessageReply/${this.state.messageUser}/${this.state.messageID}/Private`} className="msgCompStyle">Reply</Link>
						</div>
						
						
				</section>
				<section className="well replyWell">
					<div className="row">
						<div className="msgCompStyle">
							{replies !== [] ? replies : "No replies yet!"}
						</div>
						<div className="msgCompStyle">
							{/*<button onClick={this._showAllReplies.bind(this)}>Show more replies.</button>*/}
							{showMoreLessButton}
						</div>
					</div>
				</section>

			</div>

		)
	}
}