import React from 'react';
import {withRouter} from 'react-router-dom';

import AuthUserContext from './context';
import {withFirebase} from '../Firebase';

const withAuthorization = condition => Component =>{
	
	class withAuthorization extends React.Component {
		
		componentDidMount(){
			
			this.listener = this.props.firebase.auth.onAuthStateChanged((authUser)=>{
				if(!condition(authUser)){
					this.props.history.push('/Signin')
				}
			})
		}

		componentWillUnmount(){
			//clear listener
			this.listener();
		}

		render(){

			//higher order component for wrapping components in Consumer
			return(
				<AuthUserContext.Consumer>
					{authUser =>
						condition(authUser) ? <Component {...this.props} /> : null
					}
				</AuthUserContext.Consumer>
				
			)
		}

	}
	return withAuthorization;
};

export default withRouter(withFirebase(withAuthorization));