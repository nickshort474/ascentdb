import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '@firebase/app';
import defaultLogo from '../../assets/images/default.jpg';
import LocalStorage from '../../utils/LocalStorage';

export default class BlogComp extends Component{
	
	componentWillMount(){
		
		//set initial state
		this.setState({
			username:""
		})
		//get user id from localstorage
		this.userUID = LocalStorage.loadState("user");

		//set reference to firestore
		this.firestore = firebase.firestore();
		
		//set reference to Users section
		let ref = this.firestore.collection("Users").doc(this.props.blogUser);
		
		//get username from firestore
		ref.get().then((snapshot)=>{
			this.setState({
				username:snapshot.data().userName
			})
		})
		
	}

	render(){


		return(
			<div className="well">

				<div className="row">
					<Link to={"/BlogPostList/" + this.props.blogUser + "/" + this.props.blogName}>
						<div className="col-sm-8 compTextStyle">
							<h3>{this.props.blogName}</h3>
							<p>{this.props.description}</p>
							<br />
							<p className="text-10"> {this.userUID === this.props.blogUser ? <span>Your blog</span> : <span>{this.state.username}</span>}</p> 
						</div>
						<div className="col-sm-4">
							<img src={this.props.logo ? this.props.logo : defaultLogo} className="thumbnail" alt="Blog logo" width="100%" />
						</div>
						
					</Link>
				</div>

			</div>

		)
	}
}