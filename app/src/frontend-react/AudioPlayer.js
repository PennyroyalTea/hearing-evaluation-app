import React from "react";
import {Button} from "antd";

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);

        let audio = new Audio(this.props.src)
        audio.onended = this.props.onended;

        this.state = {
            audio: audio,
            clicked: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.src !== this.props.src) {
            let audio = new Audio(this.props.src);
            audio.onended = this.props.onended;
            this.setState({
                audio: audio,
                clicked: false
            })
        }
    }

    handleClick() {
        this.setState({
            clicked: true
        })
        this.state.audio.play()
    }

    render() {
        return (
            <Button
                size='large'
                disabled = {this.state.clicked && this.props.once}
                onClick={() => this.handleClick()}
            >
                Звук
            </Button>
        )
    }
}

export default AudioPlayer;