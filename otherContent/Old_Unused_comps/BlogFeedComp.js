import React, {Component} from 'react';
/*import {Link} from 'react-router-dom';*/
import store from '../redux/store';
import constants from '../redux/constants';

import ProcessEpoch from '../Components/ProcessEpoch';

export default class BlogFeedComp extends Component{
	

	constructor(){
		super();
		store.dispatch({type:constants.SAVE_PAGE, page:"Home"});
        
        this.imgStyle = {
            width: '25px',
            height:'25px',
            padding:'0px',
            marginLeft:'10px',
            border:'black solid 1px'
            
        };
        this.avatarStyle = {
            width: '25px',
            height:'25px',
            padding:'0px',
            marginLeft:'10px'
            
        };
	}

	componentWillMount(){
		window.scrollTo(0, 0);
         try{
            console.log("blog feed comp: " + this.props.date);
        }catch(e){
            console.log(e);
        }
	}
	
	render(){
		return(
			<div>
             	<div className="box">

			        <div className="row">
			            <img className="col-xs-1" alt="blog icon" src="./images/blogIcon.png" style={this.imgStyle}/>
                        <p className="col-xs-5">{this.props.postName}</p>
                        <p className="col-xs-5"><small className="text-8">{this.props.blogName}</small></p>
                    </div>    
                            
                    <div className="row">       
                        <p className="postContentBox">Content goes here</p>

                    </div>     

                    <div className="row">
                        <img className="col-xs-2" alt="avatar icon" src="./images/overlay.png" style={this.avatarStyle}/>
                        <p className="col-xs-5">{this.props.user}</p>
                        <div className="col-xs-5"><ProcessEpoch date={this.props.date} /></div>
                    </div>


                                               
                </div>
            </div>
								
		)		                   
	}
}		