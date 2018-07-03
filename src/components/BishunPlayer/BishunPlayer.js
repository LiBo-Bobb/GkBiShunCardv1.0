import React, {Component} from 'react';
import fetch from "isomorphic-fetch";
import PinyinSpeaker from '../PinyinSpeaker/PinyinSpeaker';
import BiShunCanvas from '../bishun/BiShunCanvas';
import BuShouSpeaker from '../BuShouSpeaker/BuShouSpeaker'
import './bishunPlayer.css'

export default class BishunPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textInfo: null,
            //笔画数量
            bihuaCount: "",
            //笔顺
            bishun: "",
            //拼音
            pinyin: [],
            //汉字结构
            structure: "",
            //当前的汉字
            currentText: "",
            //音频路径的前缀
            audioSrc: "",
            bishunColor: "#969696",
            //控制笔画结构的颜色
            controlIndex: -1,
            isShowBishun: false,
            //偏旁部首是否是第一轮播放结束
            ifLast: false,
            //当前浏览器是否支持canvas  默认支持
            isSupportCanvas: true,
            //偏旁播放速度 默认1000毫秒
            bushouSpeed: 1000,


        }
    };

    componentDidMount() {
        let {word} = this.props
        if (word) {
            this.getBiShunData(word)
            this.getTextDetailInfo(word)
        }
    }

    //canvas 创建失败
    canvasSupportError = (e) => {
        console.log("canvas创建失败.......", e)

        this.setState({isSupportCanvas: false})


    }

    componentWillUnmount() {
        // console.log('BiShunPlayer卸载.....')
        this.setState({isShowBishun: false})
    }

    //获取笔画动画的数据...

    getBiShunData = (text) => {
        let url = `//bishunfile.gankao.com/${encodeURI(encodeURI(text))}/canvasData.json`;
        let that = this;
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        that.setState({isSupportCanvas: false})
                        console.log("存在一个问题，状态码为：" + response.status);
                        return null;
                    }
                    // console.log("response.....",response)
                    //检查响应文本
                    response.json().then(function (data) {
                        that.setState({textData: data, isShowBishun: true})
                        // console.log("服务器响应的数据....", data)
                    });
                }
            )
            .catch(function (err) {
                console.log("Fetch错误:" + err);
            });
    }

    //获取汉字具体信息
    getTextDetailInfo = (text) => {
        let url = `//bishunfile.gankao.com/${encodeURI(encodeURI(text))}/bishun.json`;
        let that = this;
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        that.setState({isSupportCanvas: false})
                        console.log("存在一个问题，状态码为222：" + response.status);
                        return;
                    }
                    //检查响应文本
                    response.json().then(function (data) {
                        let {bihuaCount, bishun, bushou, pinyin, structure} = data;
                        let src = `http://bishunfile.gankao.com//${encodeURI(encodeURI(text))}/pinyin`
                        that.setState({
                            textInfo: data,
                            bihuaCount,
                            bishun,
                            bushou,
                            pinyin,
                            structure,
                            currentText: text,
                            audioSrc: src,
                            controlIndex: -1,
                        })
                        // console.log("服务器响应的汉字具体数据....", data)
                    });
                }
            )
            .catch(function (err) {
                console.log("Fetch错误:" + err);
            });

    }


    //每个笔画开始的回调函数
    loop = ({loop}) => {
        let {controlIndex} = this.state
        if (loop) {
            this.setState({controlIndex: controlIndex + 1})
        } else {
            // controlIndex = -1
            this.setState({controlIndex: -1, loop: false, ifLast: true})
        }
    }
    //销毁播放器组件
    delComp = () => {
        let {onBishunPlayerClosed} = this.props
        onBishunPlayerClosed()
    }
    controlSpeed = (speed) => {
        console.log("speed.....", speed)
        let speedTemplate = ["fast", "normal", "slow"];
        let obj = {}
        switch (speed) {
            case "fast":
                obj.bushouSpeed = 1000;
                break;
            case "normal":
                obj.bushouSpeed = 1500;
                break;
            default:
                obj.bushouSpeed = 2000;
        }
        console.log("obj.....", obj)
        this.setState({obj})
        //

    }

    render() {
        let {pinyin, textData, bishun, isShowBishun, isSupportCanvas, controlIndex, audioSrc, ifLast, bushouSpeed} = this.state;
        let arrBiShun = bishun.split(",");
        let {word} = this.props
        // console.log("word.....", word)
        // console.log(typeof word)
        let jif = ""
        if (word) {
            jif = `https://bishunfile.gankao.com/${encodeURI(encodeURI(word))}.gif-normal`
        }
        // console.log("jif.......",jif)
        // console.log("isSupportCanvas.....",isSupportCanvas)
        return (<div className="topArea">
            {/*音频播放start*/
            }
            <div className="audioBigBox_gk">
                {pinyin.length
                    ? pinyin.map((item, index) =>
                        <PinyinSpeaker
                            audioSrc={audioSrc}
                            key={"pinyinItem" + index} pinyin={item}
                            index={index}
                        />) : ""
                }
                <div className="delete_comp" onClick={this.delComp}>
                    <img style={{width: "100%"}} src="https://img.gankao.com/market/indexImg/1527506508187.PNG" alt=""/>
                </div>
            </div>
            {/*音频播放end*/
            }


            {/*笔顺动画组件start*/
            }
            {
                isSupportCanvas
                    ? <div
                        style={{
                            textAlign: "center",
                            margin: pinyin.length > 3 ? "0 auto" : "20px auto",
                            paddingBottom: "20px",
                            position: "relative"
                        }}>
                        {(isShowBishun)
                            ? <BiShunCanvas
                                splitDelay={1000}
                                splitCallback={this.loop}
                                fillColor={'#417BEE'}
                                crossColor={'#417BEE'}
                                textFillColor={'#cad8e4'}
                                canvasData={textData}
                                width={200}
                                failCallback={this.canvasSupportError}
                            />
                            : ""}
                        {!isShowBishun &&
                        <div style={{height: '200px', lineHeight: "200px"}}>正在加载中...</div>
                        }
                        {/*偏旁部首start*/}
                        <div style={{
                            marginTop: "15px",
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            width: "65%",
                            margin: "0 auto"
                        }}>
                            {(arrBiShun.length > 0)
                                ? arrBiShun.map((item, index) => {
                                    let condition = controlIndex === index;
                                    let color = condition ? "green" : "#B4B4B4";
                                    return (<span
                                        style={{color, marginRight: "5px"}}
                                        key={"bishun" + index}>
                                    {item}
                                        {!ifLast && <BuShouSpeaker
                                            controlIndex={controlIndex}
                                            isCurrent={condition}
                                            BuShou={item}/>}
                                </span>)
                                })
                                : ""
                            }
                        </div>
                        {/*偏旁部首end*/}
                        {/*偏旁速度控制start*/}
                        <div className="controlSpeed">
                            <div className="speedBtn"
                                 onClick={() => {
                                     this.controlSpeed("fast");
                                 }}>
                                快
                            </div>
                            <div className="speedBtn"
                                 onClick={() => {
                                     this.controlSpeed("normal");
                                 }}>
                                中
                            </div>
                            <div className="speedBtn"
                                 onClick={() => {
                                     this.controlSpeed("slow");
                                 }}>
                                慢
                            </div>
                        </div>
                        {/*偏旁速度控制end*/}
                    </div>
                    : <div style={{width: "200px", margin: "40px auto"}}>
                        {/*如果浏览器不兼容canvas，就使用jif*/}
                        <img style={{width: "100%"}}
                             src={jif} alt=""/>
                    </div>
            }

        </div>)
            ;
    }
}

