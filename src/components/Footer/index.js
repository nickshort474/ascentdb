import React from 'react';
import { Link } from 'react-router-dom';



const Footer = () => (
	 <footer className="navbar navbar-transparent">
    	<div className="container">
        	<div className="row">
            	<div className="col-sm-6 hidden-xs">
                	<ul className="nav navbar-nav">
                        <li><Link to="/Contact">Contact Us</Link></li>
                        <li><Link to="/AboutUs">About us</Link></li>
                        <li><Link to="/Privacy">Privacy</Link></li>
                        <li><Link to="/Terms">Terms</Link></li>
                        
                        
                    </ul>
                </div>
                <div className="col-sm-6">
                	<p className="copyright">© <span className="text-14"><span>Ascent</span>DB</span> All rights reserved <Link to="/ReportContent" className="footerReport">Report</Link></p>
                	
                </div>
            </div>
         </div>   
     </footer>

)

export default Footer