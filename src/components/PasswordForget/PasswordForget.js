import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';


const PasswordForgetPage = () => (
    <div>
        <PasswordForgetForm />
    </div>
);

//create initial state const
const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    
    constructor(props) {
        super(props);

        //set initial state from const
        this.state = {
            ...INITIAL_STATE 
        };

    }

    _onSubmit(e){
        e.preventDefault();
       
        //get user enterde email       
        let email = this.state.email;

        //call password reset from firebase.js
        this.props.firebase.doPasswordReset(email).then(() => {

            //set state back to initial values
            this.setState({
                ...INITIAL_STATE 
            });

            //show error display as success
            this.setState({
            	error:"Password reset email has been sent"
            })

        }).catch(error => {
            //show error display message
            this.setState({ error });

        });

      
    };

    _onChange(e){

        //handle input
        this.setState({ 
            [e.target.name]: e.target.value 
        });
    };


    render() {
        let { email, error } = this.state;

        let isInvalid = email === '';

        return (
            <div className="container">
                <div className="content-wrapper">
                    <div className="box text-center greyedContent">
                        <h2>Forgotten your password?</h2>
                        
                        <form onSubmit={this._onSubmit.bind(this)}>
                            <input name="email" value={this.state.email} onChange={this._onChange.bind(this)} type="text" placeholder="Email Address" /><br /><br />
                            <button disabled={isInvalid} className="btn btn-primary" type="submit">Send email reset</button>

                            {error && <p>{error.message}</p>}
                        </form>
                    </div>
                </div>
            </div>

           
        );
    }
}

const PasswordForgetLink = () => (
     
    <div className="box greyedContent">
        <Link to={'/ForgotPassword'}>Forgot Password?</Link>
    </div>
                
   
);

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export default PasswordForgetPage;
export { PasswordForgetLink };