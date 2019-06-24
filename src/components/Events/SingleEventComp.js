import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import ProcessEpochDisplay from '../../utils/ProcessEpochDisplay';
import defaultLogo from '../../assets/images/default.jpg';

export default class SingleEventComp extends Component{
	


	render(){
		return(
			<div className="well">
				<div className="row">
					<Link to={"/SingleEvent/" + this.props.id}>
						

							<article className="post">
							

								<div className="col-sm-8 msgCompStyle">
									<div className="row">
										<div className="col-xs-7">
											<h3>{this.props.name}</h3>
										</div>
										<div className="col-xs-5">
											<ProcessEpochDisplay date={this.props.date} hoursWanted={true} />
										</div>
									</div>
									<p>{this.props.description}</p>
									<p>{this.props.location}</p>

								</div>

								<div className="col-sm-4 text-center">
									<div className="row">
										<div className="col-sm-12">
											<img src={this.props.logo  ? this.props.logo : defaultLogo} className="imageFit"  alt="Event logo" /><br />
										</div>
										
										
									</div>
							
									
								</div>

							</article>
						
					</Link>
				</div>
			</div>
		)
	}
}