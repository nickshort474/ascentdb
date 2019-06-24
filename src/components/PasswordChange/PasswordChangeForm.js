import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { withFirebase } from '../Firebase';

//create initial state const
const INITIAL_STATE = {
	password1:"",
	password2:"",
	error:null
}

const PasswordChange = () => (
	<div>
		<PasswordChangeForm />
	</div>
)

class PasswordChangeFormBase extends Component{
	
	constructor(props){
		super(props);

		//set initial state from const
		this.state = {
			...INITIAL_STATE
		};
		
	}

	_onSubmit(e){
		e.preventDefault();

		//call firestore password credential function in firebase.js file
		let credentials = this.props.firebase.doGetPasswordCredentials(this.state.email, this.state.oldPassword);

		if(credentials){
            //re authenticate using password credentials 
            this.props.firebase.doReauthenticatePassword(credentials).then((returned)=>{
               
               //get entered pasword 
               let password1  = this.state.password1;
               
               //update password
               this.props.firebase.doPasswordUpdate(password1).then(()=>{
					
					//set state basck to initial values
					this.setState({
						...INITIAL_STATE
					})

				}).catch((error)=>{
					//catch error add to state for display
					this.setState({
						error:error
					})
				})
                
            })

        }else{
            alert("your credential are wrong please try again");
        }

	}

	_onChange(e){

		//handle password input
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	render(){

		//test for matching passwords to enable submit button
		const isInvalid = this.state.oldPassword !== "" || this.state.password1 !== this.state.password2 || this.state.password1 === '';

		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
					   	<Link to="/Profile">&#60; Back</Link>
					</div>
					<div className="box text-center">
						<form onSubmit={this._onSubmit.bind(this)}>
							<h4>Change password:</h4>
							<input type="email" placeholder="email" value={this.state.email} id="email" onChange={this._onChange.bind(this)} /><br /><br />
							<input type="password" placeholder="Old password" value={this.state.oldPassword} id="oldPassword" onChange={this._onChange.bind(this)} /><br /><br />
							<input type="password" placeholder="New password" value={this.state.password1} id="password1" onChange={this._onChange.bind(this)} /><br /><br />
							<input type="password" placeholder="Confirm new password" value={this.state.password2} id="password2" onChange={this._onChange.bind(this)} /><br /><br />
							<button disabled={isInvalid} className="btn btn-primary" type="submit">Change password</button>
							{this.state.error && <p>{this.state.error.message}</p>}
						</form>
					</div>
				</div>
			</div>
		)
	}
}



const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

export default PasswordChange;



