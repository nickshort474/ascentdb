import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

import BlogComp from './BlogComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

import LocalStorage from '../../utils/LocalStorage';
		

export default class ViewBlogs extends Component{
	
	
	constructor(){
		super();

		//save reference to current page in store
		store.dispatch({type:constants.SAVE_PAGE, page:"/ViewBlogs"});
		
		//get user id from local storage
		this.userUID = LocalStorage.loadState("user");

		//set initial state
		this.state = {
			latestBlogs:[],
			followedBlogs:[]
		}

		//set initial variable / references
		this.showLimit = 5;
		this.firestore = firebase.firestore();
		this.signInMessage = <p></p>;
	}
	


	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);

		//test if user is signed in
		if(this.userUID){
			
			//check firestore for if following any blogs

			//create empty arrays
			let followingArray = [];
			let blogArray = [];

			//set referecne to followed blogs in users section
			let ref = this.firestore.collection("Users").doc(this.userUID).collection("BlogFollowing");

			//get followed blogs
			ref.get().then((snapshot)=>{
				snapshot.forEach((snap)=>{

					//push followed blogs to followed array
					followingArray.push(snap.data().blogName);
				})
			}).then(()=>{
				
				//for each followed blog gather blog data from firestore
				followingArray.forEach((item) => {
					
					let blogName = item;
					// loop thorugh returned blogNames to gather data from BlogName firestore section
					let ref = this.firestore.collection("BlogNames");
					
					let query = ref.where("name", "==" , blogName);
					
					query.get().then((snapshot)=>{
						snapshot.forEach((snap)=>{
							
							//push blog data to blog array
							blogArray.push(snap.data());
							
						})

						//save blog array to state
						this.setState({
							followedBlogs:blogArray
						})
						
					})
				})
			})
		}else{

			this.signInMessage = <p className="text-center">Please <Link to="/Signin">sign in</Link> to see your followed blogs</p>
		}
		
		//plus show latest listed blogs underneath
		this._gatherLatestBlogs();
  
	}

	_gatherLatestBlogs(){

		//set initial variables / array
		this.items = [];
		this.counter = 0;
		
		//create ref to latest blogs using limit of desc creation date
		let ref = this.firestore.collection("BlogNames").orderBy("creationDate","desc").limit(this.showLimit);
		
		ref.get().then((snapshot)=>{

			//save reference to last downloaded snapshot
			this.lastVisible = snapshot.docs[snapshot.docs.length - 1];

			//for each returned blog push to array and increment counter
			snapshot.forEach((element)=> {
				this.items.push(element.data())
				this.counter++;
			});

			//save array to state
			this.setState({
	    		latestBlogs:this.items
	    	});
	    	
		})
	}

	_handleMoreButton(){

		//reset counter
		this.counter = 0;

		//get next lot of blogs using last downloaded snapshot as reference (112)
		let ref = this.firestore.collection("BlogNames").orderBy("creationDate","desc").startAfter(this.lastVisible).limit(this.showLimit);
		
		//get next lot of blogs
		ref.get().then((snapshot)=>{

			//save last downlaoded snapshot for use in next collcetion
			this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
			
			//push data to array
			snapshot.forEach((element)=> {
				this.items.push(element.data())
				this.counter++;
			});

			//save to state
			this.setState({
	    		latestBlogs:this.items
	    	});
		})

	}

	render(){

		let moreButton;

		//loop thorugh latest blogs to display
		let latestBlogs = this.state.latestBlogs.map((blog,index)=>{
			if(blog.user === this.userUID){
				return null
			}else{
				return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
			}
		})

		//loop through followedBlogs to display
		let followedBlogs = this.state.followedBlogs.map((blog,index)=>{

			return <BlogComp blogName={blog.name} type={blog.type} logo={blog.blogLogo} description={blog.description} blogUser={blog.user} key={index} />
		})

		
		if(this.counter === this.showLimit){
			moreButton = <button className="btn btn-primary" onClick={this._handleMoreButton.bind(this)}>Show more blogs</button>
		}

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="row">

						<div className="col-sm-3 text-center">
							
							<Link to="/FindBlog"><button type="button" className="btn btn-primarySmall extraMargin">Find a blog</button></Link><br />
							<Link to="/MyBlogs"><button type="button" className="btn btn-primarySmall extraMargin">Show my blogs</button></Link><br />
							
							
						</div>

						<div className="col-sm-9">
							<div className="box greyedContent">
								<h4 className="text-center">Followed blogs</h4>
								<div>
									
									{followedBlogs}
									{this.signInMessage}
								</div>
								
							</div>

							<div className="box greyedContent">
								<h4 className="text-center">Latest blogs</h4>
								<br />
								<div>
									
									{latestBlogs}
									
								</div>
								<div className="text-center">
									<p>{moreButton}</p>
								</div>
							</div>	
							
						</div>
						
					</div>
				</section>
			</div>
		)
	}

}