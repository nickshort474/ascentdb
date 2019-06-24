import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import LocalStorage from '../../utils/LocalStorage';

import ProcessEpoch from '../../utils/ProcessEpoch';

export default class MySingleBlogPost extends Component{
	
	constructor(){
		super();
		
		this.style = {
			height:"50%",
			width:"50%",
			display:"block"
		}

		this.state = {
			blogPara:[],
			comments:[],
			commentText:""
		}
		this.firestore = firebase.firestore();
		this.userUID = LocalStorage.loadState("user");

	}
	
	componentWillMount() {
		window.scrollTo(0, 0);
		this._getBlogInfo();
		this._getComments();
	}

	_getBlogInfo(){
		
		
		let ref = this.firestore.collection("Blogs").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("contentBlocks").orderBy("time");
		let dataArray = [];

		ref.get().then((snapshot)=>{
			
			snapshot.forEach((element)=>{
				
				dataArray.push(element.data());
			})

			this.setState({
				blogPara:dataArray
			})
		})
	}
	
	_getComments(){
		
		let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");
		ref.onSnapshot((snapshot)=>{
			let commentArray = [];
			snapshot.forEach((snap)=>{
				commentArray.push(snap.data().text);
			})
			this.setState({
				comments:commentArray
			})
		})
	}

	_commentText(e){
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	_postComment(){
		let commentText = this.state.commentText;
		
		this.setState({
			commentText:""
		});

		if(commentText.length > 3){
				//get username for comment display
			let username;
			let usernameRef = this.firestore.collection("Users").doc(this.userUID);
			
			usernameRef.get().then((snapshot)=>{
				username = snapshot.data().userName
				let now = Date.now();

				let ref = this.firestore.collection("BlogComments").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName).doc(this.props.match.params.PostKey).collection("Comments");
				let obj = {
					text:this.state.commentText,
					user:this.userUID,
					username:username,
					timePosted:now
				}
				ref.add(obj);
			})
		}else{
			alert("There is a three character minimum for comments")
			
		}	

	}

	render(){
		
		let content, comments

		content = this.state.blogPara.map((con)=>{
			
			if(con.type === "img"){
				return <div key={con.data} ><img style={this.style}  id='base64image' src={con.data} alt=""/><br /></div>
			}else{
				return <div key={con.data}>{con.data}<br /><br /></div>
			}
		})

		comments = this.state.comments.map((comment,index)=>{
			return <div className="well" key={index}>{comment.text}<p>by:{comment.username}</p><ProcessEpoch date={comment.timePosted} hoursWanted={true} /></div>
		})

		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to={"/MyBlogPostList/" + this.props.match.params.BlogUser +  "/" + this.props.match.params.BlogName}>&#60; Back to posts</Link>
						    </div>
					    </div>

					</div>

					<div className="row">
						<div className="col-sm-12">
							<div className="box">
								{content}
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box">
								<button  className="btn btn-primarySmall" onClick={this._postComment.bind(this)}>Comment</button>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box">
								{comments}
							</div>
						</div>
					</div>
				</section>
			</div>

		)
	}
}