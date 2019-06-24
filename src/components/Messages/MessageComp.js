import React, {Component} from 'react';

import ProcessDaysAgo from '../../utils/ProcessDaysAgo';


export default class MessageComp extends Component{
	

	render(){
		
		let comp;

		if(this.props.ownMsg){
			comp =  <div className="row text-left contactMessages">
						<section className="col-xs-3">
							
						</section>
						<section className="well msgRightWell col-xs-9" style={{"backgroundColor":"#81ea81"}} >
							<div className="row msgCompStyle">
								<p>{this.props.contents}</p>
							</div>
							<div className="row text-right">
								<small className="text-muted"><ProcessDaysAgo date={this.props.date} /></small>
							</div>
						</section>
					</div>
		}else{
			comp =  <div className="row text-left contactMessages">
				
						<section className="well msgLeftWell col-xs-9" style={{"backgroundColor":"#DEDEDE"}} >
							<div className="row msgCompStyle">
								<p>{this.props.contents}</p>
							</div>
							<div className="row text-right">
								<small className="text-muted"><ProcessDaysAgo date={this.props.date} /></small>
							</div>
						</section>
						<section className="col-xs-3">
							
						</section>
					</div>
		}

		return(
			<div>
				{comp}
			</div>

		)
	}
}