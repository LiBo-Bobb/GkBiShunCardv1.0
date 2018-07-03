import React, {Component} from 'react';
import {Link} from 'react-router';
import './SingleBook.css';
import {Helmet} from 'react-helmet'

export default class SingleBook extends Component {
    constructor(props) {
        super(props);
        //出版社名称和课本索引
        let {presspinyin, bookId} = this.props.params;
        //获取当前书本的信息
        this.courseData = window.AllBooksForPress.filter(m => m.presspinyin === presspinyin)[0]["books"][bookId];
        this.state = {}
    };

    componentDidMount() {

    }


    /**
     * 根据订单id获取订单详细数据
     * @param  {[number]} id [订单ID]
     * @return {[order]}    [订单详细信息]
     */

    render() {
        let {book_data: {courseName, courseDesc, courseBanner, lessonIcon, lesson,}} = this.courseData;
        let {presspinyin, bookId} = this.props.params

        //计算这本书总共多少个汉字wq
        let wordCounts = lesson.reduce((pre, next) => {
            return pre + next["words"].length;
        }, 0)
        // console.log("window.location.href....",window.location.href)
        return (<div className="App">
            <Helmet>
                <meta name="gankao_sharable" content="1"/>
                <meta name="wx_share_title" content={courseName}/>
                <meta name="wx_share_content" content={courseDesc}/>
                <meta name="wx_share_link" content={window.location.href}/>
                <meta name="wx_share_imgurl" content={courseBanner}/>
                <title>
                    {courseName}
                </title>
            </Helmet>
            {this.props.children && this.props.children}
            {!this.props.children && <div style={{backgroundColor: "white",padding:"10px 15px"}}>
                {/*头部banner信息start*/}
                {/* <Link to={`/press/${presspinyin}`}>
                    <div className="goBookList">
                        <span style={{marginRight: "5px"}}>
                            <img src="https://img.gankao.com/market/indexImg/1528078756956.PNG" alt=""/>
                        </span>
                        返回
                    </div>
                </Link>*/}
                <div className="courseTitleArea">
                    <div className="leftCourseImg">
                        <img style={{height: "150px", border: "1px solid #fbf5f5"}} src={courseBanner} alt=""/>
                    </div>
                    <div className="rightTextDesc">
                        <h1 style={{fontSize: "16px", color: "#000000"}}>{courseName}</h1>
                        <div style={{color: "#B4B4B4", fontSize: "14px", marginTop: "5px",}}>{wordCounts}个字</div>
                        <div
                            style={{
                                color: "#B4B4B4",
                                fontSize: "12px",
                                marginTop: "5px"
                            }}>
                            {courseDesc}
                        </div>
                    </div>
                </div>
                <div style={{clear: "both"}}>

                </div>

               {/* <div style={{
                    height: "10px",
                    background: "#F8F8F8",
                    position: "fixed",
                    left: "0",
                    right: "0",
                    top: "180px"
                }}>
                </div>*/}
                {/*头部banner信息end*/}
                <div className="catalogList">

                    {/*目录列表start*/}
                    {lesson.map((item, index) => {
                        return <Link to={`press/${presspinyin}/book/${bookId}/word/${index}`} key={"course" + index}>
                            <div className="catalogItem">
                                <div className="imgIcon"
                                     style={{marginRight: "20px", width: "35px", lineHeight: "100%"}}>
                                    <img style={{width: "100%"}} src={lessonIcon} alt=""/>
                                </div>
                                <div className="textBox">
                                    <div style={{color: "#000000", fontSize: "14px"}}>{item.name}</div>
                                    <div style={{color: "#969696", fontSize: "12px"}}>
                                        {item.words.length}个字
                                    </div>
                                </div>
                            </div>
                        </Link>
                    })}
                </div>
                {/*目录列表end*/}


            </div>}


        </div>);
    }
}

