import React, { Component} from 'react';
import './App.css';
import Video from './video';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {call: "End Call", hold: "Hold", holdDisplay: false};

        // This binding is necessary to make `this` work in the callback
        this.endCall = this.endCall.bind(this);
        this.pauseCall = this.pauseCall.bind(this);
    }

    endCall(){
        console.log("endCall");
        if (this.state.call === "End Call"){
            this.setState({
                holdDisplay: true,
                call: 'Call'
            });
        }
        else {
            this.setState({
                holdDisplay: false,
                hold: "Hold",
                call: 'End Call'
            });
        }
    }

    pauseCall(){
        console.log("pauseCall");
        if (this.state.hold === "Hold"){
            this.setState({
                hold: 'Resume'
            });
        }
        else{
            this.setState({
                hold: 'Hold'
            });
        }
    }

    render() {
        const holdStyle = this.state.holdDisplay ? {display: 'none'} : {};
        return (
            <React.Fragment>
                  <div className="App">
                      <button onClick = {this.endCall}>{this.state.call}</button>
                      <button onClick ={this.pauseCall} style={holdStyle}>{this.state.hold}</button>
                  </div>
                <Video/>

            </React.Fragment>

        );
     }
}

export default App;
