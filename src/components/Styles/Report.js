import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import LocalStorage from '../../utils/LocalStorage';

export default class Report extends Component{
	
	constructor(){
		super();

		//set initial state
		this.state = {
			report:"",
			category:"Date created"
		}

		//set base firestore ref
		this.firestore = firebase.firestore();

		//get user form state
		this.userUID = LocalStorage.loadState("user");
	}

	componentWillMount(){
		//scrolll to top
		window.scrollTo(0, 0);
		
	}

	_handleInput(e){

		//handle input
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	_onSubmit(e){
		
		//test report length
		if(this.state.report.length > 4){
		
			//set ref topreport section in firestore
			let ref = this.firestore.collection("ReportContent")

			let user;

			//test if user signed
			if(this.userUID){
				user = this.userUID
			}else{
				user = "anonymous";
			}

			//create report object
			let obj = {
				category:this.state.category,
				report:this.state.report,
				user:user
			}
			//add object to firestore
			ref.add(obj).then(()=>{

				//redirecet back to Styles
				this.props.history.push(`/Styles/${this.props.match.params.ItemName}`)
			})
		}else{
			alert("Please fill in both fields")
		}
		
		
	}
	
	render(){
		

		return(

			
				
			<div className="container">	
				<div className="content-wrapper">
					<div className="box">
						<Link to={`/Styles/${this.props.match.params.ItemName}`}>&#60; Back</Link>
					</div>
					<div className="box">
						
						<h2 className="text-center">Report issue with content:</h2>
						<form onSubmit={this._onSubmit.bind(this)}>
							<div className="row form-group">
								<div className="col-xs-4">
									<label htmlFor="cateogory">Category</label>
								</div>
								<div className="col-xs-8">
									<select id="category" className="form-control" onChange={this._handleInput.bind(this)} value={this.state.category}>
										<option value="Date created">Date created</option>
										<option value="Defining features">Defining features</option>
										<option value="Famous practitoners">Famous practitioners</option>
										<option value="Full description">Full description</option>
										<option value="History">History</option>
									</select>
								</div>
							</div>
							
							<div className="row form-group">
								<div className="col-xs-4">
									<label htmlFor="report">Report:</label>
								</div>
								<div className="col-xs-8">
									<textarea value={this.state.report} onChange={this._handleInput.bind(this)} className="form-control" id="report" />
								</div>
							</div>
							<div className="text-center">
								<input className="btn btn-primarySmall" type="submit" value="report" />
							</div>

						</form>
					</div>
				</div>
			</div>
							

		)
	}
}