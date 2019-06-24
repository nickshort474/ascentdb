import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {firebase} from '@firebase/app';

import EditLink from "./EditLink";

import store from '../../redux/store';
import constants from '../../redux/constants';
import LocalStorage from '../../utils/LocalStorage';


export default class Styles extends Component{
	
	constructor(){
		super();

		//set initial state
		this.state = {
			styleItems:[],
			styleName:"",
			countryOfOrigin:"",
			dateCreated:"",
			definingFeatures:"",
			famousPractitioners:"",
			fulldescription:"",
			history:""
		}

		//style dropdown box
		this.dropDownStyle = {
			color:"black"
		}

		//get cuurently slected style from store
		let storeState = store.getState();
		let style = storeState.style;
		
		//if style is undefined set it to Aikido
		if(style === undefined){
			this.currentSelectedStyle = "Aikido";
		}else{
			this.currentSelectedStyle = style;
		}

		//save current page to store
		store.dispatch({type:constants.SAVE_PAGE, page:"Styles"});
		
		//get user id form local storage
		this.userUID = LocalStorage.loadState("user");
		let styleItems = [];
		
		//set base firestore ref
		this.firestore = firebase.firestore();

		//set styles ref
		let ref = this.firestore.collection("Styles");

		//get style data
		ref.get().then((snapshot)=>{
			
			//loop through snapshot
			snapshot.forEach((element)=> {
				//push data to array
				styleItems.push(element.data().Name);
			});

			//add array to state for display
			this.setState({
				styleItems:styleItems
			},()=>{

				//handle first collection of style data
				this._handleStyleClick(false);
			})
		})

		
	}

	componentWillMount(){
		window.scrollTo(0, 0);
	}

	_handleStyleClick(e){
		
		//if e !== false then is new selection from drop down so populate currentlySelectedStyle from target.value
		if(e !== false){
			//set value of slectedStyle
			this.currentSelectedStyle = e.target.value;
			
		}

		//save currently selected style to store
		store.dispatch({type:constants.SAVE_STYLE, style:this.currentSelectedStyle});
		
		//set ref to sleceted style in styles section
		let ref = this.firestore.collection("Styles").doc(this.currentSelectedStyle); 
			
		//get style data
		ref.get().then((snapshot)=>{
			
			//save data to state for display
			this.setState({
				styleName:snapshot.data().Name,
				countryOfOrigin:snapshot.data().Country,
				dateCreated:snapshot.data().Created,
				definingFeatures:snapshot.data().Features,
				famousPractitioners:snapshot.data().Practitioners,
				fullDescription:snapshot.data().Description,
				history:snapshot.data().History
			})
		})

	}

	_addStyle(){
		// if user is signed in allow them to navigate to add style
		if(this.userUID){
			this.props.history.push('/AddStyle');
		}else{
			alert('Please sign in to add to the style wiki');
		}
	}


	render(){
		
		//loop through styleItems to create drop down 
		var styleList = this.state.styleItems.map((styleName) => {
			
			let routeString = styleName.replace(/\s+/g, '');
			
			if(styleName === this.currentSelectedStyle){
				return <option key={routeString}  value={styleName}>{styleName}</option>
			}else{
				return <option key={routeString} value={styleName}>{styleName}</option>
			}

			
		})


		return(
			<div>
				<div className="container">
			        <section className="content-wrapper">
			        	<div className="row">
			        		
			        		
			        		<div className="col-sm-3">
			        			
			        			<div className="row">
			        				<div className="col-sm-12">
			        					<div className="style-box-less-padding  greyedContent">
					        				<div className="text-center">
						        				<p>Style:</p>
							        			<select onChange={this._handleStyleClick.bind(this)} value={this.currentSelectedStyle} style={this.dropDownStyle}>
							        				<option>Select style:</option>
							        				{styleList}
							        			</select><br /><br />
						        			</div>
					        			</div>
				        			</div>
			        			</div>
			        		</div>


							<div className="col-sm-9">
			                    
								<div className="row">

									<div className="col-sm-6">
										<div className="box text-center greyedContent">
											<h1><b>{this.state.styleName}</b></h1>
											<h2>{this.state.countryOfOrigin}</h2>
										</div>
									</div>


									<div className="col-sm-6">
										<div className="box greyedContent">
											<div className="row">
												<div className="col-xs-6">
													<p><i><b>Date created:</b></i></p>
												</div>
												<div className="col-xs-6 text-right">
													<EditLink data="Created" style={this.state.styleName} />
													
												</div>
												
											</div>
											<div> {this.state.dateCreated ? this.state.dateCreated : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

										</div>
									</div>

								</div>


			                    <div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Defining features:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Features" style={this.state.styleName} />
										</div>
									</div>
									<div> {this.state.definingFeatures ? this.state.definingFeatures : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								
								
								
								<div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Famous practitioners:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Practitioners" style={this.state.styleName} />
										</div>
									</div>



									

									<div>{this.state.famousPractitioners ? this.state.famousPractitioners : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>

								<div className="box greyedContent">
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>Full description:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="Description" style={this.state.styleName} />
										</div>
									</div>

									

									

									<div>{this.state.fullDescription ? this.state.fullDescription : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								<div className="box greyedContent">
									
									<div className="row">
										<div className="col-xs-6">
											<p><i><b>History:</b></i></p>
										</div>
										<div className="col-xs-6 text-right">
											<EditLink data="History" style={this.state.styleName} />
										</div>
									</div>
									

									

									<div>{this.state.history ? this.state.history : <p>Please click the edit link ( <i className='fa fa-edit' alt='edit history'></i> ) to add additional info</p>}</div>

								</div>
								<div className="row">
			        				<div className="col-sm-12">
			        					
			        					
				        					<div className="col-sm-4 addStyleButton" onClick={this._addStyle.bind(this)}>
				        						
				        						<div className="box text-center greyedContent">
				        							<h4>Add Style</h4><i className="fa fa-plus-circle fa-3x" alt="Add Style"></i>
							                	</div>
							                	
							                </div>

							                <div className="col-sm-4">
								                <Link to={"/EditHistory/" + this.state.styleName}>
								                <div className="box text-center greyedContent">	
									                <h4>Edit History</h4><i className="fa fa-history fa-3x" alt="Edit History" ></i>
												</div>
												</Link>
										 	</div>
										 	
										 	<div className="col-sm-4">
								                <Link to={`/Report/${this.currentSelectedStyle}`}>
									                <div className="box text-center greyedContent">	
										                <h4>Report Content</h4><i className="fa fa-flag-checkered fa-3x" alt="Report content" ></i>
													</div>
												</Link> 
										 	</div>

			        				</div>
			        			</div>
			            	</div>
			        	</div>
			        </section>
			    </div>
			</div>
			

		)
	}
}