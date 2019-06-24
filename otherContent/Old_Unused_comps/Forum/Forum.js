import React, {Component} from 'react';
import {firebase} from '@firebase/app';
import {Link} from 'react-router-dom';

export default class Forum extends Component{
	
	constructor(){
		super();

	}
	 
	componentWillMount(){
		window.scrollTo(0, 0);
		// gather cats from ForumCategories 
		//create component to represent each cat
		// pass params over to ForumList

	}


	render(){
		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="box">
			                		                
			                <h2>Categories</h2>
			                <div className="table-responsive">
			                    <table className="table table-bordered forum-wrapper">
			                        <thead>
			                            <tr>
			                                <th></th>
			                                <th>Forum</th>
			                                <th>Threads</th>
			                                <th>Posts</th>
			                                <th>Last Post</th>
			                            </tr>
			                        </thead>
			                        <tbody>
			                            
			                            {/* FORUM - START */}
			                            <tr>
			                                <td className="forum-icon"><img src="assets/icons/dota2.png" alt="" /></td>
			                                <td><Link to="ForumList/Styles">Styles</Link></td>
			                                <td>482</td>
			                                <td>21235</td>
			                                <td>
			                                    <a href="forum-single.html">ESL 2015</a>
			                                    <p className="post-detail">by: <a href="profile.html">Sifu Brian</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* FORUM - END */}

			                             {/* FORUM - START */}
			                            <tr>
			                                <td className="forum-icon"><img src="assets/icons/csgo.jpg" alt="" /></td>
			                                <td><Link to="ForumList/Training">Training</Link></td>
			                                <td>482</td>
			                                <td>21235</td>
			                                <td>
			                                    <a href="forum-single.html">ESL 2015</a>
			                                    <p className="post-detail">by: <a href="profile.html">Master Paul</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* FORUM - END */}

			                            {/* FORUM - START */}
			                            <tr>
			                                <td className="forum-icon"><img src="assets/icons/csgo.jpg" alt="" /></td>
			                                <td><Link to="ForumList/Events">Events</Link></td>
			                                <td>482</td>
			                                <td>21235</td>
			                                <td>
			                                    <a href="forum-single.html">ESL 2015</a>
			                                    <p className="post-detail">by: <a href="profile.html">Master Paul</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* FORUM - END */}

			                            {/* FORUM - START */}
			                            <tr>
			                                <td className="forum-icon"><img src="assets/icons/csgo.jpg" alt="" /></td>
			                                <td><Link to="ForumList/Clubs">Clubs</Link></td>
			                                <td>482</td>
			                                <td>21235</td>
			                                <td>
			                                    <a href="forum-single.html">ESL 2015</a>
			                                    <p className="post-detail">by: <a href="profile.html">Master Paul</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* FORUM - END */}

			                            {/* FORUM - START */}
			                            <tr>
			                                <td className="forum-icon"><img src="assets/icons/csgo.jpg" alt="" /></td>
			                                <td><Link to="ForumList/People">People</Link></td>
			                                <td>482</td>
			                                <td>21235</td>
			                                <td>
			                                    <a href="forum-single.html">ESL 2015</a>
			                                    <p className="post-detail">by: <a href="profile.html">Master Paul</a></p>
			                                    <p className="post-detail">18/10/2014 12:45</p>
			                                </td>
			                            </tr>
			                            {/* FORUM - END */}

			                           
			                        </tbody>
			                    </table>
			                </div>
			                
			            </div>
			        </section>
			    </div>
			</div>

		)
	}
}