import React, {Component} from 'react';
import './WordList.css';
import BishunPlayer from '../BishunPlayer/BishunPlayer'
import {Helmet} from 'react-helmet';

export default class WordList extends Component {
    constructor(props) {
        super(props)
        //获取书的索引
        let {presspinyin, bookId, wordId} = props.params;
        //获取当前书的数据
        this.currentBookData = window.AllBooksForPress.filter(m => m.presspinyin === presspinyin)[0]["books"][bookId];
        let {book_data: {lesson, courseBanner}, name} = this.currentBookData;
        // console.log("this.currentBookData........", this.currentBookData)
        this.state = {
            //显示de汉字
            currentWord: '',
            //当前汉字的数组
            currentWords: lesson[wordId].words,
            //当前书本的名字
            currentBookName: name,
            //当前课程的名字
            currentLessonName: lesson[wordId].name,
            //课程封面图
            currentCoverImg: courseBanner,
        }
    }

    handleOnBishunPlayerClosed = () => {
        this.setState({currentWord: ''})
    }


    //卸载书本组件
    componentWillUnmount() {
        // console.log('卸载书本组卷........')
    }


    //点击某个汉字 ，将亲北京色变为灰色
    handleClickWord = (word) => {
        // console.log("word....", word)
        let {book_data: {lesson}} = this.currentBookData;

        let {wordId} = this.props.params;
        let tmpWords = lesson[wordId].words;
        // console.log("tmpWords.....", tmpWords)
        for (let i of tmpWords) {
            if (i.word.trim() === word) {
                i.isReaded = true;
            }
        }

        this.setState({currentWords: tmpWords})


    }

    render() {
        let {currentWord, currentWords, currentBookName, currentLessonName, currentCoverImg} = this.state;
        //分别为书本的索引和课时的索引
        // console.log("currentWords.....",currentWords)
        return (
            <div className="TextBoxArea">
                <Helmet>
                    <meta name="gankao_sharable" content="1"/>
                    <meta name="wx_share_title" content={currentBookName}/>
                    <meta name="wx_share_content" content={currentLessonName}/>
                    <meta name="wx_share_link" content={window.location.href}/>
                    <meta name="wx_share_imgurl" content={currentCoverImg}/>
                    <title>
                        {currentBookName}
                    </title>
                </Helmet>
                {/* {!currentWord &&
                <Link to={`/press/${presspinyin}/book/${bookId}`}>
                    <div className="go_back">
                        <span
                            style={{width: "100%", marginRight: "10px", lineHeight: "100%"}}>
                        <img src="https://img.gankao.com/market/indexImg/1528078756956.PNG" alt=""/>
                        </span>
                        返回目录
                    </div>
                </Link>
                }*/}
                {/*书的封面start*/}
                {!currentWord &&
                <div className="bookCover">
                    <div className="leftCoverImg">
                        <img
                            style={{height: "170px", border: "1px solid rgb(251, 245, 245)"}}
                            src={currentCoverImg}
                            alt=""/>
                    </div>
                    <div className="lesson_name_gk">
                        {currentLessonName}
                    </div>
                </div>
                }
                <div style={{height: "10px", backgroundColor: "rgb(248, 248, 248)"}}>
                </div>
                {/*书的封面end*/}
                {currentWord &&
                <BishunPlayer
                    key={'bishunplayer_' + this.state.currentWord}
                    onBishunPlayerClosed={this.handleOnBishunPlayerClosed}
                    word={currentWord}
                />
                }
                {/*灰色线条start*/}
                {currentWord &&
                <div style={{
                    height: "1px",
                    position: "fixed",
                    right: "0",
                    left: "0",
                    top: "338px",
                    maxWidth: "768px",
                    margin: "0 auto",
                    boxShadow: "0 2px 4px #E5E5E5"
                }}>
                </div>}
                {/*灰色线条end*/}
                <div className="WordList" style={{top: currentWord ? "345px" : "215px"}}>
                    {currentWords.length>0? currentWords.map((item, index) => {
                        return <div
                            onClick={() => {
                                this.handleClickWord(item.word.trim())
                                this.setState({currentWord: item.word.trim()})
                            }}
                            className="textItemBox"
                            key={"lesson" + index}>
                            <div
                                style={{
                                    backgroundImage: item.isReaded
                                        ? "url(https://img.gankao.com/market/indexImg/1528448292881.PNG)"
                                        : "url(https://img.gankao.com/market/indexImg/1527057138792.PNG)"

                                }}
                                className="textItem">
                                {item.word}
                            </div>
                        </div>
                    }):<div style={{color:"#666",fontSize:"24px",textAlign:"center"}}>本课暂无生字</div>}
                </div>
            </div>
        )
    }
}