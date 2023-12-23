import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
    return(
        <div className='center ma'> 
            <div className='absolute mt2'>
                <img src={imageUrl} alt ='submittedImage' className='input-image' id='imageinput'/>
                {
                    boxes.map( (box, index) => (
                        <div className='bounding-box'
                             style = {
                                {
                                    top: box.topRow, 
                                    right: box.rightCol, 
                                    bottom: box.leftRow, 
                                    left: box.leftCol
                                }
                            }
                            key = { index }>        
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default FaceRecognition;