import React, {Component} from 'react';
import {Link} from 'react-router-dom';



export default class ThreadComp extends Component{
	

	constructor(){
		super();
		this.state = {
			items:[],
			linked:""
		}

	}
	
	componentDidMount() {
		this.setState({
			linked:`ForumSingle/${this.props.topicCat}/${this.props.topicId}`
		})
	}

	render(){
		return(
			
			<tr>
                <td className="forum-icon new"><i className="fa fa-comment"></i></td>
                <td>
                    <Link to={this.state.linked}>{this.props.topicSubject}</Link>
                    <p className="thread-autor"><a href="profile.html">{this.props.topicBy}</a></p>
                </td>
                <td>{this.props.topicReplies}</td>
                <td>521235</td>
                <td>
                    <p className="post-detail">by: <a href="profile.html">admin</a></p>
                    <p className="post-detail">{this.props.topicDate}</p>
                </td>
            </tr>
           
		)
	}
}