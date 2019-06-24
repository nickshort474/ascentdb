import React, {Component} from 'react';


export default class TextArea extends Component{
	
	render(){

		const style = {
			width:"100%"
		}

		return(

			<div>
				<textarea style={style} rows={this.props.rows} id={this.props.id}  ref="textInput"></textarea> <br />
	        </div>

		)
	}

}