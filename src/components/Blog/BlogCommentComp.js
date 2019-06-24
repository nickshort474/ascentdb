import React, {Component} from 'react';
import ProcessDaysAgo from '../../utils/ProcessDaysAgo';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';
import BlogCommentReplyComp from './BlogCommentReplyComp';


export default class BlogCommentComp extends Component{
	
	constructor(props){
		super(props);

		//set initial state
		this.state = {
			replyArray:[],
			showHideText:"Show",
			showHideLet:"Hide",
			replyNum:0,
			replyText:""
		}

		//set reference to firestore
		this.firestore = firebase.firestore();

		//get user from localStorage
		this.userUID = LocalStorage.loadState("user");

		//get users username ready for comments or replies
		if(this.userUID){
			let usernameRef = this.firestore.collection("Users").doc(this.userUID);
			usernameRef.get().then((snapshot)=>{
				this.username = snapshot.data().userName;
			})
			this.signedIn = true;
		}else{
			this.signedIn = false;
		}
		
		this._getCommentReplies();
	}

	componentWillUnmount(){

		//detach onSnapshot listener
		this.snapshot();
		
	}

	_getCommentReplies(){

		
		//get comment replies from firestore
		let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
		
		//order returned data
		let query = ref.orderBy("timePosted", "asc");
		
		this.snapshot = query.onSnapshot((snapshot)=>{
			
			let replyNum = 0;
			let replyArray = [];

			//add returned data to replyArray
			snapshot.forEach((snap)=>{
				replyNum++;
				replyArray.push(snap.data())
			})

			//set state
			this.setState({
				replyArray:replyArray,
				replyNum:replyNum
			})
		})
	}


	_replyToComment(e){
		//grab id from button using its index value
		let id = e.target.id;
		
		//hide reply button
		document.getElementById(id).hidden = true;

		//show other buttons and input
		let cancelReply = document.getElementById(`cancelReply${id}`);
		cancelReply.hidden = false;
		let sendReply = document.getElementById(`sendReply${id}`);
		sendReply.hidden = false;
		let replyText = document.getElementById(`replyText${id}`);
		replyText.hidden = false;
				
	}
 
	_handleReplytext(e){
		//set state for reply text
		this.setState({
			replyText:e.target.value
		})
	}

	_hideReplyElements(id){

		//show reply button
		document.getElementById(id).hidden = false;

		//hide buttons and input
		let cancelReply = document.getElementById(`cancelReply${id}`);
		cancelReply.hidden = true;
		let sendReply = document.getElementById(`sendReply${id}`);
		sendReply.hidden = true;
		let replyText = document.getElementById(`replyText${id}`);
		replyText.hidden = true;
	}


	_cancelReply(e){
		
		//get id of cancel reply button
		let id = String(e.target.id).slice(11);
		
		//hide reply buttons
		this._hideReplyElements(id);

	}


	_onCommentReply(e){
		
		//get id of reply button
		let id = String(e.target.id).slice(9);
		
		//use id to get value of reply text
		let replyText = document.getElementById(`replyText${id}`).value;
		
		//set reference to replies in blog comments		
		let ref = this.firestore.collection("BlogComments").doc(this.props.userUID).collection(this.props.blogName).doc(this.props.postKey).collection("Comments").doc(this.props.commentKey).collection("Replies");
		let now = Date.now();		
		
		//create reply object
		let obj = {
			text:replyText,
			user:this.userUID,
			username:this.username,
			timePosted:now
		}

		//add reply object to firestore
		ref.add(obj);

		//hide reply elements
		this._hideReplyElements(id);

		//set state redy for new reply
		this.setState({
			showHideText:"Hide",
			showHideLet:"Show",
			replyText:""	
		})
	}

	_showHideReplies(){

		
		//hide replies to comment
		if(this.state.showHideLet === "Hide"){
			this.setState({
				showHideText:"Hide",
				showHideLet:"Show",
				
			})
		//show replies
		}else{
			this.setState({
				showHideText:"Show",
				showHideLet:"Hide"
			})
		}

		
	}

	render(){

		let replies = [];
		
		//loop through reply array to display replies for this comment
		replies = this.state.replyArray.map((reply, index)=>{
			
			return <BlogCommentReplyComp text={reply.text} time={reply.timePosted} username={reply.username} index={index} key={index} />
			
		})

		return(
			<div className="well" id={`well${this.props.index}`}>
						
				<div style={{"fontWeight":"bold"}} className="text-10">{this.props.username} - <ProcessDaysAgo date={this.props.timePosted}  /></div>
				
				<p>{this.props.text}</p>
				

				{this.signedIn ? <p style={{"cursor":"pointer","fontWeight":"bold"}} id={this.props.index} onClick={this._replyToComment.bind(this)}>	Reply 	</p> : null }

				<input  id={`replyText${this.props.index}`} type="text" placeholder="Reply to comment" hidden={true} value={this.state.replyText} onChange={this._handleReplytext.bind(this)} />
				<button id={`cancelReply${this.props.index}`} hidden={true} onClick={this._cancelReply.bind(this)}>	   Cancel 	</button>
				<button id={`sendReply${this.props.index}`} hidden={true} onClick={this._onCommentReply.bind(this)}>	Reply 	</button>


				{this.state.replyNum === 0 		? 	null 	: 	<p style={{"cursor":"pointer","fontWeight":"bold"}} onClick={this._showHideReplies.bind(this)} id={`showHideReplyButton${this.props.index}`}>	{`${this.state.showHideText}  ${this.state.replyNum} replies`}	</p> }

				{this.state.showHideLet === "Show" ? replies : null}		
			</div>

		)
	}
} 