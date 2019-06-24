import React, {Component} from 'react';
import store from '../../redux/store';
import {withRouter} from 'react-router';
import LocalStorage from '../../utils/LocalStorage';
import $ from 'jquery';

class Contact extends Component{
	
	constructor(){
		super();

		//gather page visited from state
		this.prevPageVisited = store.getState().page
		
		//if user is signed in get their uid to submit with form
		this.userUID = LocalStorage.loadState('user');

		this.state = {
			errors:[],
			name:"",
			message:"",
			email:""
		}
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	_onChange(e){

		//set value of input field
		this.setState({
			[e.target.name]:e.target.value
		})

		// remove error signal if new data is being entered
		$(`#${e.target.id}`).removeClass('formError');
	}

	_onSubmit(){

		// validate input fields
		let errorMsgs = this._validate();
		
		//test errorMsgs for errors
		if(errorMsgs.length > 0){
			
			// create msgComp for displaying of error messages
			let msgComp = errorMsgs.map((msg,index)=>{
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})

			let formattedComp = <div className="box">{msgComp}</div>
			
			this.setState({
				errors:formattedComp
			})
		
		}else{
			//if no errors submit form
			var submit = $("#submit");
	    	submit.click();

			let form = document.getElementById("form");
			form.addEventListener("submit",(e) => {
				// redirect to response page				
				this.props.history.push('/Response');
			
			});
		}
	}

	_validate(){
		//get values from input fields
		let name = $('#name').val();
		let report = $('#report').val();
		let email = $('#email').val();
		
		//store error messages in array
		const errorMsgs = [];

		//test each input field
		if (name.length < 1) {
		   errorMsgs.push("Please provide a name");
		   $('#name').addClass('formError');
		}

		
		if (report.length < 1) {
		   errorMsgs.push("Please provide a report");
		   $('#report').addClass('formError');
		}

		if(!this._isValidEmail(email)){
			errorMsgs.push("Please provide a valid email");
		    $('#email').addClass('formError');
		}
	
  		return errorMsgs;
	}

	_isValidEmail(email){
		//test for valid email
		// eslint-disable-next-line
		if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) ){
			return true
		}else{
			$('#email').removeClass('formError');
			return false
		}

	}

	
	
	render(){
		return(
			<div>
				<div className="container"> 
					<div className="content-wrapper">
						<div className="box greyedContent">
						<h3>Contact Us</h3>
						
						<div>
							<p>Please complete this enquiry form</p>
							<p>All the fields marked with an asterisk (*) are mandatory.</p>
						</div>
					
						
						<form method="POST" id="form" action="contact_email.php" >
							<div className="form-group">
							      <label htmlFor="name">* First Name:</label>
							      <input type="text" className="form-control" value={this.state.name} onChange={this._onChange.bind(this)} id="name" name="name" />
							</div>
							<div className="form-group">
							    <label htmlFor="message">* Enquiry:</label>
							    <textarea className="form-control" value={this.state.message} onChange={this._onChange.bind(this)} id="message" name="message" rows="3"></textarea>
							</div>
							
							<div className="form-group">
							    <label htmlFor="email">* Email address:</label>
							    <input type="email" className="form-control" value={this.state.email} onChange={this._onChange.bind(this)} id="email" name="email" placeholder="name@example.com" />
							</div>
							
							<input type="hidden" className="form-control" id="uid" name="uid" value={this.userUID}/>
							<input type="hidden" className="form-control" id="page" name="page" value={this.prevPageVisited}/>
							<input type="submit"  id="submit" style={{display:"none"}}  />

							
							
						</form>
						<button className="btn btn-primary" onClick={this._onSubmit.bind(this)}>
							<i className="fa fa-paper-plane"></i>&nbsp;Send
						</button>
						{this.state.errors}
						</div>
					</div>
				</div>
			</div>

		)
	}
}
export default withRouter(Contact);
		