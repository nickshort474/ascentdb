import React, {Component} from 'react';


export default class ProcessDaysAgo extends Component{

	componentWillMount(){
		
		//set state form props
		this.setState({
			date:this.props.date,
			timeToShow:0
		},()=>{
			//process prop data
			this._processDays();
		})
				
	}
	
	
	_processDays(){
		
		//get date from state
		let currentDate = this.state.date;
		//get current date
		let now = Date.now();
		//work out time difference
		let millisecondsDifference = now - currentDate;
		
		//round difference to the hour
		this.hourDifference = Math.round(millisecondsDifference / 3600000)

		//conditional for what to display based on hours
		if(this.hourDifference >= 24){
			let days = Math.round(this.hourDifference / 24);
			this.timeToShow = `${days} days ago`;
		}else if(this.hourDifference === 0){
			this.timeToShow = "just now"
		}else{
			this.timeToShow = `${this.hourDifference} hours ago`;
		}
		
		//set to state for display
		this.setState({
			timeToShow:this.timeToShow
		})
		

		
	}

	render(){
		
		return(
			
			<span className="text-10">{this.state.timeToShow} </span>
            
		)
	}
}