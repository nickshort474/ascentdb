import React, {Component} from 'react';
import {firebase} from '@firebase/app';

import {Link, withRouter} from 'react-router-dom';

import store from '../../redux/store';
import constants from '../../redux/constants';

import AutoSuggest from '../../utils/AutoSuggest'; 


class FindBlog extends Component{
		

	constructor(){
		super();

		//set initial state
		this.state = {
			value:"",
			suggestions:[]
		}

		//set intial reference to firestore
		this.firestore = firebase.firestore();

		//create keyword list array
		this.keyWordList = [];
	}

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);

		//clear searchTerm every time come to FindBlog page
		store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:undefined})
		
		// set reference to keywords in firestore
		let ref = this.firestore.collection("KeyWords").doc("KeyWordList").collection("list");
		
		//get keywords
		ref.get().then((snapshot)=>{
			
			snapshot.forEach((snap)=>{
				this.keyWordList.push(snap.data())
			})
			
			//set keywords to state
			this.setState({
				keyWordList:this.keyWordList
			})
						
		})

	}

	
	
	_submitForm(e){
		e.preventDefault();
		

		let blogObj= [];

		//get blog search term from store (added to store in AutoSuggest component)
		let storeState = store.getState();
		let searchTerm = storeState.blogSearchTerm;	
		

		// if searchTerm !exist then alert user
		if(searchTerm === undefined){
			alert("please select a keyword from the search list")
			
		}else{
			//lowercase searchterm
			let value = searchTerm.trim().toLowerCase();
	
			//get reference to blogs which have search term from KeyWords section of firestore
			let ref = this.firestore.collection("KeyWords").doc(value).collection("blogs");
			ref.get().then((snapshot)=>{
				
				snapshot.forEach((snap)=>{
					//add reference to each blog to blogObj 
					blogObj.push(snap.data().blogName);
						
				})

				//save blog object to store ready for display in SearchedBlogs component
				store.dispatch({type:constants.SAVE_BLOGS, blogObj:blogObj});

				//navigate to Searched blogs page ready to display blog object
				this.props.history.push("/SearchedBlogs/" + value);
			})
		}

		
	}


	

	render(){

		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">

			        	<div className="box">
					   		<Link to="/ViewBlogs">&#60; Back</Link>
					    </div>

		               	<div className="row">

	                		<div className="col-sm-3 hidden-xs">
		                		<div className="box sidebar-box">
					   
				                	<h2>Find A Blog</h2>
				                    
				                    
				                </div>
				            </div>

				            <div className="col-sm-9">
				            	<div className="box">        
				                    <form onSubmit={this._submitForm.bind(this)} >
				                    	
				                        <h2>Search:</h2>
				                        
									     <AutoSuggest list={this.state.keyWordList} page="searchForBlog" />

									     <hr />
				                        
				                     
				                       
				                        <button type="submit" className="btn btn-primary">Submit</button>
				                       
				                    </form>
				                </div>
				            </div>
		                </div>

		            </section>
		        </div>
                
			</div>

		)
	}

}
export default withRouter(FindBlog);