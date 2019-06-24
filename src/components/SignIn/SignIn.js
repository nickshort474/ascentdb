import React, {Component} from 'react';
import firebase from '@firebase/app';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';

import GoogleButtonMain from '../../assets/images/google/btn_google_signin_dark_normal_web.png';
import GoogleButtonFocus from '../../assets/images/google/btn_google_signin_dark_focus_web.png';
import GoogleButtonPressed from '../../assets/images/google/btn_google_signin_dark_pressed_web.png';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { withFirebase } from '../Firebase';
import {_disable, _enable} from '../../utils/DisableGreyOut';


import store from '../../redux/store';
import LocalStorage from '../../utils/LocalStorage';

import UsernameGenerator from 'username-generator';

const SignInPage = () => (
  	<div>
   
   		<SignInForm />
   
  	</div>
);

// create initial state const
const INITIAL_STATE = {
  	email: '',
  	password: '',
  	error: null,
};

class SignInFormBase extends Component{
	
	
	constructor(props) {
    	super(props);

    	//create initial state based on constants
    	this.state = { 
    		...INITIAL_STATE
    	};

    	this.cursorStyle = {
    		cursor: "pointer"
    	}

    	//get last viewed page from state ready for redirect after sign in
    	let storeState = store.getState();
    	
    	if(storeState.page !== ""){
    		this.prevPage = storeState.page;
    	}else{
    		this.prevPage = "/Home";
    	}

    	//set base firestore ref
    	this.firestore = firebase.firestore()
    	
  	}
	

	componentWillMount() {
		//scroll to top
		window.scrollTo(0, 0);
	}

	_onChange(e){
		//handle input 
    	this.setState({ 
    		[e.target.id]: e.target.value 
    	});

    	//remove error indicator on new data input
    	$(`#${e.target.id}`).removeClass('formError');
	
 	};

	_onSubmit(e){
    	e.preventDefault();

    	//disbale buttons
		_disable();

		//validate input
		let errors = this._validate();

		// if errors exist
		if(errors.length > 0){

			//create error comp
			let msgComp = errors.map((msg,index)=>{
				
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
			//get email and password from state
	    	const { email, password } = this.state;
	    	
	    	//sign in with email / password in firebase.js 
		    this.props.firebase.doSignInWithEmailAndPassword(email, password).then((authUser) => {
		       	
		       	//get returned user id from authUser
		       	let userUID = authUser.user.uid;
		       	
		       	//clear  state
		       	this.setState({ 
		       		...INITIAL_STATE 
		       	});
		       
		        //save reference to user in localStoarge to match google auth state
		        LocalStorage.saveState("user",userUID);
		        LocalStorage.saveState("token","password");

		       	//enable buttons
		       	_enable();

		       	//redirect back to previous page
		        this.props.history.push(this.prevPage);

		    }).catch(error => {
		    	//enable buttons on error
		    	_enable();

		    	//add error to state for display and clear other data
		        this.setState({
		        	error:error,
		        	password:"",
		        	errors:""
		        });

		    });
		}
	    
	};

  	

	_signInGoogle(e){
		
		// change google sisgn in button to indicate pressed
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonPressed);

		//sign in with google using function fom firebase.js
		this.props.firebase.doSignInWithGoogle().then((authUser) => {
			
			//get returned user id from authUser
			let userUID = authUser.user.uid;
			
			
			LocalStorage.saveState("user",userUID);
			LocalStorage.saveState("token",authUser.credential.accessToken)

			//handle first sign in
			this._handleFirstSignIn(userUID);

			

	    }).catch(error => {

	    	//save error to state for display
	        this.setState({ 
	        	error
	        });

	    });;
		
		
	}

	_handleFirstSignIn(userUID,callback){

		//connect to firestore user section
		let ref = this.firestore.collection("Users").doc(userUID);

		//get user data
		ref.get().then((snapshot)=>{

			// if user exists no need to do anything
			if(snapshot.exists){
				//redirect to previous page
				this.props.history.push(this.prevPage);
			}else{
				//else is new user so create a reference in Users collection with random username to start off;
				console.log("creating user");
				let username = UsernameGenerator.generateUsername('-');
				let now = Date.now();

				ref.set({
					userName:username
				})
				
				//create reference to username in usernames section for easy people search functionality  
				let ref2 = this.firestore.collection("Usernames").doc(username);
				let obj2 = {uid:userUID};
				ref2.set(obj2);
				
				//create reference to new user in People section 
				let ref3 = this.firestore.collection("People").doc(userUID);
				ref3.set({userName:username,uid:userUID,profileCreated:now}).then(()=>{
					//redirect back
					this.props.history.push(this.prevPage);
				})
			}
		})

	}




	_hoverGoogleButton(){
		//handle google button hover
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonFocus);
		
	}

	_googleButtonOut(){
		let googleButton = document.getElementById("googleButton");
		googleButton.setAttribute("src", GoogleButtonMain);

	}

	_validate(){
		
		//store error messages in array
		const errorMsgs = [];

		//validate input fields
		if (!this._isValidEmail()) {
		   errorMsgs.push("Please provide a valid email address");
		   $('#email').addClass('formError');
		}

		
		if (this.state.password.length <= 0) {
		   errorMsgs.push("Please provide a password");
		   $('#password').addClass('formError');
		}
		
		//return error array
  		return errorMsgs;
	}

	_isValidEmail(){
		//test for vlaid email format
		if( /(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email) ){
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
			            
			       		                    
			              
			               
			                	<div className="box registration-form  greyedContent">
			                    	<h3 className="text-center">Sign in</h3>
			                        <form onSubmit={this._onSubmit.bind(this)}>
			                        	<div className="form-group">
			                                <label htmlFor="login_email">Email</label>
			                                <input type="text" className="form-control" id="email" onChange={this._onChange.bind(this)} value={this.state.email} placeholder="Enter email" />
			                            </div>
			                            <div className="form-group">
			                                <label htmlFor="login_pass">Password</label>
			                                <input type="password" className="form-control" id="password"  onChange={this._onChange.bind(this)} value={this.state.password} placeholder="Password" />
			                            </div>
			                            <div className="text-center">
			                           		<button type="submit" className="btn btn-primary login-btn">Sign In</button>
			                           	 	<SignUpLink />
			                           	 	<br />
			                           	 	<br />
			                           	 	{this.state.errors}<br />
			                           	 	{this.state.error && <p>{this.state.error.message}</p>}
			                            </div>
			                            
			                           	
			                        </form>
			                    </div>

			                    
			                   
			                    
			            </div>
			            <div className="row">
			            	<div className="box text-center greyedContent">   
			                	<img src={GoogleButtonMain} style={this.cursorStyle} id="googleButton" onClick={this._signInGoogle.bind(this)} onMouseOver={this._hoverGoogleButton.bind(this)} onMouseOut={this._googleButtonOut.bind(this)} alt="Google sign in button"/>
			                </div>
			            </div>
			            <div className="row text-center">
			            	<PasswordForgetLink />    	
			            </div>  
			                
			                
			           
			        </section>
			    </div>
			   
			</div>
		)
	}

}

const SignInForm = withRouter(withFirebase(SignInFormBase));


export default SignInPage;