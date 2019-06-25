import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut/SignOut';
import $ from 'jquery';



import { AuthUserContext } from '../Session';


//get authorised user and display appropriate components in navigation bar
const Navigation = () => (
 	<div>
    	<AuthUserContext.Consumer>
      		{authUser =>
       			 authUser ? <NavigationAuth /> : <NavigationNonAuth />
      		}

    	</AuthUserContext.Consumer>
  	</div>
);



const NavigationAuth = () => (
    <div>
      
        <Link to="/Profile" className="btn btn-primary"  data-target=".navbar-collapse">Profile</Link>
   
      	<SignOutButton />
    </div>
);

const NavigationNonAuth = () => (
	<div>
       
    	<Link to="/Signin" className="btn btn-primary"  data-target=".navbar-collapse">Sign In</Link>
 	
  	</div>
);



class HeaderNavigation extends Component{
	
	constructor(){
		super();
		//dismiss drop down menu on mobile screens
		$(document).on('click','.navbar-collapse.in',function(e) {
		    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
		        $(this).collapse('hide');
		    }
		});

		
	}




	render(){
		return(
			<div>
				<header className="navbar navbar-transparent navbar-fixed-top">
			    	<div className="container">
			    		<div className="Brand-header hidden-xs">
			            	AscentDB
			               
			            </div>
			            <div className="navbar-header">
			            	<Link to="/" className="navbar-brand visible-xs">AscentDB</Link>
			                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"  aria-expanded="false"><i className="fa fa-bars"></i></button>
			            </div>

			            <div className="collapse navbar-collapse" >
			            	<ul className="nav navbar-nav">
			                	
			                	<li><Link to="/" data-target=".navbar-collapse">Home</Link></li>
			                	<li><Link to="/Community" data-target=".navbar-collapse">Community</Link></li>
			                	<li><Link to="/Business" data-target=".navbar-collapse">Business</Link></li>
			                    <li><Link to="/Events" data-target=".navbar-collapse">Events</Link></li>
			                    <li><Link to="/Styles" data-target=".navbar-collapse">Lingo</Link></li>
								{/*<li><Link to="/ViewBlogs" data-target=".navbar-collapse">Blogs</Link></li>*/}
							
			                </ul>
			                <div className="pull-right navbar-buttons">
			                	
			                	
			                    <Navigation />
			                   
			                </div>
			            </div>
			        </div>
			    </header>
			   
			   <div className="container hidden-xs container-less-padding">
					<div className="header-title">
						
					</div>
			    			
			    </div>
		    </div>
		)
	}
	
}

export default HeaderNavigation;