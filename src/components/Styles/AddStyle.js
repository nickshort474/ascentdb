import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';
import $ from 'jquery';
import {_enable,_disable} from '../../utils/DisableGreyOut';
import LocalStorage from '../../utils/LocalStorage';

export default class AddStyle extends Component{
	
	constructor(){
		super();

		//set initial state
		this.state = {
			styleName:"",
			countryOfOrigin:"",
			dateCreated:"",
			definingFeatures:"",
			famousPractioners:"",
			fullDescription:"",
			history:""
		}

		//get user id from local storage
		this.userUID = LocalStorage.loadState("user");
	}

	componentWillMount(){

		//scroll to top
		window.scrollTo(0, 0);

	}

	_handleInput(e){

		//handle input fields
		this.setState({
			[e.target.id]:e.target.value
		})

		//remove error indicator on new data entry
		$(`#${e.target.id}`).removeClass('formError');
	}




	_addStyle(e){

		//disable buttons
		_disable()

		//validate data
		let errors = this._validate();

		//if errors exist
		if(errors.length > 0){

			//create msg comp from error array
			let msgComp = errors.map((msg,index)=>{
				
				return <div className="text-center" key={index}><p>{msg}</p></div>
			})
			let formattedComp = <div className="box">{msgComp}</div>

			//save error array to state for display
			this.setState({
				errors:formattedComp
			})
			//enable buttons
			_enable();

		}else{

			//create base firestore ref
			let firestore = firebase.firestore();

			//create ref to new style name in styles section
			let ref = firestore.collection("Styles").doc(this.state.styleName);
			
			//create style object
			let styleObject = {
				Name:this.state.styleName,
				Country:this.state.countryOfOrigin,
				Created:this.state.dateCreated,
				Features:this.state.definingFeatures,
				Practioners:this.state.famousPractioners,
				Description:this.state.fullDescription,
				History:this.state.history,
				CreatedBy:this.userUID
				
				
			}

			//set new object in firestore
			ref.set(styleObject).then(()=>{
				//enable buttons
				_enable();

				//redirect back to styles
				this.props.history.push('/Styles');
			});
		}
		
		
		
	}

	_validate(){
		
		//store error messages in array
		const errorMsgs = [];

		//validfate each input
		if (this.state.styleName.length < 1) {
		   errorMsgs.push("Please provide a style name");
		   $('#styleName').addClass('formError');
		}

		if (this.state.countryOfOrigin.length < 1) {
		   errorMsgs.push("Please provide a country of origin");
		    $('#countryOfOrigin').addClass('formError');
		}
		
		if (this.state.definingFeatures.length < 1) {
		   errorMsgs.push("Please provide some defining features");
		   $('#definingFeatures').addClass('formError');
		}

		//return error array
  		return errorMsgs;
	}

	render(){
		return(
			<div className="container">
				<div className="content-wrapper">
					<div className="box">
						<Link to="/Styles">&lt; Back </Link>
					</div>

					<form className="box ">

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="styleName">Style name:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="styleName" value={this.state.styleName} onChange={this._handleInput.bind(this)} className="form-control" />
								
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="countryOfOrigin">Country of origin:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="countryOfOrigin" value={this.state.countryOfOrigin}onChange={this._handleInput.bind(this)} className="form-control"/>
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="definingFeatures">Defining features:</label>
							</div>
							<div className="col-sm-6">
								<textarea id="definingFeatures" value={this.state.definingFeatures} onChange={this._handleInput.bind(this)} className="form-control" />
							</div>
						</div>


						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="dateCreated">Date created:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="dateCreated" value={this.state.dateCreated} onChange={this._handleInput.bind(this)} className="form-control" />
							</div>
						</div>

						

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="famousPractioners">Famous Practioners:</label>
							</div>
							<div className="col-sm-6">
								<input type="text" id="famousPractioners" value={this.state.famousPractioners} onChange={this._handleInput.bind(this)} className="form-control" />
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="fullDescription">Full description:</label>
							</div>
							<div className="col-sm-6">
								<textarea id="fullDescription" value={this.state.fullDescription} onChange={this._handleInput.bind(this)} className="form-control" />
							</div>
						</div>

						<div className="row form-group">
							<div className="col-sm-6">
								<label htmlFor="history">History:</label>
							</div>
							<div className="col-sm-6">
							
								<textarea id="history" value={this.state.history} onChange={this._handleInput.bind(this)} className="form-control"/>
							</div>
						</div>
						

						<div className="text-center">
							<button className="btn btn-primarySmall" onClick={this._addStyle.bind(this)}>Add Style</button>
							
						</div>
						{this.state.errors}
					</form>
				</div>
			</div>
		)
	}
}