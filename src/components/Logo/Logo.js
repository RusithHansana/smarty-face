import React from "react";
import Tilt from 'react-parallax-tilt';
import logo from './logo.png'
import './Logo.css'

const Logo = () => {
    return(
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2">
                <img src= {logo} alt="logo" className="logo"></img>         
            </Tilt>
            <div className="links">
                <p>
                    <a href="https://icons8.com/icon/48369/brain">Brain </a> 
                    Icon by 
                    <a href="https://icons8.com"> Icons8</a>
                </p>
            </div>
        </div>
    );
}

export default Logo;