import React, {Component} from 'react';
import {Link} from 'react-router';
import './pressList.css';
import {Helmet} from 'react-helmet';

export default class WordList extends Component {
    constructor(props) {
        super(props)
        this.bishun_data = window.AllBooksForPress;
        this.state = {}
    }

    componentDidMount() {
    }


    render() {

        // console.log("this.props.children........", this.props.children)
        return (
            <div className="bookListBox">
                <Helmet>
                    <title>
                        出版社目录
                    </title>
                </Helmet>
                {this.props.children && this.props.children}
                {!this.props.children &&
                <div>
                    {this.bishun_data.map((item, index) => {
                        return <Link key={"press" + index} to={`/press/${item.presspinyin}`}>
                            <div className="pressItem">
                                {item.pressname}
                            </div>

                        </Link>

                    })}


                </div>
                }


            </div>
        )
    }
}