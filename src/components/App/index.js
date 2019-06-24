import React, {Component} from 'react';
import {HashRouter as Router,Route} from 'react-router-dom';


import Navigation from '../Navigation/Navigation';
import HomePage from '../Home/Home';
import Footer from '../Footer';
import HomeImageUpload from '../Home/HomeImageUpload';

//Business listing files
import Business from '../Business/Business';
import AddBusiness from '../Business/AddBusiness';
import FindBusiness from '../Business/FindBusiness';
import SingleBusinessPage from '../Business/SingleBusinessPage';
import ReviewPage from '../Business/ReviewPage';
import EditBusiness from '../Business/EditBusiness';
/*import AddBusinessImages from '../Business/AddBusinessImages';*/
import EditBusinessLogo from '../Business/EditBusinessLogo';

//Community files
import Community from '../Community/Community';
import PersonProfile from '../Community/PersonProfile';
import ContactRequest from '../Community/ContactRequest';
import SearchForPeople from '../Community/SearchForPeople';


import Messages from '../Messages/Messages';
import NewMessage from '../Messages/NewMessage';

//events files
import EventsPage from '../Events/EventsPage';
import FindEvents from '../Events/FindEvents';
import AddEvents from '../Events/AddEvents';
import SingleEventPage from '../Events/SingleEventPage';
import EditEvent from '../Events/EditEvent';
import EditEventLogo from '../Events/EditEventLogo';

//styles files
import Styles from '../Styles/Styles';
import AddStyle from '../Styles/AddStyle';
import EditStyle from '../Styles/EditStyle';
import EditHistory from '../Styles/EditHistory';
import Report from '../Styles/Report';


/*// Blog files 
import MyBlogs from '../Blog/MyBlogs';
import MyBlogPostList from '../Blog/MyBlogPostList';

import ViewBlogs from '../Blog/ViewBlogs';
import BlogPostList from '../Blog/BlogPostList';

import FindBlog from '../Blog/FindBlog';
import SearchedBlogs from '../Blog/SearchedBlogs';
import SearchedBlogPostList from '../Blog/SearchedBlogPostList';

import SingleBlogPost from '../Blog/SingleBlogPost';

import AddBlog from '../Blog/AddBlog';
import AddBlogPost from '../Blog/AddBlogPost';*/



import ThankYouForListing from '../ThankYou/ThankYouForListing';


//authorisation, profile, contact, other
import Contact from '../AuthOther/Contact';
import ReportContent from '../AuthOther/ReportContent';
import Response from '../AuthOther/Response';
import Privacy from '../AuthOther/Privacy';
import AboutUs from '../AuthOther/AboutUs';
import Terms from '../AuthOther/Terms';

import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import PasswordForgetPage from '../PasswordForget/PasswordForget';


import Profile from '../Profile/Profile';
import ProfilePic from '../Profile/ProfilePic';
import Username from '../Profile/Username';
import DeleteAccount from '../DeleteAccount/DeleteAccount';
import ChangePassword from '../PasswordChange/PasswordChangeForm';


import {withAuthentication} from '../Session';



class App extends Component{

	
	render(){
		return(
			<Router>
				 	<div>
					 	<Navigation />

					 	
					 	<Route exact path={"/"} component={HomePage} />
					 	<Route path={"/Home"} component={HomePage} />
				     	<Route path={"/HomeImageUpload"} component={HomeImageUpload} />

				      	<Route path={"/ForgotPassword"} component={PasswordForgetPage} />
				      	
						<Route path='/Business' component={Business} />
						<Route path="/SingleBusiness/:BusinessKey" component={SingleBusinessPage} />	
						<Route path="/AddBusiness" component={AddBusiness} />
						<Route path="/FindBusiness" component={FindBusiness} />
						<Route path="/Review/:BusinessKey" component={ReviewPage} />
						<Route path="/EditBusiness/:BusinessKey" component={EditBusiness} />
						{/*<Route path="/AddBusinessImages/:BusinessKey" component={AddBusinessImages} />*/}
						<Route path="/EditBusinessLogo/:BusinessKey" component={EditBusinessLogo} />

						<Route path="/ThankYouForListing" component={ThankYouForListing} />

						<Route path="/Community" component={Community} />
						<Route path="/PersonProfile/:PersonKey" component={PersonProfile} />
						<Route path="/ContactRequest/:PersonKey" component={ContactRequest} />
						<Route path="/SearchForPeople" component={SearchForPeople} />
					
						<Route path="/Messages/:PersonUsername/:PersonKey" component={Messages} />
						<Route path="/NewMessage/:Username/:UserUID" component={NewMessage} />

						<Route path="/Events" component={EventsPage} />
						<Route path="/SingleEvent/:EventKey" component={SingleEventPage} />
						<Route path="/FindEvents" component={FindEvents} />
						<Route path="/AddEvents" component={AddEvents} />
						<Route path="/EditEvent/:EventKey" component={EditEvent} />
						<Route path="/EditEventLogo/:EventKey" component={EditEventLogo} />

						<Route path="/Styles" component={Styles} />
						<Route path="/AddStyle" component={AddStyle} />
						<Route path="/EditStyle/:Category/:Style" component={EditStyle} />
						<Route path="/EditHistory/:HistoryKey" component={EditHistory} />
						<Route path="/Report/:ItemName" component={Report} />
						
					{/*	<Route path="/MyBlogs" component={MyBlogs} />
						<Route path="/MyBlogPostList/:BlogUser/:BlogName" component={MyBlogPostList} />
						<Route path="/ViewBlogs" component={ViewBlogs} />
						<Route path="/BlogPostList/:BlogUser/:BlogName" component={BlogPostList} />
						<Route path="/FindBlog" component={FindBlog} />
						<Route path="/SearchedBlogs/:SearchTerm" component={SearchedBlogs} />
						<Route path="/SearchedBlogPostList/:BlogUser/:BlogName/:SearchTerm" component={SearchedBlogPostList} />
						<Route path="/SingleBlogPost/:BlogUser/:BlogName/:PostKey" component={SingleBlogPost} />
						<Route path="/AddBlog" component={AddBlog} />
						<Route path="/AddBlogPost/:BlogName" component={AddBlogPost} />*/}
						

						<Route path="/Contact" component={Contact} />
						<Route path="/ReportContent" component={ReportContent} />
						<Route path="/Response" component={Response} />
						<Route path="/Privacy" component={Privacy} />
						<Route path="/AboutUs" component={AboutUs} />
						<Route path="/Terms" component={Terms} />

						<Route path="/Profile" component={Profile} />
						<Route path="/ProfilePic/:UserRef" component={ProfilePic} />
						<Route path="/Username" component={Username} />
						<Route path="/DeleteAccount" component={DeleteAccount} />
						<Route path="/ChangePassword" component={ChangePassword} />
						

						<Route path="/SignUp" component={SignUpPage} />
						<Route path="/Signin" component={SignInPage} />
						<Footer />
					</div>		
			 	</Router>
		)
	}
	
}

export default withAuthentication(App);