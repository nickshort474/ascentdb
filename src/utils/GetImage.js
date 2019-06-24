import React,{Component} from 'react';
import $ from 'jquery';

import store from '../redux/store';
import constants from '../redux/constants';

import {_compressImage} from './CompressImage';
import defaultLogo from '../assets/images/default.jpg';


export default class GetImage extends Component{
	
	componentWillMount(){
		
		//test for passed source
		if(this.props.src){
			this.src = this.props.src;
		}else{
			this.src = defaultLogo
		}

		//save prompt and source to state
		this.setState({
			prompt:this.props.prompt,
			src:this.src

		})
	}

	_handleBrowseClick(){
	   //handle browse click (hides browse button allows styling of upload image button)
	    var fileinput = $("#browse");
	    fileinput.click();
	}

	_previewImage(e){
		
		//for each component set up reader
		//create onload event which will
		//compress image using outside comp
		//save result to store
		//display image
		//then read image data

		if(this.props.comp === "AddEvents"){
			
			let reader = new FileReader();
		
			reader.onload = function(e){
				
				_compressImage(e.target.result, 250, (result)=>{

					//store state in redux ready for check during submitting of data
					store.dispatch({type:constants.EVENT_HAS_IMAGE, eventHasImg:true});

					//store image in redux
					store.dispatch({type:constants.EVENT_IMAGE, eventImg:result});

					
				})

				//preview image
				$('#previewImage').attr("src", e.target.result);
				
			}
			reader.readAsDataURL(e.target.files[0]);

		}else if(this.props.comp === "EditEventLogo"){
			
			
			
			let reader = new FileReader();
		
			reader.onload = function(e){
				
				_compressImage(e.target.result, 250, (result)=>{

					//store image in redux
					store.dispatch({type:constants.EVENT_IMAGE, eventImg:result});
															
				})

				//preview image
				$('#previewImage').attr("src", e.target.result);
				
			}
			reader.readAsDataURL(e.target.files[0]);

		}else if(this.props.comp === "EditBusinessLogo"){
			
			
			
			let reader = new FileReader();
		
			reader.onload = function(e){
				
				_compressImage(e.target.result, 250, (result)=>{

					//store image in redux
					store.dispatch({type:constants.BUSINESS_IMAGE, businessImg:result});
															
				})

				//preview image
				$('#previewImage').attr("src", e.target.result);
				
			}
			reader.readAsDataURL(e.target.files[0]);

		}else if(this.props.comp === "AddBlog"){

			let reader = new FileReader();
		
			reader.onload = function(e){
				
				_compressImage(e.target.result, 250, (result)=>{

					//store state in redux ready for check during submitting of data
					store.dispatch({type:constants.BLOG_HAS_IMAGE, blogHasImg:true});

					//store image in redux
					store.dispatch({type:constants.BLOG_IMAGE, blogImg:result});
					
					
					
				})

				//preview image
				$('#previewImage').attr("src", e.target.result);
				
			}
			reader.readAsDataURL(e.target.files[0]);
		}



		

		
	
		
	}

	render(){
		return(
					
			<div className="form-group text-center">
				
				<p>{this.state.prompt}</p>
				<input type="file"  id="browse" style={{display:"none"}} name="fileupload" onChange={this._previewImage.bind(this)} accept="image/*" />
				<input type="button" className="btn btn-primary"   value="Add Image" id="fakeBrowse" onClick={this._handleBrowseClick.bind(this)} /><br />
				<img src={this.state.src} id="previewImage" className="img-thumbnail" width="200px" height="200px" alt="Preview" />
								
			</div>
	
		)
	}
}


