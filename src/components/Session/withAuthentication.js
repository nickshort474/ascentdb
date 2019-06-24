import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';


const withAuthentication = Component => {
  
  class WithAuthentication extends React.Component {

  	constructor(props) {
      super(props);

      //set state
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {

      //listen for auth state change and set state
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        },
      );
    }

    componentWillUnmount() {
      //clear listener
      this.listener();
    }

    render() {
      return (
        //pass state of auth down to consumers of AuthUserContext
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;