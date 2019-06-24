import React,{Component} from 'react';


export default class SideBarAdvert extends Component{
	
	

	render(){
		return(
			<div>
            	<div className="box colored site-partner">
                   	<h3 className="text-center">Our partners</h3>			
                    
                    <div style={this.state.containerStyle}>
                    
                    	<img src="../images/blitz.png"  className="img-responsive center-block" alt="Our partner" style={this.state.styles} />
                    	<img src="/images/under_armour.png" className="img-responsive center-block" alt="Our 3rd partner" style={this.state.styles} />
                    	
                    </div>
                </div>
			</div>
		)
	}
}