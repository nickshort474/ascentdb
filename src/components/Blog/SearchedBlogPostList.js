import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import {_disable,_enable} from '../../utils/DisableGreyOut';

import BlogPostComp from './BlogPostComp';
import constants from '../../redux/constants';
import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';
		


export default class SearchedBlogPostList extends Component{
	
	constructor(){
		super();
		
		//set initial state 
		this.state = {
			postArray:[],
			showFollow:"hide"
			
		}

		/*// get store state
		let storeState = store.getState();

		//get prev page from store
		this.prevPage =  storeState.prevPage;*/

		//set initial reference to firestore
		this.firestore = firebase.firestore();
				
		//get user from localstorage		
		this.userUID = LocalStorage.loadState("user");
	}
	
	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);
		
		//save current page as prevPage fro later navigating back here
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:`/SearchedBlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}/${this.props.match.params.SearchTerm}`});
		this._getBlogInfo();
		
		//check if signed in
		if(this.userUID){
			//check if blog being viewed is not  own blog.
			if(!this.userUID === this.props.match.params.BlogUser){
				//if not own blog check whether user is already following blog
				this._checkIfFollowing();
			}
			
		}else{
			this.setState({
				showFollow:"signIn"
			})
		}
		
		
	    
	}
	
	_getBlogInfo(){
		
		// set reference to blog from blog post list	
	    let ref = this.firestore.collection("BlogPostList").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName);

	    //create empty array
	    let postArray = [];


	    ref.get().then((snapshot)=>{
	    	
	    	snapshot.forEach((element)=>{

	    		//push each content block to post array
	    		postArray.push(element.data());
	    	})

	    	//add post array to state
	    	this.setState({
	    		postArray:postArray
	    	})
	    })


	}

	_checkIfFollowing(){
		
		//set initial variable value
		let showFollow = "show";	
			
		// check this users firestore section for Blog Following	
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");
		
		ref.get().then((snapshot)=>{
		
			//loop through all followed blogs
			snapshot.forEach((snap)=>{
				
				//if one of the blog names in BlogFollowed list matches this blog name, already following				
				if(snap.data().BlogName === this.props.match.params.BlogName){
					// set local let to hide
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

		//disable all buttons
		_disable();


		// set reference to blogs followed in this users firestore section
		let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing"); 
		
		//set time
		let now = Date.now();

		//set blog object
		let blogObj = {
			blogName:this.props.match.params.BlogName,
			dateFollowed:now
		}

		//add blog obj to users followed blogs
		ref.add(blogObj).then(()=>{
			
			//Then.. set reference to this user in this blogs followers section	
			let newRef = this.firestore.collection("BlogNames").doc(this.props.match.params.BlogName).collection("Followers");
			
			//create object
			let blogRef = {
				blogUser:this.userUID,
				dateFollowed:now
			}

			//add object
			newRef.add(blogRef).then(()=>{
				
				//hide follow button
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

		//loop through content to display
		let content = this.state.postArray.map((blog)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName}  blogUser={this.props.match.params.BlogUser} date={blog.date} imgData={blog.firstImage}   key={blog.date} />
			
		})

		//test conditions to determine buttons to show
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
						   		<Link to={`/SearchedBlogs/${this.props.match.params.SearchTerm}`}>&#60; Back</Link>
						    </div>
					    </div>
					</div>

					<div className="row">    
					   
					
						<div className="col-sm-12">
							<div className="box">
								<h3 className="text-center">{this.props.match.params.BlogName} </h3>
								{showFollowButton}
								<div>
									{content}
								</div>
								
							</div>
						</div>
												
					</div>
					
				</section>

			</div>


			
		)
	}
}