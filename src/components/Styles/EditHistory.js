import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

export default class EditHistory extends Component{
	
	constructor(){
		super();

		//set initial state
		this.state={
			items:[]
		}

	}

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);
		
		//set base firestore ref	
		let firestore = firebase.firestore();

		//set ref to changes to Styles in StyleHistory
		let ref = firestore.collection("StyleHistory").doc(this.props.match.params.HistoryKey).collection("changes");
		
		//create mepty array
		let items = [];

		//get style change history
		ref.get().then((snapshot)=>{
			
			//loop through snapshot
			snapshot.forEach((element)=>{
				//push to array
				items.push(element.data());
			})
			
			//save array to state for display
			this.setState({
				items:items
			})
		});

		
	}

	
	render(){

		//loop thorugh state and display
		let history = this.state.items.map((obj,index)=>{
			
			//process date time data
			let day =  new Date(obj.Date);
			let dayString = day.toString();
			let strLength = dayString.length;
			let cutDayString = dayString.substring(0,strLength - 31);

			//return comp
			return <div className="row" key={index}><p className="col-sm-4">{cutDayString}</p><p className="col-sm-4">{obj.Category}</p><p className="col-sm-4">{obj.EditorName}</p><hr /></div>
		})

		return(

			
				
			<div className="container">	
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Styles">&#60; Back</Link>
					</div>
					<div className="box">
						
						<h2>{this.props.match.params.HistoryKey}</h2>
						<div className="row">
							<h4 className="col-sm-4">Date changed</h4>
							<h4 className="col-sm-4">Category Altered</h4>
							<h4 className="col-sm-4">Edited By</h4>
							
						</div>
						<hr />
						{history}
					</div>
				</div>
			</div>
							

		)
	}
}