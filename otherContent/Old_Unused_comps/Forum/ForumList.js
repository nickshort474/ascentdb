import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import ThreadComp from '../../Components/ThreadComp';
import $ from 'jquery';

export default class ForumList extends Component{
	
	
	constructor(){
		super();

		this.state = {
			topics:[],
			topicNum:"",
			totalPages:""
		}
		
		

	}
	
	componentWillMount(){
		window.scrollTo(0, 0);
	}

	componentDidMount(){
		
		let forumCatsRef = firebase.database().ref(`ForumCategories/${this.props.params.Name}`);
		forumCatsRef.once("value", (snapshot)=>{

			this.setState({
				topicNum:snapshot.val().topic_num
			})
		})

		let forumRef = firebase.database().ref(`ForumTopics/${this.props.params.Name}`);
		
		console.log(this.props.params.Name);

		forumRef.limitToFirst(10).once("value",(snapshot)=>{
			let threads = [];
			
			
			snapshot.forEach((snap)=>{
				console.log(snap.val());
				threads.push(snap.val());
			})
			
			console.log(threads);
			this.setState({
				topics:threads
			})

			this._sortPages();
		})
	}


	_sortPages(){
		
		$('#smart-paginator').smartpaginator({totalrecords:this.state.topicNum,controlsalways:false, length:5,recordsperpage:5,controlsalways:true,theme:"black",onchange:this._onChange.bind(this)});
		
		this.setState({
			totalPages:Math.ceil(this.state.topicNum / 10)
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

		
		
	}




	render(){

		let topics = this.state.topics.map((topic) => {
			
			return <ThreadComp key={topic.topic_by} topicBy={topic.topic_by} topicCat={this.props.params.Name} topicDate={topic.topic_date} topicReplies={topic.topic_replies} topicSubject={topic.topic_subject} topicId={topic.topic_id} />
		})


		return(
			<div>
				
			    <div className="container">
			        <section className="content-wrapper">
			        	<div className="box">
			            	<div className="row forum-header">
			                	<div className="col-sm-2 col-xs-3">
			                    	<a href="#" className="btn btn-primary"><i className="fa fa-edit"></i> New Thread</a>
			                    </div>
			                    
			                    <div className="col-sm-10 col-xs-9">
			                    	<div id="smart-paginator"> </div>
			                    </div>

			                </div>
			                
			                <div className="table-responsive">
			                    <table className="table table-bordered forum-wrapper">
			                        <thead>
			                            <tr>
			                                <th></th>
			                                <th>Thread</th>
			                                <th>Replies</th>
			                                <th>Views</th>
			                                <th>Last Post</th>
			                            </tr>
			                        </thead>
			                        <tbody>
			                            
			                        	{topics}


			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon new"><i className="fa fa-comment"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END 
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon"><i className="fa fa-comment"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END  
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon lock"><i className="fa fa-lock"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END 
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon lock"><i className="fa fa-lock"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END  
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon new"><i className="fa fa-comment"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END 
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon"><i className="fa fa-comment"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END  
			                            
			                            {/* THREAD - START   
			                            <tr>
			                                <td className="forum-icon"><i className="fa fa-comment"></i></td>
			                                <td>
			                                    <a href="forum-single.html"><b>Sticky:</b> ESL 2015</a>
			                                    <p className="thread-autor"><a href="profile.html">admin</a></p>
			                                </td>
			                                <td>482</td>
			                                <td>521235</td>
			                                <td>
			                                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* THREAD - END */} 
			                            
			                        </tbody>
			                    </table>
			                </div>
			                
			                <div className="row forum-header forum-footer">
			                	<div className="col-sm-2 col-xs-3">
			                    	<a href="#" className="btn btn-primary"><i className="fa fa-edit"></i> New Thread</a>
			                    </div>
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
			                </div>
			                
			            </div>
			        </section>
			    </div>
    		</div>

		)
	}
}