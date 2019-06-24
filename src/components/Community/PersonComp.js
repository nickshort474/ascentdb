import React, {Component} from 'react';
import {withRouter,Link} from 'react-router-dom';


class PersonComp extends Component{
	

	_seeMail(){
		// direct to messages page
		this.props.history.push(`/Messages/${this.props.userName}/${this.props.uid}`)
	}
	
	render(){
		
		return(
			<div className="row text-center personComp">
				<section className="col-xs-6 text-center">
					
						<Link to={`/PersonProfile/${this.props.uid}/${this.props.userName}`}>
							<h4>{this.props.userName} </h4>
						</Link>	
					
				</section>

				<section className="col-xs-6">

					<div>
						{this.props.haveReplied 
						? 
						<p>You have mail <button onClick={this._seeMail.bind(this)} className="btn btn-primary"><i className="fa fa-envelope"></i></button></p>
						
						:	
						<p>See your conversation:<button onClick={this._seeMail.bind(this)} className="btn btn-primary"><i className="fa fa-envelope-open"></i></button></p>
						}
							
					</div>
				</section>
			</div>
		)
	}
}

export default withRouter(PersonComp)