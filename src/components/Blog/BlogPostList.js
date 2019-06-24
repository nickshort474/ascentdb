import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import {_disable,_enable} from '../../utils/DisableGreyOut';

import BlogPostComp from './BlogPostComp';
import constants from '../../redux/constants';
import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
		


export default class BlogPostList extends Component{
	
	constructor(){
		super();
		
		//set initial state
		this.state = {
			postArray:[],
			showFollow:"show"
			
		}

		//get prevpage from store 
		/*let storeState = store.getState();
		this.prevPage =  storeState.prevPage;*/

		//set ref to firestore
		this.firestore = firebase.firestore();

		//get user id from localstorage		
		this.userUID = LocalStorage.loadState("user");
	}
	
	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);
		
		//dispatch reference to this page to store for navigating back to this page 
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:`/BlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}`});
		
		//get blog info
		this._getBlogInfo();
		
		//check if signed in
		if(this.userUID){
			
			//check if blog being viewed is not own blog.
			if(this.userUID !== this.props.match.params.BlogUser){
				
				//if not own blog check whether user is already following this blog
				this._checkIfFollowing();
			}
			
		}else{
			this.setState({
				showFollow:"signIn"
			})
		}
		
		
	    
	}
	
	_getBlogInfo(){
		
		//set reference to blog in firestore
	    let ref = this.firestore.collection("BlogPostList").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName);

	    //create post array
	    let postArray = [];

	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{
	    		//push data to post array
	    		postArray.push(element.data());
	    	})

	    	//set post array to store
	    	this.setState({
	    		postArray:postArray
	    	})
	    })


	}

	_checkIfFollowing(){
		
		
		let showFollow = "show";	
		
		//check if this user is following this blog	
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
		
		ref.get().then((snapshot)=>{
		
			snapshot.forEach((snap)=>{
				
				//if one of the blog names in BlogFollowed list matches this blog name, already following				
				if(snap.data().blogName === this.props.match.params.BlogName){
					
					// set local variable to hide
					showFollow = "hide";						
				}
			})

			//assign value of local variable to state
			this.setState({
				showFollow:showFollow
			})
			
		})
		
	}

	_followBlog(){

		//disable buttons on click of follow button
		_disable();


		//set reference to this blog in this users blog following section
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
		
		let now = Date.now();

		//create blog object
		let blogObj = {
			blogName:this.props.match.params.BlogName,
			dateFollowed:now
		}

		//add object to firestore
		ref.add(blogObj).then(()=>{
			
			//add reference to this user in followers section for this blog
			let newRef = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
			
			//create object
			let blogRef = {
				blogUser:this.userUID,
				dateFollowed:now
			}

			//add object to firestore
			newRef.add(blogRef).then(()=>{
				//hide follow butotn
				this.setState({
					showFollow:"hide"
				})

				//enable buttons
				_enable();
			})
		})
		
	}




	render(){

		let showFollowButton;

		//loop through post array to show all post for this blog
		let content = this.state.postArray.map((blog)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName} blogUser={this.props.match.params.BlogUser} date={blog.date} firstImage={blog.firstImage}   key={blog.date} />
			
		})

		//test conditionals to decide which buttons to show
		if(this.state.showFollow === "show"){
			showFollowButton = <button type="button" className="btn btn-primary" disabled={this.state.isEnabled} onClick={this._followBlog.bind(this)}>Follow this Blog</button>
		}else if(this.state.showFollow === "signIn"){
			showFollowButton = <div className="text-center">Please <Link to="/Signin">sign in</Link> to follow this blog</div>
		}else if(this.state.showFollow === "hide"){
			showFollowButton = <p></p>
		}
		
		
		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row">
						<div className="col-sm-12 ">
							<div className="box">
						   		<Link to="/ViewBlogs">&#60; Back</Link>
						    </div>
					    </div>
					</div>

					<div className="row">    
					   
					
						<div className="col-sm-12">
							<div className="box">
								<h2 className="text-center">{this.props.match.params.BlogName} </h2>
								
								<div>
									{content}
								</div>
								<div className="text-center">{showFollowButton}</div>
							</div>
						</div>
												
					</div>
					
				</section>

			</div>


			
		)
	}
}