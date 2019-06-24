import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import firebase from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';
import { withFirebase } from '../Firebase';
import store from '../../redux/store';
import constants from '../../redux/constants';

class DeleteAccount extends Component {
    
    constructor(props) {
        super(props);
        
        //set initial state
        this.state = {
            email:"",
            password:""
        }

        //set base ref for firestore
        this.firestore = firebase.firestore();

        //get user id and user token from localstorage
        this.userUID = LocalStorage.loadState("user");
        this.token  = LocalStorage.loadState("token");

    }


    _handleInput(e){

        //handle input for password account deletion
        this.setState({
            [e.target.id]:e.target.value
        })
    }


    _deletePasswordAccount(){

        //test for entry of data into password and email boxes
        if(this.state.password.length > 1 && this.state.email.length > 1){
            
            //send password and email to get google credentials 
            let credentials = this.props.firebase.doGetGoogleCredentials(this.state.email,this.state.password);
           
            //if credentials come back
            if(credentials){
                
                //re authenticate using checked credentials    
                this.props.firebase.doReauthenticatePassword(credentials).then((returned)=>{
                    
                    //delete user from firebase
                    this.props.firebase.doDeleteUser();

                    //delete user info from firestore
                    this._deleteUserInfo(returned.user.uid);
                    
                })
            }else{
                alert("your credential are wrong please try again");
            }
        }else{
            alert("please fill in email and password correctly")
        }

       
    }

    _deleteGoogleAccount(){
        
        //get user credentials using token        
        let credentials = this.props.firebase.doGetGoogleCredentials(this.token);
                
        if(credentials){
            
            //re authenticate using credentials
            this.props.firebase.doReauthenticateGoogle(credentials).then((returned)=>{
                
                //delete usr form firebase
                this.props.firebase.doDeleteUser();

                //delete user info  from firestore
                this._deleteUserInfo(returned.user.uid);
                
            })
        }else{
            alert("your credential are wrong please try again");
        }
      
    }

    _deleteUserInfo(uid){

        //delete session storage
        store.dispatch({type:constants.CLEAR_STORE});
        
        //delete local storage
        LocalStorage.saveState("user",null);
        LocalStorage.saveState("token",null);

        //add reference to deleted user to DeletedUIDs section for later possible clear up of business, events and blogs.
        let ref = this.firestore.collection("DeletedUIDs");
        ref.add({"uid":uid})

        //delete firebase storage
        this.firestore.collection("Users").doc(uid).delete();
        this.firestore.collection("People").doc(uid).delete();
        this.firestore.collection("PeopleImages").doc(uid).delete();
        this.firestore.collection("Messages").doc(uid).delete();

        //find user in username section and delete
        let ref2 = this.firestore.collection("Usernames");
        let query = ref2.where("uid", "==", uid);
        query.delete();
        
        // redirect back to home page
        this.props.history.push('/Home');
    }


    render(){

        let deleteRequest;

        
        if(this.token === "password"){
            deleteRequest =  <div>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input type="email" className="form-control" id="email" value={this.state.email} placeholder="Enter email" onChange={this._handleInput.bind(this)}/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" value={this.state.password} placeholder="Password" onChange={this._handleInput.bind(this)}/>
                                </div>
                                <button className="btn btn-primary" type="submit" onClick={this._deletePasswordAccount.bind(this)}>Delete Account</button>
                            </div>    
        }else{
            deleteRequest =  <button className="btn btn-primary" type="submit" onClick={this._deleteGoogleAccount.bind(this)}>Delete Account</button>
        }

        return (
            <div className="container">
                <div className="content-wrapper">
                    <div className="box">
                        <Link to="/Profile">&#60; Back</Link>
                    </div>
                    <div className="box text-center">
                        <h2>Delete Account</h2>
                        
                        <form>
                            <p>If you delete your account all your user information, profile information and your record of private messages will be deleted immediately.</p>
                            <p>Any other content uploaded will be saved but may be marked for later deletion.</p>
                            <p>BE AWARE - This is a permanent delete and is not recoverable</p>
                                                       
                            {deleteRequest}
                             
                           
                        </form>
                    </div>
                </div>
            </div>

           
        );
    }
}

export default withFirebase(DeleteAccount);