import React, {Component} from 'react';

export default class PinyinSpeaker extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {

    }

    //销毁组件
    componentWillUnmount() {
        // console.log('componentDidUnMount.....')
    }


    render() {
        let {pinyin, index, audioSrc} = this.props
        return (<div
            className="audioBox_gk">
            <div className="audioPinyin">
                {pinyin}
            </div>
            <div
                onClick={() => {
                    if (index === 0) {
                        this.refs.audio0.play()
                    } else if (index === 1) {
                        this.refs.audio1.play()
                    } else if (index === 2) {
                        this.refs.audio2.play()
                    } else if (index === 3) {
                        this.refs.audio3.play()
                    } else if (index === 4) {
                        this.refs.audio4.play()
                    } else if (index === 5) {
                        this.refs.audio5.play()
                    } else if (index === 6) {
                        this.refs.audio6.play()
                    }
                }}
                className="textAudion">
                <img
                    style={{width: "100%"}}
                    src="https://img.gankao.com/market/indexImg/1527126873904.PNG"
                    alt="小喇叭"/>
                <audio ref={`audio${index}`}
                       src={`${audioSrc}${index}.mp3`}>
                    该浏览器暂不支持音频
                </audio>
            </div>
        </div>);
    }
}

