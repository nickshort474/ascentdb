import React, {Component} from 'react';
import { withRouter, Link} from 'react-router-dom';

import {withFirebase} from '../Firebase';
import firebase from '@firebase/app';
import $ from 'jquery';

import {_disable,_enable} from '../../utils/DisableGreyOut';


import LocalStorage from '../../utils/LocalStorage';


const SignUpPage = () => (
	<div>
		<SignUpForm />
	</div>
)

//create initial state const
const INITIAL_STATE = {
	regEmail:"",
	regUsername:"",
	regPassword1:"",
	regPassword2:"",
	error:null,
	termsClicked:false
}



class SignUpFormBase extends Component{
	
	constructor(props){
		super(props);

		//set initial state form constant
		this.state = {
			...INITIAL_STATE 
		};

		//set base firestore ref
		this.firestore = firebase.firestore();
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);

	}
	
	_handleInput(e){
		//handle input		
		this.setState({
			[e.target.id]:e.target.value
		})
		//remove error indicator on new input
		$(`#${e.target.id}`).removeClass('formError');
	}

	_handleTerms(){
		//handle terms and conditons click
		if(this.state.termsClicked){
			
			this.setState({
				termsClicked:false
			})
			//show error indicating terms and conditions need clicking
			$('#terms').addClass('formError');

		}else{

			this.setState({
				termsClicked:true
			})
			//remove error indicator once clicked
			$('#terms').removeClass('formError');
		}

		
	}



	_submitSignUp(e){
		e.preventDefault();

		//disable buttons
		_disable()
		
		//vlaidate input field
		let errorMsgs = this._validate(this.state.regEmail,this.state.regUsername,this.state.regPassword1,this.state.regPassword2);
		
		//if errors exist
		if(errorMsgs.length > 0){

			//create error msg comp
			let msgComp = errorMsgs.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>

			//assign error comp to state for display
			this.setState({
				errors:formattedComp
			})
			
			//enable buttons
			_enable();
		}else{
			
			//no errors so check database for existing usernames...
			this._checkForExistingUsername();
		}
		
		
		
		
	}

	_checkForExistingUsername(){
		
		// create ref to users section ion firestore
		let ref = this.firestore.collection('Users');

		//create query for specific username
		let query = ref.where("userName", "==",this.state.regUsername);
		
		let match = false;

		query.get().then((snapshot)=>{
			
			//loop snapshot
			snapshot.forEach((snap)=>{
				
				// if snap exists
				if(snap){
					//alert user
					alert(snap.data().userName + " already exists please try another user name");
					//set bool
					match = true;

					//enable buttons
					_enable();
				}
			})
		}).then(()=>{
			
			//if no match
			if(!match){

				//create user in firebase
				this._createUser();
				
			}
		})
	}

	_createUser(){
	
		// use firebase.js to create user with email and password in firebase
		this.props.firebase.doCreateUserWithEmailAndPassword(this.state.regEmail,this.state.regPassword1).then((authUser)=>{
			
			//get user id from returned authUser			
			let userUID = authUser.user.uid;

			//save user id to localstorage
			LocalStorage.saveState("user",userUID);
			
			//create user in firestore
			this._createUserInFirestore(userUID);


			
		}).catch((error)=>{
			//assign errors to state to display
			this.setState({
				error:error
			})
		})
		
	}

	_createUserInFirestore(userUID){
		
		//create ref to user in users section in firestore
		let ref = this.firestore.collection("Users").doc(userUID);
		
		//create user object
		let obj = {
			userName:this.state.regUsername,
			userEmail: this.state.regEmail,
			
		}

		//set objcet in firestore
		ref.set(obj).then(()=>{

			//create reference to username in usernames section for esy people search functionality  
			let ref2 = this.firestore.collection("Usernames").doc(this.state.regUsername);
			
			//create user object
			let obj2 = {
				uid:userUID
			};

			//set object
			ref2.set(obj2).then(()=>{
				
				//clear state and form
				this.setState({
					...INITIAL_STATE
				})
				
				//create ref to user in  People section
				let ref3 = this.firestore.collection("People").doc(userUID);
				let now = Date.now();

				//set user in Poeple section
				ref3.set({userName:this.state.regUsername, uid:userUID, profileCreated:now}).then(()=>{
					
					//redirect to home
					this.props.history.push('/Home');
				});

				
			})
			
		})
	}


	_validate(email, username, password1, password2){
		
		//store error messages in array
		const errorMsgs = [];

		//check for vlaid email format
		let isValidEmail = this._isValidEmail(email);
		 	
		
		//validate each input field
		if (!isValidEmail) {
		   errorMsgs.push("Please provide a valid email address");
		   $('#regEmail').addClass('formError');
		}

		if (username.length < 1) {
		   errorMsgs.push("Please provide a user name");
		    $('#regUsername').addClass('formError');
		}
		if (password1.length < 6) {
		   errorMsgs.push("Please provide a password of at least 6 characters in length");
		   $('#regPassword1').addClass('formError');
		}
		if (password2 !== password1) {
		   errorMsgs.push("Passwords don't match");
		   $('#regPassword2').addClass('formError');
		}
		if(!this.state.termsClicked){
			errorMsgs.push("Please agree to our terms and conditions");
		   	$('#terms').addClass('formError');
		}

		//return error array
  		return errorMsgs;
	}

	_isValidEmail(email){
		//validate email
		if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
			return true
		}else{
			$('#regEmail').removeClass('formError');
			return false
		}

	}


	render(){
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			            
			               
			                <div className="col-sm-12">
			                	<div className="box registration-form greyedContent">
			                    	<h3 className="text-center">Registration</h3>
			                        <p>Create your new account here. Already have an account with us or Google? Then you can <Link to="SignIn">sign in</Link> with your existing username and password.</p>
			                        
			                        <form onSubmit={this._submitSignUp.bind(this)}>
			                        	
			                            <div className="form-group">
			                                <label htmlFor="reg_email">Email address</label>
			                                <input type="email" className="form-control" id="regEmail" value={this.state.regEmail} placeholder="Enter email" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_username">Username</label>
			                                <input type="username" className="form-control" id="regUsername" value={this.state.regUsername} placeholder="Enter username" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_pass1">Password</label>
			                                <input type="password" className="form-control" id="regPassword1" value={this.state.regPassword1} placeholder="Password" onChange={this._handleInput.bind(this)}/>
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="reg_pass2">Password again</label>
			                                <input type="password" className="form-control" id="regPassword2" value={this.state.regPassword2} placeholder="Password" onChange={this._handleInput.bind(this)} />
			                            </div>
			                           
			                            <div className="text-center">
			                            	<p id="terms"><input type="checkbox"  onClick={this._handleTerms.bind(this)} /> I agree to the <Link to="/Terms">Terms and Conditions</Link> and <Link to="/Privacy">Privacy Policy</Link></p>
			                            	<button type="submit" className="btn btn-primary">Submit</button>
			                            	 {this.state.errors}
			                            </div>
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

const SignUpLink = () => (
	
	<Link to={"/SignUp"}><button className="btn btn-primary">Sign Up</button></Link>
	
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink};