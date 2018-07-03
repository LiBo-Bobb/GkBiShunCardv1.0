import React, {Component} from 'react';

let audioDemo = "https://bishunfile.gankao.com/"

const BuShouAudio =
    {
        "点": audioDemo + encodeURI("点") + ".mp3",
        "横": audioDemo + encodeURI("横") + ".mp3",
        "横钩": audioDemo + encodeURI("横钩") + ".mp3",
        "横撇": audioDemo + encodeURI("横撇") + ".mp3",
        "横撇弯钩": audioDemo + encodeURI("横撇弯钩") + ".mp3",
        "横斜钩": audioDemo + encodeURI("横斜钩") + ".mp3",
        "横折": audioDemo + encodeURI("横折") + ".mp3",
        "横折钩": audioDemo + encodeURI("横折钩") + ".mp3",
        "横折弯": audioDemo + encodeURI("横折弯") + ".mp3",
        "横折弯": audioDemo + encodeURI("横折弯") + ".mp3",
        "横折弯钩": audioDemo + encodeURI("横折弯钩") + ".mp3",
        "横折折撇": audioDemo + encodeURI("横折折撇") + ".mp3",
        "横折折折钩": audioDemo + encodeURI("横折折折钩") + ".mp3",
        "捺": audioDemo + encodeURI("捺") + ".mp3",
        "撇": audioDemo + encodeURI("撇") + ".mp3",
        "撇点": audioDemo + encodeURI("撇点") + ".mp3",
        "撇折": audioDemo + encodeURI("撇折") + ".mp3",
        "竖": audioDemo + encodeURI("竖") + ".mp3",
        "竖钩": audioDemo + encodeURI("竖钩") + ".mp3",
        "竖提": audioDemo + encodeURI("竖提") + ".mp3",
        "竖弯": audioDemo + encodeURI("竖弯") + ".mp3",
        "竖弯钩": audioDemo + encodeURI("竖弯钩") + ".mp3",
        "竖折": audioDemo + encodeURI("竖折") + ".mp3",
        "竖折撇": audioDemo + encodeURI("竖折撇") + ".mp3",
        "竖折折钩": audioDemo + encodeURI("竖折折钩") + ".mp3",
        "提": audioDemo + encodeURI("提") + ".mp3",
        "弯钩": audioDemo + encodeURI("弯钩") + ".mp3",
        "弯折": audioDemo + encodeURI("弯折") + ".mp3",
        "斜钩": audioDemo + encodeURI("斜钩") + ".mp3",
        "折撇": audioDemo + encodeURI("折撇") + ".mp3",
        "折折钩": audioDemo + encodeURI("折折钩") + ".mp3"
    }

export default class PinyinSpeaker extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {

        if (this.refs.music) {
            this.refs.music.addEventListener("WeixinJSBridgeReady", function () {
                this.refs.music.audio.play();
            }, false);

        }


    }

    //销毁组件
    componentWillUnmount() {
    }

    render() {
        let {BuShou, isCurrent} = this.props;

        return (<div>
            <div>
                {isCurrent ?
                    <audio
                        ref={isCurrent ? "music" : ""}
                        autoPlay={isCurrent}
                        src={BuShouAudio[BuShou]}
                    >
                        该浏览器暂不支持音频
                    </audio> : ""}

            </div>
        </div>);
    }
}

