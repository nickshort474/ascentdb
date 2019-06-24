import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

export default class EditLink extends Component{
	
	
	render(){
		
		return(
				
			<div>	
			{/*Wiki edit button*/}
				<Link to={`/EditStyle/${this.props.data}/${this.props.style}`}>
					<i className="fa fa-edit" alt="edit history"></i>
				</Link>
			</div>
							

		)
	}
}