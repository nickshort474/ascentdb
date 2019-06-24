import app from 'firebase/app';
import 'firebase/auth';

//setup config data
var config = {
    apiKey: "AIzaSyDtKSwem1qtmyT2MRfYEa-DDnpiWiKpqUA",
    authDomain: "climbdb-4004c.firebaseapp.com",
    databaseURL: "https://climbdb-4004c.firebaseio.com",
    projectId: "climbdb-4004c",
    storageBucket: "gs://climbdb-4004c.appspot.com",
    messagingSenderId: "982833965429",
    appId: "1:982833965429:web:4de986f6ce716d11"
};


class Firebase {

    constructor(){

        //initialize app
        app.initializeApp(config);

        //set auth
        this.auth = app.auth();
        
        //get google auth provide
        this.googleProvider = new app.auth.GoogleAuthProvider(); 
    }


    // set authorisation / authentication functions
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>  this.auth.currentUser.updatePassword(password);
    
    doSignInWithGoogle = () =>   this.auth.signInWithPopup(this.googleProvider);

    doDeleteAccount = () => this.auth.currentUser.delete(); 

    
    
    doGetGoogleCredentials = token => this.googleProvider.credential(null,token);

    doGetPasswordCredentials = (email,password) => this.auth.EmailAuthProvider.credential(email,password);

    doReauthenticatePassword = credentials => this.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials);

    doReauthenticateGoogle = credentials => this.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credentials);
        
    doDeleteUser = () =>  this.auth.currentUser.delete();
   


    
}



export default Firebase;







