import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import defaultLogo from '../../assets/images/default.jpg'

export default class BusinessComp extends Component{
	
	

	render(){


		return(
			<div className="well">
				<Link to={"/SingleBusiness/" + this.props.businessKey} >
					<div className="row">
						
						<div className="col-sm-8 compTextStyle">
							<h3>{this.props.businessName}</h3>
							<p>{this.props.summary}</p>	
							<p>{this.props.location}</p>
														
						</div>

						<div className="col-sm-4">
							
							
							<img src={this.props.businessLogo ? this.props.businessLogo : defaultLogo} className="img-thumbnail" width="200px" height="200px" alt="Business logo" />
							
						</div>
						
					
					</div>
				</Link>
			</div>

		)
	}
}