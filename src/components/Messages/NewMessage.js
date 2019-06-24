import React, {Component} from 'react';
import {firebase} from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';


class NewMessage extends Component{
	
	constructor(props){
		super(props);

		// setup initial state
		this.state = {
			content:"",
			items:[]
			
		}

		//get user id fomr localstorage
		this.user = LocalStorage.loadState("user");

		//set base firestore reference
		this.firestore = firebase.firestore();	
	}
	
	componentWillMount() {

		//scorll to top
		window.scrollTo(0, 0);
			
	}

	_handleInput(e){
		
		//handle text input and set to state
		this.setState({
			[e.target.id]:e.target.value
		})

	}

	_handlePost(e){
		e.preventDefault();
		
		// collect data from input
		let content = e.target.content.value;
		
		//test for content
		if(content.length > 1){
			
			// set ref for user in Messages section
			let ref = this.firestore.collection("Messages").doc(this.user).collection(this.props.msgUser);

			// get rid of 1 old message to keep message store at 10
			ref.get().then((snapshot)=>{
				
				if(snapshot.size === 11){
					let query = ref.orderBy("messageDate", "asc").limit(1);
					query.get().then((snapshot)=>{
						
						snapshot.forEach((snap)=>{
							//delete old message from both users message store
							this.firestore.collection("Messages").doc(this.user).collection(this.props.msgUser).doc(snap.id).delete();
							this.firestore.collection("Messages").doc(this.props.msgUser).collection(this.user).doc(snap.id).delete();
						})
					})
				}
			})

			//create doc in firestore
			let refDoc = ref.doc();

			//get ref of doc
			let messageID = refDoc.id;

			//get date time
			let now = Date.now();
			
			// create object data
			let obj = {
				messageContents:content,
				messageDate:now,
				messageUser:this.user,
				
			}
			
			//add message data to Messages section in firestore
			refDoc.set(obj).then(()=>{

				// set ref for user in Messages section
				let ref2 = this.firestore.collection("Messages").doc(this.props.msgUser).collection(this.user).doc(messageID);

				//get date time
				let now = Date.now();
				
				// create object data
				let obj2 = {
					
					messageContents:content,
					messageDate:now,
					messageUser:this.user,
					
				}

				//change have replied variable ready for displaying of new messages
				ref2.set(obj2).then(()=>{
					let ref3 = this.firestore.collection("People").doc(this.user).collection("ContactList").doc(this.props.msgUser);
					ref3.update({haveReplied:false});
					
					let ref4 = this.firestore.collection("People").doc(this.props.msgUser).collection("ContactList").doc(this.user);
					ref4.update({haveReplied:true});
					
					//clear content
					this.setState({
						content:""
					})					
				})
			})
		}else{
			alert("Please fill in some content")
		}
	}

	


	render(){
		return(
			<form onSubmit={this._handlePost.bind(this)} action="">	
				<div className="row box text-center greyedContent">
					<div className="col-sm-9">
						<textarea id="content" value={this.state.content} placeholder="content" className="form-control" style={{"height":"50%"}} onChange={this._handleInput.bind(this)} />
					</div>

					<button type="submit" value="Post message" className="btn btn-primary extraMargin">Send <i className="fa fa-paper-plane"></i> </button>
				</div>
			</form>	
		)
	}
}

export default NewMessage;