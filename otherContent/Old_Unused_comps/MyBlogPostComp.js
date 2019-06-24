import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ProcessEpoch  from '../../utils/ProcessEpoch';
import defaultLogo from '../../assets/images/default.jpg';

export default class MyBlogPostComp extends Component{
	
	constructor(){
		super();

		this.style = {
			height:"100%",
			width:"100%",
			display:"block"
		}
	}


	render(){


		return(
			<div className="well">

				<div className="row">
					<Link to={"/SingleBlogPost/" + this.props.owner + "/" + this.props.blogName + "/" + this.props.postName }>
						
						<article className="post">
							<div className="col-sm-2 compTextStyle">
							<ProcessEpoch date={this.props.date} />
							</div>
							<div className="col-sm-7 compTextStyle">
								<h2>{this.props.postName}</h2>
								<p>{this.props.descr}</p>
								
							</div>

							<div className="col-sm-3">
								<img id='base64image' src={this.props.imgData ? this.props.imgData : defaultLogo} style={this.style} alt="Post" />
							</div>
						</article>


					</Link>
				</div>

			</div>

			
		)
	}
}