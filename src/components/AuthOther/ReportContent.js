import React, {Component} from 'react';
import store from '../../redux/store';
import {withRouter} from 'react-router';
import LocalStorage from '../../utils/LocalStorage';

import $ from 'jquery';

class ReportContent extends Component{
	
	constructor(){
		super();

		//gather page visited from store
		this.prevPageVisited = store.getState().page
		
		
		
		//if user is signed in get their uid to submit with form
		this.userUID = LocalStorage.loadState('user');
		
		//set initial state
		this.state = {
			errors:[],
			name:"",
			report:"",
			email:""
		}
	}
	componentWillMount(){
		//scroll window back to top
		window.scrollTo(0, 0);
	}

	

	_onChange(e){

		//set value for input fields
		this.setState({
			[e.target.name]:e.target.value
		})
		//remove error indocator for input field if new data entered
		$(`#${e.target.id}`).removeClass('formError');
	}

	_onSubmit(){

		//catch errors from validate function
		let errorMsgs = this._validate();
		
		//test for errors
		if(errorMsgs.length > 0){
			//create msgComp from errors
			let msgComp = errorMsgs.map((msg,index)=>{
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})

			let formattedComp = <div className="box">{msgComp}</div>
			
			this.setState({
				errors:formattedComp
			})
		
		}else{

			//submit form if no errors
			var submit = $("#submit");
	    	submit.click();

			let form = document.getElementById("form");
			form.addEventListener("submit",(e) => {
				//redirect to response page				
				this.props.history.push('/Response');
			
			});
		}
	}


	_validate(){
		
		//gather input field values
		let name = $('#name').val();
		let report = $('#report').val();
		let email = $('#email').val();
		
		//store error messages in array
		const errorMsgs = [];

		//test each field
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
							<h3>Report</h3>
							
							<div>
								<p>Please complete this report form and we will investigate the issue.</p>
								<p>All the fields marked with an asterisk (*) are mandatory. Please leave as much information about the issue as possible, if you click the report button at the bottom of the page which has the content needing review, a reference to the page will be sent with your report.</p>
							</div>
						
							<iframe name="votar" style={{display:"none"}} title="report form" ></iframe>

							<form method="POST" id="form" action="report_email.php" target="votar">
								<div className="form-group">
								      <label htmlFor="name">* First Name:</label>
								      <input type="text" className="form-control" value={this.state.name} onChange={this._onChange.bind(this)} id="name" name="name" />
								</div>
								<div className="form-group">
								    <label htmlFor="report">* Report:</label>
								    <textarea className="form-control" id="report" value={this.state.report} onChange={this._onChange.bind(this)} name="report" rows="3"></textarea>
								</div>
								<div className="form-group">
								    <label htmlFor="email">* Email address:</label>
								    <input type="email" className="form-control" id="email" value={this.state.email} onChange={this._onChange.bind(this)} name="email" placeholder="name@example.com" />
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
export default withRouter(ReportContent);
		