import React, {Component} from 'react';
import render from 'react-dom';
import {firebase} from '@firebase/app';



export default class ReplyComp extends Component{
	

	constructor(){
		super();
		this.state = {
			reply:"Hello",
            replyCount:" ",
            replyNum:" ",
            postDone:false
		}

	}
	
	componentDidMount() {

	}

    _textAreaValue(event){
        
        this.setState({
            reply:event.target.value
        })
    }

	_postReply(event){
		event.preventDefault();
		
        console.log(this.props.topicCat);
        console.log(this.props.topicId);

        let topicDatabase = firebase.database().ref(`ForumTopics/${this.props.topicCat}/${this.props.topicId}`);
        console.log(topicDatabase);
        topicDatabase.once("value", (snapshot) => {
            
            let replyCount = snapshot.val().topic_replies;
            
            
            this.state.replyNum = this._pad(replyCount);

            let replyDatabase = firebase.database().ref(`ForumReplies/${this.props.topicId}/reply_${this.state.replyNum}`);
            
            
            replyDatabase.set({ reply_body: this.state.reply, reply_by: 'Me', reply_date: Date.now() })
              .then(()=> {
                console.log('Synchronization succeeded');
                this._deleteReplyBox();
              })
              .catch(function(error) {
                console.log('Synchronization failed');
              });
              topicDatabase.child("topic_replies").set(replyCount + 1);
              
        })

	}

    _deleteReplyBox(){
        this.props.handler();
    }

    _pad(num){
        return ("00000" + (num + 1)).substr((num + 1).toString().length);
    }

	render(){
		return(
			
		    <div className="box forum-post-wrapper">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="author-detail">
                            <h3><a href="profile.html">{this.props.replyBy}</a></h3>
                            <p className="function">Moderator</p>
                            <ul className="list-unstyled">
                                <li><strong>Join Date</strong>24/10/2014</li>
                                <li><strong>Reputation</strong>2616</li>
                                <li><strong>Posts</strong>5578</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <article className="forum-post">
                            <div className="date">{this.props.replyDate}</div>
                            
                            <p><textarea value={this.state.reply} onChange={this._textAreaValue.bind(this)} /></p>

                            <button onClick={this._postReply.bind(this)} className="btn btn-primary">Post</button>
                            
                        </article>
                    </div>
                </div>
            </div>	
           
		)
	}
}