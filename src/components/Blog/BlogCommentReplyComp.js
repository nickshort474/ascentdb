import React, {Component} from 'react';
import ProcessDaysAgo from '../../utils/ProcessDaysAgo';

export default class BlogCommentReplyComp extends Component{
	

	render(){

		return (
			<div className="row">
				<div className="col-xs-1">

				</div>
				
				<div className="col-xs-11">
					
					<div className="row text-10">
						
						{this.props.username} - <ProcessDaysAgo date={this.props.time} />

						
					</div>
					<div className="row">
						{this.props.text}
					</div>
					<br />
					
				</div>
			</div>
			
		)
	}
} 