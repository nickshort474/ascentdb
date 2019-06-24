import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';

import BlogCommentComp from './BlogCommentComp';

import store from '../../redux/store';

/*import ProcessEpoch from '../../utils/ProcessEpoch';*/

export default class SingleBlogPost extends Component{
	
	constructor(){
		super();

		//set style
		this.style = {
			height:"100%",
			width:"100%",
			display:"block",
		}

		//set initial state
		this.state = {
			blogPara:[],
			comments:[],
			commentKeys:[],
			commentText:"",

		}
		
		//set intial referecne to firestore
		this.firestore = firebase.firestore();

		//get user id from localstorage
		this.userUID = LocalStorage.loadState("user");

		//gert previous page from store
		this.prevPage = store.getState().prevPage;
		
	}
	
	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);
		
		//get this blog users username from firestore
		let firestore = firebase.firestore();
		let ref = firestore.collection("Users").doc(this.props.match.params.BlogUser);
		ref.get().then((snapshot)=>{
			
			this.setState({
				blogUsername:snapshot.data().userName
			})
		})

		//get viewing users username ready for comments or replies
		if(this.userUID){
			let usernameRef = this.firestore.collection("Users").doc(this.userUID);
			usernameRef.get().then((snapshot)=>{
				this.username = snapshot.data().userName;
			})
			this.signedIn = true
		}else{
			this.signedIn = false
		}
		
		//gather blog info
		this._getBlogInfo();

		//gather comments
		this._getComments();
	}

	componentWillUnmount(){

		//detach onSnapshot listener
		this.snapshot();
		
	}

	_getBlogInfo(){
		
	    //set reference to blog data
	    let ref = this.firestore.collection("Blogs").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("contentBlocks").orderBy("time");
	    
	    //create empty array
	    let dataArray = [];

	    //get blog data from  firestore	
	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{

	    		//push data to array
	    		dataArray.push(element.data())
	    		
	    	})

	    	//save array to state
	    	this.setState({
	    		blogPara:dataArray
	    	})
	    })
	}

	_getComments(){

		//set reference to comments in firestore
		let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");

		//order comments by time
		let query = ref.orderBy("timePosted", "asc")

		//get comments use onsnapshot so as comments are added they immediately display
		this.snapshot = query.onSnapshot((snapshot)=>{

			//create empty arrays
			let commentArray = [];
			let commentKeyArray = [];

			//loop thoprugh snapshot to get comments and their keys
			snapshot.forEach((snap)=>{
				commentArray.push(snap.data());
				commentKeyArray.push(snap.id)
			})
			
			//save arrays to state
			this.setState({
				comments:commentArray,
				commentKeys:commentKeyArray
			})
			
		})

	}

	

	_commentText(e){

		//save comment text to state for display
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	_postComment(){
		
		//get comment text from state
		let commentText = this.state.commentText;
		
		//clear comment text from state
		this.setState({
			commentText:""
		});

		//test for 4 character minimum for comment
		if(commentText.length >= 4){
			
			//set date	
			let now = Date.now();

			//set referecne to comments section in firestore
			let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");
			
			//create comment object
			let obj = {
				text:commentText,
				user:this.userUID,
				username:this.username,
				timePosted:now
			}

			//add comment Object to firestore
			ref.add(obj);
			
			
		}else{
			//alert user aboput 4 character minimum
			alert("There is a four character minimum for comments")
		}	

		
	}



	render(){

		let content, comments;
		
		
		//loop through blog data to display
		content = this.state.blogPara.map((con)=>{
			
			if(con.type === "img"){
				return <div key={con.data} ><img style={this.style}  id='base64image' src={con.data} alt="" /><br /></div>
			}else{
				
				//test for empty paragraph content and if empty return nothing
				if(con.data !== ""){
					return <div key={con.data}>{con.data}<br /><br /></div>
				}else{
					return null
				}	
			}
			
		})

		//loop through comment data to display
		comments = this.state.comments.map((comment,index)=>{
			
			return <BlogCommentComp commentKey={this.state.commentKeys[index]} index={index} text={comment.text}  userUID={this.props.match.params.BlogUser} blogName={this.props.match.params.BlogName} postKey={this.props.match.params.PostKey} username={comment.username} timePosted={comment.timePosted} key={index} />

		})

		return(
			<div className="container">
				
				<section className="content-wrapper">
					
					<div className="box greyedContent">
						   		
						<Link to={this.prevPage}>&#60; Back</Link>
						   		
						 
					</div>
					
					<div className="box greyedContent">
						
							<div className="row">
								<span className="col-xs-6"><h4>{this.props.match.params.PostKey}</h4></span><span className="col-xs-6 text-right"><p className="text-10">By: {this.state.blogUsername}</p></span>
							</div>
						
					</div>

					<div className="row">
						<div className="col-sm-12">
							<div className="box greyedContent">
							{content}
							</div>
						</div>
					</div>
					
					<div className="row">
						<div className="col-sm-12">
							
							{this.signedIn ? 

							<div className="box form-group greyedContent">
								<label htmlFor="commentText">Leave a comment</label>
								<textarea id="commentText" value={this.state.commentText} onChange={this._commentText.bind(this)} placeholder="post a comment" className="form-control" style={{"height":"50%"}}/>
								<div className="text-center"><button className="btn btn-primarySmall" onClick={this._postComment.bind(this)}>Comment</button></div>
							</div>

							: 

							<div className="box text-center greyedContent">
								Please <Link to="/Signin">sign in</Link> to comment, or reply to comments
							</div>

							}
						</div>
					</div>
					
					<div className="row">
						<div className="col-sm-12">
							<div className="box msgCompStyle greyedContent">
								{comments}
							</div>
						</div>
					</div>
				</section>
			</div>

		)
	}
}