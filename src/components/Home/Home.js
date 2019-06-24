import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import store from '../../redux/store';
import constants from '../../redux/constants';

import imgSrc from '../../assets/images/background/background-3.jpg';
import LocalStorage from '../../utils/LocalStorage';


export default class Home extends Component{
	

	constructor(){
		super();

		//save reference to page in store
		store.dispatch({type:constants.SAVE_PAGE, page:"Home"});
		
		//get user from localstorage to see if signed in
		this.userUID = LocalStorage.loadState("user");
		
	}

	componentWillMount(){
		//scroll to top
		window.scrollTo(0, 0);
	}
	

	
	render(){

		let uploadButton;

		//if useruid exists user is signed in so show button for uploading of images for use in home page
		if(this.userUID){
			uploadButton = <div><p className="text-10">Upload your image for a chance to see it on the combatdb homepage...<Link to="/HomeImageUpload"> click here</Link></p></div>
		}

		return(
			
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			        		

			        		<div className="col-xs-12 col-sm-5">
			        			<div className="box greyedContent">
	        						<div className="txtCompStyle">
										<Link to="/Community">Community</Link><p className="text-10">Make connections, send messages, build your community</p> 
			        				</div>
			        				<div className="txtCompStyle">
										<Link to="/Business">Business Listings</Link><p className="text-10">Clubs, shops and other businesses</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/Events">Events</Link><p className="text-10">Event listings</p> 
			        				</div>
			        				<div className="txtCompStyle">
										<Link to="/Styles">Styles</Link><p className="text-10">Database of styles</p> 	
			        				</div>
			        				{/*<div className="txtCompStyle">
										<Link to="/ViewBlogs">Blogs</Link><p className="text-10">Share your views, opinions and thoughts</p> 
			        				</div>*/}
			        				<div className="txtCompStyle">
			        					<Link to="/Profile">Profile</Link><p className="text-10">Check your profile, update and add more details</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/Contact">Contact</Link><p className="text-10">Get in contact, problems, issues or suggestions</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/AboutUs">About Us</Link><p className="text-10">Our team</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/Privacy">Privacy Policy</Link><p className="text-10">Your rights</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/Terms">Terms and conditions</Link><p className="text-10">Out terms</p> 
			        				</div>
			        				<div className="txtCompStyle">
			        					<Link to="/ReportContent">Report</Link><p className="text-10">Report offensive or inappropraite content</p> 
			        				</div>
		        				</div>

			        		</div>
			        		<div className="col-xs-12 col-sm-7">
			        			<div className="box greyedContent">	
				        			<p>Climb the World is aiming to be the number one resource for all climbers, be they boulders, sport climbers, or alpinists all over the world.</p>
				        			<p>Our mission to build a community driven resource with a range a growing features, to help support and connect all climbers all over the world while focussing on privacy, ethicasy and community.</p> 
				        			
			        			</div>
			        			<div className="box text-center greyedContent">	
				        			<img src={imgSrc} style={{"width":"100%"}} alt="This weeks!" />
				        			{uploadButton}
			        			</div>
			        		</div>
			        	</div>

		        		
			        </section>
			    </div>
			

		)
	}
}