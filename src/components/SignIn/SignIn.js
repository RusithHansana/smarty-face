import { Component } from 'react';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class SignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            email: '',
            password: ''
        }
    }

    toastConfig = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    }

    toastWarning = ( warning ) => {
        toast.warn( warning, this.toastConfig);
    }

    toastError = ( error ) => {
        toast.error( error, this.toastConfig);
    }

    onNameChange = (event) => { 
        if( event.target.value.length === 20){
            this.toastWarning('Name must have 1-20 letters');
        }else{
            this.setState({ name: event.target.value });   
        }
    }

    onEmailChange = (event) => {
        if( event.target.value.length === 60){
            this.toastWarning("Email mustn't exceed 60 characters");
        }else{
           this.setState({ email: event.target.value });   
        }
    }

    onPasswordChange = (event) => {
        if( event.target.value.length === 32){
            this.toastWarning("Password mustn't exceed 32 characters");
        }else{
           this.setState({ password: event.target.value });   
        }
    }

    sendSignInRequest = ( email, password ) => {
        if(email.length === 0 || password.length === 0){
            this.toastWarning('Email and Password cannot be empty');
        }else{
            fetch('https://thawing-journey-00239-4c64da6dd597.herokuapp.com/signin',{
                    method: 'POST',
                    headers:{ 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                })
                .then(respone => respone.json())
                .then(user => {
                    //if the sign in is success full user will have an id
                    //if not there will be no id so user will not be directed to the homepage
                    if(user[0].id){
                        this.props.loadUser(user[0]);
                        this.props.onRouteChange('home');
                    } else {
                        this.toastError('Wrong Credentials');
                    }
                })
                .catch(console.log);    
        }
    }

    sendRegisterRequest = ( name, email, password) => {
        const nameIsValid = name.length > 0 && name.length < 20;
        const emailIsValid = email.length > 0 && email.length < 60 && email.includes('@') && email.includes('.com');
        const passwordIsValid = password.length > 8 && password.length < 32;

        if(!nameIsValid){
            this.toastWarning('Name must be 1-20 characters');
        } else if( !emailIsValid ){
            this.toastWarning('Email must be 15-60 characters');
            this.toastWarning('Email must have @ and .com');
        }else if( !passwordIsValid ){
            this.toastWarning('Password must be 8-32 characters');
        }else {
            fetch('https://thawing-journey-00239-4c64da6dd597.herokuapp.com/register', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*', 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(user => {
                if(user.id){
                    this.props.loadUser(user);
                    this.props.onRouteChange('home');
                } else {
                    this.toastError('Invalid input try again');
                }
            })
            .catch(console.log);
        }
   
    }
    
    onSubmitSignIn = ( currentRoute ) => {
        const { email, password, name } = this.state;
        if(currentRoute === 'signin'){
            this.sendSignInRequest( email, password );
        } else if( currentRoute === 'register') {
            this.sendRegisterRequest( name, email, password );
        } 
    }

    render(){
        const { onRouteChange, route } = this.props;
        let currentRoute = route === 'signin'? 'signin': 'register';
        let message = "Don't Have An Account?";
        let link = "register";

        if( currentRoute === 'register'){
            message = "Already Have An Account?";
            link = "signin";
        }

        return(
            <article className="br3 ba shadow-5 b--black-10 mv4 w-100 w-50-m w-25-l mw6 center">
                <main className="pa4 black-80">
                    <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0 ttc"> { currentRoute } </legend>
                                {
                                    currentRoute === 'register'? (
                                        <div className="mt3">
                                            <label className="db fw6 lh-copy f6">Name</label>
                                            <input 
                                                onChange={ this.onNameChange }
                                                className="pa2 b--black input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                                type="text" 
                                                name="name"  
                                                id="name"
                                                maxLength= {20}
                                                required
                                            />
                                        </div>
                                    ): null
                                }
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6">Email</label>
                                    <input onChange={ this.onEmailChange} 
                                        className="pa2 b--black input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type="email" 
                                        name="email-address"  
                                        id="email-address"
                                        maxLength= {60}
                                        required
                                    />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6">Password</label>
                                    <input onChange={ this.onPasswordChange} 
                                        className="b b--black pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                        type="password" 
                                        name="password"  
                                        id="password"
                                        required 
                                    />
                                </div>
                            </fieldset>
                            <div className="">
                                <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib ttc"
                                type="submit"
                                value= { currentRoute } 
                                onClick={ () => this.onSubmitSignIn(currentRoute) }/> {/** We only want to run the function when the button is clicked
                                                                             * That is why we are using arrow function
                                                                             * otherwise it will run when rendering the component
                                                                             */}
                            </div>
                            <div className="lh-copy mt3">
                                <p className="f5 b link black db">{ message }</p>
                                <p onClick={ () => onRouteChange(link) } 
                                        className="f6 link dim black pointer ttc"
                                >{ link }</p>
                            </div>
                    </div>
                    <ToastContainer />
                </main>
            </article>
        );
    }
}

export default SignIn;