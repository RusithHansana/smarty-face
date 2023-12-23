import { Component } from 'react';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import ParticlesBg from 'particles-bg'
import SignIn from './components/SignIn/SignIn.js';


const initalState = {
  input: '',
  imageUrl: '',
  box:[],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0, //to track image count
    joined: new Date(),
  }
}

class App extends Component{
  constructor() {
    super();
    this.state = initalState;
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    });
  }

  fetchFaceCoordinates = ( imageUrl ) => {
    fetch('https://thawing-journey-00239-4c64da6dd597.herokuapp.com/detect', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: imageUrl
        })
      })
      .then(response => response.json())
      .then(data => {
        this.rankUp();
        this.highlightFace(this.calculateFaceLocation(data));
      })
      .catch(err => console.log(err));
  }

  rankUp = () => {
    fetch('https://thawing-journey-00239-4c64da6dd597.herokuapp.com/image', {
      method: 'put',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, {
          entries: count
        })//object is assign is used to update a value in an object without affecting other entries
      );
    })
    .catch(console.log);
  }
  

  calculateFaceLocation = (data) => {
    const image = document.getElementById('imageinput');
    const width = Number(image.width); //to make sure it is always a nummber
    const height = Number(image.height);
    const faceCoordinates = data.map((box) => {
        return {
          leftCol: box.leftCol * width,
          topRow: box.topRow * height,
          rightCol: width - (box.rightCol * width),
          leftRow: height - (box.leftRow * height)
        }
      }
    );

    return faceCoordinates;
  }

  highlightFace = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState(
      {
        input: event.target.value
      }
    );
  }

  onSubmit = () => {
    this.setState( { imageUrl: this.state.input } );

    if( this.state.input.includes('https://') || this.state.input.includes('http://')){
      this.fetchFaceCoordinates(this.state.input);
    }else {
      toast.error('Please provide a public image url',{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    }
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initalState);
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    } 
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg color= "#191970" type="cobweb" bg={true} /> 
        <Navigation onRouteChange={ this.onRouteChange } isSignedIn={ isSignedIn }/>
        {
          route === 'home'
          ?(
            <div>
              <Logo />
              <Rank name = { user.name } rank = { user.entries }/>
              <ImageLinkForm 
                onInputChange = {this.onInputChange}
                onButtonSubmit = {this.onSubmit}
              />
              <FaceRecognition imageUrl = { imageUrl } boxes = { box }/>
            </div>
          )
          : <SignIn onRouteChange ={ this.onRouteChange } route = { route } loadUser = { this.loadUser }/>
          }
          <ToastContainer />
      </div>
    );
  }
}

export default App;
