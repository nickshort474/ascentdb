import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import {_disable,_enable} from '../../utils/DisableGreyOut';

import LocalStorage from '../../utils/LocalStorage';



class EditStyle extends Component{
	
	constructor(){
		super();
		
		//set initial state
		this.state = {
			content:"",
			newContent:"",
			buttonText:""
		}

		//set base ref to firestore
		this.firestore = firebase.firestore();

		//get user id form localstorage
		this.user = LocalStorage.loadState("user");

	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}

	componentDidMount(){
		
		//test whther user is signed in
		if(this.user){
			//create ref to this user section in firestore
			let ref = this.firestore.collection("Users").doc(this.user);

			//get users username
			ref.get().then((snapshot)=>{
				this.userName = snapshot.data().userName;
			})

			//get edit data
			this._gatherEditInfo();

			//enable savee changes button
			this.disabled = false;

			//change button to cancel changes
			this.setState({
				buttonText:"Cancel Changes"
			})
			

		}else{

			//if user ot signed in set state accordingly
			this.setState({
				content:"Please sign in",
				buttonText:"Go Back"
			})

			//disable save changes button
			this.disabled = true;
			
		}

	}


	_gatherEditInfo(){
		
		//set ref for this style in Styles section
		let ref = this.firestore.collection("Styles").doc(this.props.match.params.Style);

		//get style info
		ref.get().then((snapshot)=>{
			
			//save data for chosen category to state
			this.setState({
				content:snapshot.data()[this.props.match.params.Category]
			})
		})
		
	}

	_handleStyle(e){
		//handle input data
		this.setState({
			content:e.target.value
		})
	}



	_editStyle(e){

		//test whether content is minimum length 
		if(this.state.content > 4){
			
			//disable buttons
			_disable();
			
			//set ref to style in style section
			let ref = this.firestore.collection("Styles").doc(this.props.match.params.Style);

			//get category selected
			let category = this.props.match.params.Category;
			
			//process category string
			let newString = category.charAt(0) + category.slice(1);
			let withoutWhitespace = newString.replace(" ", "");
			
			//create category object and add content with category string
			let catObj = {};
			catObj[withoutWhitespace] = this.state.content;
			
			//update style
			ref.update(catObj);
			
			//add style cahnge to style history section		
			let ref2 = this.firestore.collection("StyleHistory").doc(this.props.match.params.Style).collection("changes");
			
			//create style change history object
			let obj = {
				Category:this.props.match.params.Category,
				Date:Date.now(),
				Editor:this.user,
				EditorName:this.userName
			}

			//add object to firestore
			ref2.add(obj).then(()=>{
				//enable buttons
				_enable()
				//redirect back to styles
				this.props.history.push('/Styles');
			});


		}else{
			alert("please add some information to the category")
		}
		
		

		
	}


	render(){
		let styles = {
			width:"100%"
		}

		return(
			<div className="container">
				<div className="content-wrapper">
					
					<div className="box">
						<Link to="/Styles">&lt; Go back</Link>
					</div>
					<div className="box">

						

						<div className="text-center">
							<h2>{this.props.match.params.Style}</h2>
							<h2>{this.props.match.params.Category}</h2>
						</div>

						<div className="text-center">
							<textarea id="style" onChange={this._handleStyle.bind(this)} value={this.state.content} style={styles} ></textarea>
						</div>

						
						
						<div className="text-center">
							<button className="btn-primary" disabled={this.disabled} onClick={this._editStyle.bind(this)}>Save Changes</button>
							
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default withRouter(EditStyle);