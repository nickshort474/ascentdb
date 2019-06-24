import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';

import store from '../redux/store';
import constants from '../redux/constants';

export default class AutoSuggest extends Component{
	
	constructor(props){
		super(props);
		
		//set initial state
		this.state = {
			value:"",
			suggestions:[]
		}

		//get page which component is being used in
		this.page = this.props.page;
	}


	getSuggestions(value){
		
		//take value  (user typed data) and trim / lowercase
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		//take props.list which is the passed array of possible suggestions
		//if input length of user typed is 0 return empty array 
		//else filter list to compare each value in list to user submitted data
		if(this.page === "searchForBlog"){
			return inputLength === 0 ? [] : this.props.list.filter(lang => lang.word.toLowerCase().slice(0,inputLength) === inputValue);
		}else if(this.page === "searchForPeople"){
			return inputLength === 0 ? [] : this.props.list.filter(lang => lang.toLowerCase().slice(0,inputLength) === inputValue);
		}
		
	}

	getSuggestionValue(suggestion){
		
		//save matching selection to store for use in component
		if(this.page === "searchForBlog"){

			store.dispatch({type:constants.SAVE_BLOG_SEARCH_TERM, blogSearchTerm:suggestion.word})
			return suggestion.word;

		}else if(this.page === "searchForPeople"){
			
			store.dispatch({type:constants.SAVE_PEOPLE_SEARCH_TERM, peopleSearchTerm:suggestion})
			return suggestion;
		}
		
		
	}

	renderSuggestion(suggestion){
		
		//render suggestion 
		if(this.page === "searchForBlog"){
			return  <div><p className="noList">{suggestion.word}</p></div>
		}else if(this.page === "searchForPeople"){
			return  <div><p className="noList">{suggestion}</p></div>
		}
		
	};

	onChange = (event,{newValue}) => {
		//hanlde data input
		this.setState({
			value:newValue
		});
		
	};


	onSuggestionsFetchRequested = ({value}) => {
		
		//event to listen for value and set result to state
		this.setState({
			suggestions:this.getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		
		//event to clear suggestion
		this.setState({
			suggestions:[]
		});
	};



	render(){

		const { value, suggestions } = this.state;
		
		const inputProps = {
      		placeholder: 'Type a keyword to search for',
      		value,
      		onChange: this.onChange
    	};


		return(
			<div className="msgCompStyle">
				<Autosuggest
			        suggestions={suggestions}
			        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
			        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
			        getSuggestionValue={this.getSuggestionValue.bind(this)}
			        renderSuggestion={this.renderSuggestion.bind(this)}
			        inputProps={inputProps}
			     />
		     </div>
		)
	}
}