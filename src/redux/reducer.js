import constants from './constants';

const initialState = {
	page:""
}

const reducer = (state = initialState, action) => {
	
	switch (action.type){

		
		case constants.SAVE_PAGE:
			return Object.assign({},state,{page:action.page})
		case constants.SAVE_PREV_PAGE:
			return Object.assign({},state,{prevPage:action.prevPage})
		
		case constants.RESTORE:
			state = action.obj;
			return state

		case constants.SAVE_STYLE:
			return Object.assign({},state,{style:action.style})
		case constants.SAVE_BLOGS:
			return Object.assign({},state,{blogObj:action.blogObj})
		case constants.SAVE_BLOG_SEARCH_TERM:
			return Object.assign({},state,{blogSearchTerm:action.blogSearchTerm})	
		case constants.SAVE_PEOPLE:
			return Object.assign({},state,{peopleListings:action.people})
		case constants.SAVE_PEOPLE_SEARCH_TERM:
			return Object.assign({},state,{peopleSearchTerm:action.peopleSearchTerm})		

		case constants.EVENT_HAS_IMAGE:
			return Object.assign({},state,{eventHasImg:action.eventHasImg})
		case constants.EVENT_IMAGE:
			return Object.assign({},state,{eventImg:action.eventImg})
		case constants.BLOG_HAS_IMAGE:
			return Object.assign({},state,{blogHasImg:action.blogHasImg})
		case constants.BLOG_IMAGE:
			return Object.assign({},state,{blogImg:action.blogImg})
		case constants.BUSINESS_IMAGE:
			return Object.assign({},state,{businessImg:action.businessImg})	
		case constants.SAVE_KEYWORDS:
			return Object.assign({},state,{keyWordList:action.keyWordList})
		case constants.SAVE_KEYWORDS_DATE:
			return Object.assign({},state,{keyWordListDate:action.keyWordListDate})

		case constants.HAS_SAVED_BUSINESS_SEARCH:
			return Object.assign({},state,{hasSavedBusinessSearch:action.hasSavedBusinessSearch})
		case constants.SAVE_BUSINESS_SEARCH_TERM:
			return Object.assign({},state,{businessSearchTerm:action.businessSearchTerm})
		case constants.SAVE_BUSINESS_SEARCH_VALUES:
			return Object.assign({},state,{businessSearchValues:action.businessSearchValues})
		case constants.SAVE_SEARCHED_BUSINESS:
			return Object.assign({},state,{businessSearchObj:action.businessSearchObj})

		case constants.HAS_SAVED_EVENT_SEARCH:
			return Object.assign({},state,{hasSavedEventSearch:action.hasSavedEventSearch})
		case constants.SAVE_EVENT_SEARCH_TERM:
			return Object.assign({},state,{eventSearchTerm:action.eventSearchTerm})
		case constants.SAVE_EVENT_SEARCH_VALUES:
			return Object.assign({},state,{eventSearchValues:action.eventSearchValues})
		case constants.SAVE_SEARCHED_EVENTS:
			return Object.assign({},state,{eventSearchObj:action.eventSearchObj})
			

		case constants.CLEAR_STORE:
			state = initialState;	
			return state

		default:
		return state;
	}

}

export default reducer;



//{userUID:action.userUID};
//{page:action.page};