import React, { Component } from 'react';
import { Emoji } from 'emoji-mart'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
const fs = require('fs');
const path = require('path');


class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {img: ""};
    }

    decode(base64str , filename){
        var buf = Buffer.from(base64str,'base64');

        fs.writeFile(path.join(__dirname,'/public/',filename), buf, function(error){
            if(error){
                throw error;
            }else{
                console.log('File created from base64 string!');
                return true;
            }
        });

    }
    onTakePhoto (dataUri) {
        console.log('takePhoto');
        console.log(dataUri);

        this.decode(dataUri,'rane.jpg');

        this.setState({
            img: dataUri
        });
    }

    onCameraError (error) {
        console.error('onCameraError', error);
    }

    onCameraStart (stream) {
        console.log('onCameraStart');
    }

    onCameraStop () {
        console.log('onCameraStop');
    }

    render () {
        return (
            <div>
                <Camera
                    onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                    onCameraError = { (error) => { this.onCameraError(error); } }
                    idealFacingMode = {FACING_MODES.ENVIRONMENT}
                    idealResolution = {{width: 640, height: 480}}
                    imageType = {IMAGE_TYPES.JPG}
                    imageCompression = {0.97}
                    isMaxResolution = {false}
                    isImageMirror = {false}
                    isDisplayStartCameraError = {true}
                    sizeFactor = {1}
                    onCameraStart = { (stream) => { this.onCameraStart(stream); } }
                    onCameraStop = { () => { this.onCameraStop(); } }
                />
                <img src={this.state.img}></img>
                <Emoji emoji={{ id: 'grinning', skin: 3 }} size={100} />
            </div>
        );
    }
}

export default Video;