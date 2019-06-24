import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';
import PostComp from '../../Components/PostComp';
import ReplyComp from '../../Components/ReplyComp';
import $ from 'jquery';

export default class ForumSingle extends Component{
	
	
	constructor(){
		super();
		
		this.state = {
			topicId:"",
			topicBy:"",
			topicDate:"",
			topicSubject:"",
			replies:[],
			replyKeys:[],
			quote:" ",
			newReply:"",
			totalPages:""
		}


		{/* "ForumTopics/" + "-kqudnrbvvjscb" */}
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}
	
	componentDidMount(){
		
		this.setState({
			topicId:this.props.params.topicId
		})
		console.log(this.props.params.topicId);
		let forumRef = firebase.database().ref(`ForumTopics/${this.props.params.topicCat}/${this.props.params.topicId}`);
		
		forumRef.once("value", (snapshot) => {
			
			this.setState({
				
				topicBy:snapshot.val().topic_by,
				topicDate:snapshot.val().topic_date,
				topicSubject:snapshot.val().topic_subject,
				topicReplies:snapshot.val().topic_replies,
				
			})
			
			this._sortPages();
		})

		let replyRef = firebase.database().ref(`ForumReplies/${this.props.params.topicId}`);
		let forumReplies = [];
		let replyKeys = [];

		replyRef.limitToFirst(5).once("value", (snapshot)=>{
			
			snapshot.forEach((snap)=>{
				forumReplies.push(snap.val());
				replyKeys.push(snap.key);
			})
					
			
			this.setState({
				replies:forumReplies,
				replyKeys:replyKeys
			})

			
		})
		
	}

	
	_quotePost(event){
		event.preventDefault();
		this.setState({
			quote:this.props.replyBody
		})

	}

	_sortPages(){
		
		$('.smart-paginator').smartpaginator({totalrecords:this.state.topicReplies,controlsalways:false, length:5,recordsperpage:5,controlsalways:true,theme:"black",onchange:this._onChange.bind(this)});
		
		this.setState({
			totalPages:Math.ceil(this.state.topicReplies / 5)
		})
		
	}

	_onChange(pageNum, startIndex, endIndex){
		
		let nextReplyRef = firebase.database().ref(`ForumReplies/${this.props.params.topicId}`);
		let forumReplies = [];
		let replyKeys = [];

		let keyToStartAt = "reply_" + this._pad(startIndex);
		
		nextReplyRef.startAt(null, keyToStartAt).limitToFirst(5).once("value", (snapshot) =>{
			
			
			snapshot.forEach((snap)=>{
				forumReplies.push(snap.val());
				replyKeys.push(snap.key);
			})
			this.setState({
				replies:forumReplies,
				replyKeys:replyKeys
			})
		});

		//update other paginator to show correct page
		$('.smart-paginator').smartpaginator({totalrecords:this.state.topicReplies,controlsalways:false,length:5,recordsperpage:5,controlsalways:true,theme:"black",onchange:this._onChange.bind(this), initval:pageNum});

	}

	
	_pad(num){
        return ("00000" + (num + 1)).substr(num.toString().length);
    }

	_replyButton(event){
		event.preventDefault();
		
		console.log("total pages = " + this.state.totalPages);
		// check if last page if not send to last page of comments --------DONE
		let limitNumber = this.state.topicReplies%5;

		if(limitNumber == 0){
			limitNumber = 5;
		}

		console.log("limit number is " + limitNumber);

		let nextReplyRef = firebase.database().ref(`ForumReplies/${this.props.params.topicId}`);
		let forumReplies = [];
		let replyKeys = [];

		nextReplyRef.limitToLast(limitNumber).once("value", (snapshot) =>{
			
			
			snapshot.forEach((snap)=>{
				forumReplies.push(snap.val());
				replyKeys.push(snap.key);
			})
			this.setState({
				replies:forumReplies,
				replyKeys:replyKeys
			})
		});

		//update paginator to take to last page  ----DONE
		$('.smart-paginator').smartpaginator({totalrecords:this.state.topicReplies,controlsalways:false,length:5,recordsperpage:5,controlsalways:true,theme:"black",onchange:this._onChange.bind(this), initval:this.state.totalPages});


		//show replyComp ---------- DONE
		this.setState({
			newReply:<ReplyComp handler={this._replyCompHandler.bind(this)} topicCat={this.props.params.topicCat} topicId={this.props.params.topicId}/>
		})
		// once completed: ('Synchronization succeeded') in replyComp call replyCompHandler to remove reply box ------- DONE

		// need to add new post to screen

		// and update pagination 
		
	}

	_replyCompHandler(){
		console.log("replyCompHandler");
		
		let nextReplyRef = firebase.database().ref(`ForumReplies/${this.props.params.topicId}`);
		let forumReplies = [];
		let replyKeys = [];

		// need to re get topicReplies and totalPages
		

		let forumRef = firebase.database().ref(`ForumTopics/${this.props.params.topicCat}/${this.props.params.topicId}`);
		
		forumRef.once("value", (snapshot) => {
			
			this.setState({
				topicReplies:snapshot.val().topic_replies,
			})

			let newTotalPages = Math.ceil(this.state.topicReplies/ 5);
			let limitNumber = (this.state.topicReplies)%5;
			console.log(newTotalPages);
			console.log(limitNumber);

			if(limitNumber == 0){
				limitNumber = 5;
			}
			nextReplyRef.limitToLast(limitNumber).once("value", (snapshot) =>{
			
			
				snapshot.forEach((snap)=>{
					forumReplies.push(snap.val());
					replyKeys.push(snap.key);
				})
				this.setState({
					replies:forumReplies,
					replyKeys:replyKeys
				})
			});

			//update paginator to take to last page  ----DONE
			$('.smart-paginator').smartpaginator({totalrecords:this.state.topicReplies,controlsalways:false,length:5,recordsperpage:5,controlsalways:true,theme:"black",onchange:this._onChange.bind(this), initval:newTotalPages});


			this.setState({
				newReply:"",
			});


		})
	}



	render(){

		let replies = this.state.replies.map((reply)=>{
			
			return <PostComp replyBody={reply.reply_body} replyDate={reply.reply_date} replyBy={reply.reply_by} key={reply.reply_date} />
		})

		return(
			<div>
				{/* ==========================
			    	CONTENT - START 
			    =========================== */}
			    <div className="container">
			        <section className="content-wrapper">
			        	
			            
			            <div className="row forum-header">
			                <div className="col-sm-2 col-xs-3">
			                    <Link to="AddThreadPage" className="btn btn-primary"><i className="fa fa-edit"></i> New Thread</Link>
			                </div>
			                <div className="col-sm-10 col-xs-9">
			                	<div className="smart-paginator"> </div>
			                </div>
						</div>

			            

			            {/* FORUM POST - START */}
			            <div className="box forum-post-wrapper">
			                <div className="row">
			                    <div className="col-sm-3">
			                        <div className="author-detail">
			                        	<h3>Original Post</h3>
			                            <h3><a href="profile.html">{this.state.topicBy}</a></h3>
			                            
			                            <ul className="list-unstyled">
			                                <li><strong>Join Date</strong>24/10/2014</li>
			                                <li><strong>Reputation</strong>2616</li>
			                                <li><strong>Posts</strong>5578</li>
			                            </ul>
			                        </div>
			                    </div>
			                    <div className="col-sm-9">
			                        <article className="forum-post">
			                            <div className="date">{this.state.topicDate}</div>
			                            <p>{this.state.topicSubject}</p>
			                            <button onClick={this._quotePost.bind(this)} className="btn btn-primary">Quote</button>
			                        </article>
			                    </div>
			                </div>
			            </div>

			          
			            {replies}
			           
			            {this.state.newReply}
			            
			            
			            <div className="row forum-header forum-footer">
			                <div className="col-sm-2 col-xs-3">
			                    	<a href="#" className="btn btn-primary"><i className="fa fa-edit"></i>New Thread</a>
			                    	<a href="#" className="btn btn-primary" onClick={this._replyButton.bind(this)}><i className="fa fa-edit"></i>Reply</a>
			                </div>
			                 <div className="col-sm-10 col-xs-9">
			                	<div className="smart-paginator"> </div>
			                </div>
			            </div>
			            
 							{/*
			                <div className="col-sm-10 col-xs-9">
			                    <ul className="pagination">
			                        <li className="disabled"><a href="#"><i className="fa fa-angle-left"></i></a></li>
			                        <li className="active"><a href="#">1</a></li>
			                        <li><a href="#">2</a></li>
			                        <li><a href="#">3</a></li>
			                        <li><a href="#">4</a></li>
			                        <li><a href="#"><i className="fa fa-angle-right"></i></a></li>
			                    </ul>
			                </div>
			                */}
			            
			            
			        </section>
			    </div>
			    {/* ==========================
			    	CONTENT - END 
			    =========================== */}
			</div>
		)
	}

}