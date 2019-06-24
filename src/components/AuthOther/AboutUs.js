import React, {Component} from 'react';
import {Link} from 'react-router-dom';
export default class AboutUs extends Component{
	

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box greyedContent">
						<h3 className="text-center">About us</h3>
						<br />
						<p>
							Hi I'm Nick and I created CombatDB.
						</p>

						<p>	This site was born from a conversation I had with a friend at work one day. We had both previously practised a martial art but lost touch with our training and were discussing what we could do. 
						We discussed our reasons for doing martial arts and  why we liked the clubs we had previously trained at. From this CombatDB was created!
						</p>	
						<p>	The best choice of club (for us at least) was based on the people at the club and the general feel of the environment within it.
						 The person teaching the art along with the other students practising it have an incredible affect on  whether an individual takes to the training. 
						 Something too traditional with thoughts of Zen or Chi would put some people off while others would thrive and relish a classical type teaching and environment. 
						 Some clubs are all about hardcore training, pushing your limits, and building the best version of yourself, which is perfect and even life changing for some but for others, maybe not. 
						 The people and the general environment of a club affect how successful your training would be when you choose a club.
						</p>

						<p>	I would have liked to  search a directory of clubs, see what was on offer, see the kind of people and environment I would be getting myself into, maybe even connect with some of the students somehow, see their reason for training and whether that would be the correct environment for me.	
						  As far as I could tell there was no official martial arts community - I always thought of martial arts as being its own little world, a world that allows you to connect with others who share the passion and instantly have common ground.
						   Maybe, just maybe, CombatDB could help connect us all, or at least some of us? If you have any ideas on features, or any input that you think might help us to grow the martial arts community then please get in contact so we can build a better, more connected community for us all.</p>
						<br />
						<div className="text-center">
							<Link to="/Contact">Contact us</Link>
						</div>

					</div>
				</div>
			</div>
		)
	}
} 