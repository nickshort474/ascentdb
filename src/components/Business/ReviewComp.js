import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class ReviewComp extends Component{
	
	_returnStars(){
		
		var reviewStars;

		//check props for star rating and assign glyphicons based on rating
		if(this.props.stars === "1"){
			reviewStars = 
			<div>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
			</div>
		}else if(this.props.stars === "2"){
			reviewStars = 
			<div>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
			</div>
		}else if(this.props.stars === "3"){
			reviewStars =
			<div>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
			</div>
		}else if(this.props.stars === "4"){
			reviewStars =
			<div>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
			</div>
		}else if(this.props.stars === "5"){
			reviewStars =
			<div>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
				<span className="glyphicon glyphicon-star" aria-hidden="true"></span>
			</div>
		}

		return reviewStars;
	}


	render(){
		
		
		let stars = this._returnStars()


		return(

			<div className="row">
				<div className="col-xs-12">
					<div className="box greyedContent">
						<h2>{this.props.title}</h2>
						<p>{this.props.body}</p>
						
						<div className="row">
							<div className="col-xs-6">{stars}</div>
							<div className="text-8 col-xs-6 verticalAlign leftAlign"><Link to={"/PersonProfile/" + this.props.userUID}>{this.props.user}</Link></div>
						</div>
						
					</div>
				</div>

			</div>

		)
	}
}