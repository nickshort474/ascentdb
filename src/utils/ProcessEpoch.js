import React, {Component} from 'react';


export default class ProcessEpoch extends Component{

	
	componentWillMount(){

		//set state from props
		this.setState({
			date:this.props.date
		},()=>{
			//process prop data
			this._processEpoch();
		})
		
		
	}
	
	
	_processEpoch(){
		
		//create date object
		let currentDate = new Date(this.state.date);
		
		//get month form object and process
		let month = currentDate.getMonth();
		let monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		this.month = monthArray[month];
		
		//get day form object and process
		let day = currentDate.getDay();
		let dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		this.day = dayArray[day];

		//get date from object and process
		let tempDate = currentDate.getDate();
		let dateArray = ["0","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th","29th","30th","31st"]
		this.date = dateArray[tempDate]; 

		//get hours and minutes
		this.hours = currentDate.getHours();
		this.minutes = currentDate.getMinutes();
		
		//pad single digit minutes
		if(this.minutes.toString().length === 1){
			
			let paddedMinutes = this.minutes.toString().padStart(2, '0')
			this.minutes = paddedMinutes
		}

		//save data to state
		this.setState({
			date:this.date,
			month:this.month,
			day:this.day,
			hours:this.hours,
			minutes:this.minutes
		})
		
	}

	render(){
		
		return(
			
			<span className="text-10"> {this.state.day} {this.state.date} {this.state.month} {this.props.hoursWanted ? `${this.state.hours}:${this.state.minutes}` : null}</span>
            
		)
	}
}