import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import BlogPostComp from './BlogPostComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class MyBlogPostList extends Component{
	
	constructor(){
		super();
		
		//set initial state
		this.state = {
			postArray:[]
		}
		
	}
	
	componentWillMount() {
		//scroll to top
		window.scrollTo(0, 0);

		//save reference to current page to store for later navigation
		store.dispatch({type:constants.SAVE_PREV_PAGE, prevPage:`/MyBlogPostList/${this.props.match.params.BlogUser}/${this.props.match.params.BlogName}`});
		
		//get blog post list
		this._getBlogInfo();
		    
	}



	_getBlogInfo(){
		
		//set initial referecne to firestore
		let firestore = firebase.firestore();
			
		//set reference to blog post list	
		let ref = firestore.collection("BlogPostList").doc(this.props.match.params.BlogUser).collection(this.props.match.params.BlogName);

		//create post array
		let postArray = [];

		ref.get().then((snapshot)=>{
		
			snapshot.forEach((element)=>{
				
				//push to post array
				postArray.push(element.data());

			})

			//set array to state
			this.setState({
				postArray:postArray
			});

		});


	}


	

	render(){

		//loop through post array to display
		let content = this.state.postArray.map((blog,index)=>{
			
			return <BlogPostComp postName={blog.postName} descr={blog.postIntro} blogName={this.props.match.params.BlogName} blogUser={this.props.match.params.BlogUser} imgData={blog.firstImage} date={blog.date} key={index} />
		})


		return(
			<div className="container">
				
				<section className="content-wrapper">
					<div className="row box greyedContent">
						
							
				   		<div className="col-xs-6">
				   			<Link to="/MyBlogs">&#60; Back</Link>
				   		</div>
				   		<div className="col-xs-6 text-right">
				   			<Link to={"/AddBlogPost/" + this.props.match.params.BlogName}><button type="button" className="btn btn-primarySmall">New Post</button></Link> 
				   		</div>
						    
					   
					</div>

					<div className="row box greyedContent">    
					    
							
						<div className="col-xs-12">
							
								<h3 className="text-center"> {this.props.match.params.BlogName}</h3>
								<div>
									{content}
								</div>
							
						</div>
					
					</div>
					
				</section>

			</div>


			
		)
	}
}