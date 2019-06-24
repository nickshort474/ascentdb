import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import defaultLogo from '../../assets/images/default.jpg';

export default class MyBlogComp extends Component{
	

	render(){


		return(
			<div className="well">

				<div className="row">
					<Link to={"/MyBlogPostList/" + this.props.owner + "/" + this.props.name}>
						<div className="col-sm-8 compTextStyle">
							<h3>{this.props.name}</h3>
							<p>{this.props.description}</p>
						</div>
						<div className="col-sm-4">
							<img src={this.props.logo ? this.props.logo : defaultLogo} className="thumbnail" alt="Blog Logo" width="100%" />
						</div>
					</Link>
				</div>

			</div>

		)
	}
}