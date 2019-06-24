

import React,  {Component} from 'react';


const google = window.google;

export default class Map extends Component {

  constructor(){
      super();
     
      //set initial state
      this.state = { 
          zoom:9,
          data:"",
          centerLng:"",
          centerLat:"" 
      };


  }
 

	render() {
    return( 
        <div className="GMap" >
            <div className='GMap-canvas msgCompStyle' ref="mapCanvas">
        </div>
      </div>
    )
  }

  componentDidMount() {

      //connect to component
      this.props.onRef(this);

    
  }

  componentWillUnmount(){
      this.props.onRef(undefined);
  }


  // clean up event listeners when component unmounts
  componentDidUnMount() {
      google.maps.event.clearListeners(this.map, 'zoom_changed') 
  }

  _updateMap(lng,lat,page,radius,items){
      let zoom;
      //set map zoom  level based on provided radius
      switch(radius){
          case "10":
              zoom = 9
              break;
          case "25":
              zoom = 8
              break;
          case "50":
              zoom = 7
              break;
          case "100":
              zoom = 6
              break;
          default:
              zoom = 1
      }

      //collect items data to display
      this.items = items;

      //save passed data to state
      this.setState({
          centerLat:lat,
          centerLng:lng,
          page:page,
          radius:radius,
          zoom:zoom
      },()=>{
          
          //create map
          this.map = this._createMap();

          //create marker
          this.marker = this._createMarker();
          
          //handle zoom change event         
          google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
      })

    
  }

  _createMap() {
      
      //create map options
      let mapOptions = {
          zoom: this.state.zoom,
          center: this._mapCenter(),
          streetViewControl:false,
          
        }
        //retrun enw google map
        return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  _mapCenter() {
      //set map center
      return new google.maps.LatLng(
          this.state.centerLat,
          this.state.centerLng
      )
  }



  _createMarker() {

      // if coming from findbusiness
      if(this.state.page === "FindBusiness"){
          
          //loop throug data
          for(let obj of this.items){
             
              //create display data
              let businessLink = "<a class='compTextStyle' href='#/SingleBusiness/" + obj.key +"'>Visit business page</a>"
              let contentString = "<div class='InfoWindow'><h2>" + obj.businessName + "</h2><br /><p>" + businessLink + "</p></div>"
              
              //create infowindow
              let infowindow = new google.maps.InfoWindow({
                  content:  contentString
              })

              //set coords for map marker
              let coords = new google.maps.LatLng(obj.lat,obj.lng)
              
              //create marker
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true,


              })

              //add marker to map with click listener
              this.marker.setMap(this.map);
              this.marker.addListener('click',()=>{
              
                  //open infowindow centered onCLick
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      //if ocming from SingeBusinessPage
      }else if(this.state.page === "SingleBusinessPage"){
          
           
          //create infowindow
          let infowindow = new google.maps.InfoWindow({
              content: this.props.data.businessName
          })

          //set coords for map marker
          let coords = new google.maps.LatLng(this.props.data.lat, this.props.data.lng)
          
          //create marker
          this.marker = new google.maps.Marker({
              position:coords,
              map:this.map,
              visible: true
          })

          //add marker to map with click listener
          this.marker.setMap(this.map);
          this.marker.addListener('click',()=>{
              
              //open infowindow centered onCLick
              infowindow.setPosition(coords)
              infowindow.open(this.map);
          })

      }else if(this.state.page === "FindEvents"){

          let obj;

          for(obj of this.items){
             
              let eventLink = "<a class='compTextStyle' href='/#/SingleEvent/" + obj.eventID +"'>Visit event page</a>"
              let contentString = "<div class='InfoWindow'><h2>" + obj.eventName + "</h2><br />" + eventLink + "</p></div>"
              
              //let contentString = "Hello";

              let infowindow = new google.maps.InfoWindow({
                  content:  contentString
              })

              //set coords for map marker
              let coords = new google.maps.LatLng(obj.lat, obj.lng)
              
              //create marker
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true
              })

              //add marker to map with click listener
              this.marker.setMap(this.map);
              this.marker.addListener('click',()=>{
              
                  //open infowindow centered onCLick
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      }else if(this.state.page === "SingleEventPage"){
          
          console.log(this.props.data);

          let contentString = "<div class='InfoWindow'><h2>" + this.props.data.name + "</h2></div>"

          let infowindow = new google.maps.InfoWindow({
              content: contentString
          })

          //set coords for map marker
          let coords = new google.maps.LatLng(this.state.centerLat, this.state.centerLng)
      
          //create marker
          this.marker = new google.maps.Marker({
              position:coords,
              map:this.map,
              visible: true
          })

          //add marker to map with click listener
          this.marker.setMap(this.map);
          this.marker.addListener('click',()=>{
              
              //open infowindow centered onCLick
              infowindow.setPosition(coords)
              infowindow.open(this.map);
          })
      }else if(this.state.page === "FindPeople"){

          let obj;

          for(obj of this.items){
             
             let peopleLink = "<a class='compTextStyle' href='/#/PersonProfile/" + obj.uid +"'>Visit users profile</a>"
               /* let people2Link = "<Link className='compTextStyle' to='/Person" + obj.uid + "'>Visit users profile</Link>"*/
              let contentString = "<div class='InfoWindow'><h2>" + obj.firstName + "</h2><br><p>" + obj.lastName + "</p><p>" + peopleLink + "</p></div>"
              
              //let contentString = "Hello";

              let infowindow = new google.maps.InfoWindow({
                  content: contentString
              })

              //set coords for map marker
              let coords = new google.maps.LatLng(obj.lat, obj.lng)
              
              //create marker
              this.marker = new google.maps.Marker({
                  position:coords,
                  map:this.map,
                  visible: true
              })

              //add marker to map with click listener
              this.marker.setMap(this.map);
              this.marker.addListener('click',()=>{
              
                  //open infowindow centered onCLick
                  infowindow.setPosition(coords)
                  infowindow.open(this.map);

              })
           
          }
      }
      
	}

  
  handleZoomChange() {
      //set zoom level
      this.setState({
          zoom: this.map.getZoom()
      })
      
  }
}