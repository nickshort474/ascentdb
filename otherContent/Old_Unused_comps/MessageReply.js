import React, {Component} from 'react';

import {firebase} from '@firebase/app';

import store from '../../redux/store';
//import constants from '../../redux/constants';

export default class MessageReply extends Component{
	
	constructor(){
		super();
		this.state = {
			content:"",
			allowPrivateReply:"No",
			
		}

		let storeState = store.getState();
		this.user = storeState.userName;
		this.userUID = storeState.userUID;

	}

	componentWillMount(){
		console.log(this.props.match.params.MessageUser);
		if(this.props.match.params.MessageType === "Community"){
			this.communityMsg = true
		}else{
			this.communityMsg = false
		}
		this.firestore = firebase.firestore();
	}



	_handlePost(e){

		e.preventDefault();

		if(this.communityMsg === true){
			
			let ref = this.firestore.collection("CommunityMessages").doc(this.props.match.params.MessageID).collection("MessageReplies");
			ref.doc()

			let now = Date.now();

			let obj = {
				content:this.state.content,
				date:now,
				user:this.user,
				userUID:this.userUID,
				privateReply:this.state.allowPrivateReply
			}

			ref.add(obj).then(()=>{
				console.log("whoa added");
				this.props.history.push('/Community');
			})
		}else{
			
			let ref = this.firestore.collection("Messages").doc(this.props.match.params.MessageUser).collection("messages").doc(this.props.match.params.MessageID).collection("MessageReplies");

			let now = Date.now();

			let obj = {
				content:this.state.content,
				date:now,
				user:this.user,
				userUID:this.userUID,
				privateReply:this.state.allowPrivateReply
			}

			ref.add(obj).then(()=>{
				console.log("whoa added");
				this.props.history.push('/Community');
			})
		}
		

		



	}

	_handleCancel(){
		//handle cancel
		this.props.history.push('/Community');
	}

	

	_handleContentChange(e){
		this.setState({
			content:e.target.value
		})
	}

	_handleRadio(e){
		e.preventDefault()
		let value = e.target.id
		this.setState({
			allowPrivateReply:value
		})
	}

	render(){
		
		return(
			<div className="container">
			 	<section className="content-wrapper">
					
					<div className="box">
						<div className="row">
							<h2 className="text-center">Message Reply</h2>
						</div>
					</div>	
				<form onSubmit={this._handlePost.bind(this)} action="">	
					<div className="box">
						

						<div className="row">
							<div className="col-sm-3">
								<label htmlFor="content">Content</label>
							</div>
							<div className="col-sm-9">
								<textarea id="content" value={this.state.content} placeholder="content" onChange={this._handleContentChange.bind(this)} />
							</div>
						</div>
						<div className="row">
							<div className="col-sm-3">
								<label htmlFor="privateReply">Allow private message reply?</label>
							</div>
							<input type="radio" name="privateReply" id="Yes" value={this.state.allowPrivateReply}  checked={this.state.allowPrivateReply === "Yes"} onChange={this._handleRadio.bind(this)} />Yes<br />
							<input type="radio" name="privateReply" id="No" value={this.state.allowPrivateReply} checked={this.state.allowPrivateReply === "No"} onChange={this._handleRadio.bind(this)} />No
						</div>
						
					</div>
						
					<div className="box">
						<input type="button" value="Go Back" onClick={this._handleCancel.bind(this)} className="btn btn-primary extraMargin"/>
						<button type="submit" value="Post message" className="btn btn-primary extraMargin">Submit</button>

						{/*<input type="button" value="Private Message" onClick={this._privateMessage.bind(this)}/>*/}
						
					</div>

					
				</form>		
					
					
				</section>
			</div>

		)
	}
}