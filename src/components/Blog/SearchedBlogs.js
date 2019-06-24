import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';
import SearchedBlogComp from './SearchedBlogComp';

import store from '../../redux/store';
import constants from '../../redux/constants';

export default class Searchedlogs extends Component{
	
	
	constructor(){
		super();

		//set initial state
		this.state = {
			items:[]
		}

	}
		
	componentWillMount() {

		//scroll to top
		window.scrollTo(0, 0);

		//save current page to store
		let pageToSave = "/SearchedBlogs/" + this.props.match.params.SearchTerm;
		store.dispatch({type:constants.SAVE_PAGE, page:pageToSave});
		
		//get state from store
		let storeState = store.getState();

		//get blogObj from store (created in FindBlogs)
		let blogs = storeState.blogObj;
		
		//set search term to state
		this.setState({
			value:this.props.match.params.SearchTerm
		});	

		//create empty array
		this.items = [];
		
		//for each found blog in blog object
		blogs.forEach((blog) =>{
				
			//connect to BlogNames in firestore and gather info
			let firestore = firebase.firestore();
			
			let ref = firestore.collection("BlogNames").doc(blog);
			
			ref.get().then((snapshot)=>{
				
				//push blog data to array
				this.items.push(snapshot.data());

				//set array to state
				this.setState({
					items:this.items
				});	
			})
			
			
    	})
    
			

	    
	}

	render(){

		//display searched blogs 
		let blogs = this.state.items.map((blog)=>{
			return <SearchedBlogComp  type={blog.type} blogName={blog.name} description={blog.description} blogUser={blog.user} blogLogo={blog.blogLogo} searchTerm={this.props.match.params.SearchTerm} key={blog.name} />
		})

		return(
			
			<div className="container">
			 	<section className="content-wrapper">
					<div className="box">
					   		<Link to="/FindBlog">&#60; Back</Link>
					    </div>

					<div className="row">

						
						<div className="col-xs-12">
							<div className="box">
								<h3 className="text-center">Search results : {this.state.value}</h3>
								
								<div>
									
									{blogs}

								</div>
							</div>	
						</div>
						
					</div>
				</section>
			</div>
		)
	}

}