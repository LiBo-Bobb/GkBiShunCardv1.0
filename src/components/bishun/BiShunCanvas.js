/*
* props参数说明
* canvasData    必    从服务器取得的笔顺背景、填充数据
* failCallback  必    canvas创建失败时调用
*
* id            单页面使用超过1次后必    canvas计数器，页面存在多个该组件时使用，默认0，传入1时canvas的id为BSCanvas1
*
* width         选    canvas宽度，默认100
* mode          选    预设的播放模式，默认custom；有fast,slow可选，选择时覆盖drawDelay、splitDelay、loopDelay参数
* drawDelay     选    一个笔顺填充动画的速率（ms），默认100，越大动画越慢
* splitDelay    选    笔顺间的间隔（ms），默认500
* loopDelay     选    循环的间隔（ms），默认1000
* fillColor     选    动画填充的颜色，默认#333
* bgColor       选    背景填充的颜色，默认#fff
* crossColor    选    分割线的颜色，默认#aaa
* textFillColor 选    文字背景填充颜色， 默认#fff
* splitCallback 选    每一个笔画开始前调用，参数loop:boolean，true：笔画循环中，false：一整个笔顺流程结束
* borderWidth   选    边框的宽度，默认1, 0时隐藏
* */

import React from 'react';

export default class BiShunCanvas extends React.Component {
    constructor(props) {
        super(props)
        // console.log("props.....",props)
        const {id = 0, mode = 'custom', drawDelay = 100, splitDelay = 500, loopDelay = 800} = props
        this.state = {
            id: `BSCanvas${id}`,
            drawDelay: mode === 'custom' ? drawDelay : (mode === 'fast' ? 90 : 120),
            splitDelay: mode === 'custom' ? splitDelay : (mode === 'fast' ? 300 : 1000),
            loopDelay: mode === 'custom' ? loopDelay : (mode === 'fast' ? 300 : 1000),
        }
        this.unMounted = false
    }

    componentDidMount() {
        const {failCallback} = this.props

        const canvas = document.getElementById(this.state.id)
        const ctx = canvas.getContext('2d')
        if (!ctx) failCallback()
        else this.drawContainer(ctx)
    }




    //销毁组件
    componentWillUnmount() {
        this.unMounted = true
    }

    componentWillReceiveProps(nextProps){
        // console.log("nextProps.........",nextProps)

    }

    drawContainer = (ctx) => {
        const {width = 100, bgColor = '#fff', borderWidth = 1, crossColor = '#aaa'} = this.props

        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, width, width)
        if (borderWidth) {
            ctx.lineWidth = 1
            ctx.strokeStyle = "#bbb"
            ctx.strokeRect(0, 0, width, width)
        }
        ctx.lineWidth = borderWidth
        ctx.strokeStyle = crossColor
        ctx.setLineDash([5, 8])
        ctx.beginPath()
        ctx.moveTo(width / 2, 0)
        ctx.lineTo(width / 2, width)
        ctx.moveTo(0, width / 2)
        ctx.lineTo(width, width / 2)
        ctx.setLineDash([5, 10])
        ctx.moveTo(0, 0)
        ctx.lineTo(width, width)
        ctx.moveTo(0, width)
        ctx.lineTo(width, 0)
        ctx.stroke()

        this.drawText(ctx)
    }

    drawText = (ctx) => {
        const {canvasData, width = 100, textFillColor = '#fff'} = this.props
        const {textBg} = canvasData

        ctx.lineWidth = 2
        ctx.setLineDash([1])
        ctx.strokeStyle = "#cad8e4"
        ctx.fillStyle = '#cad8e4'
        let GroupLen = textBg.length
        while (GroupLen--) {
            ctx.beginPath()
            let len = 0
            while (len < textBg[GroupLen].length) {
                const x = textBg[GroupLen][len][0] * width / 760
                const y = textBg[GroupLen][len][1] * width / 760
                if (len === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
                len ++
            }
            ctx.closePath()
            ctx.fillStyle = textFillColor
            ctx.fill()
            ctx.stroke()
        }
        ctx.beginPath();
        ctx.closePath();
        ctx.stroke()

        this.drawTextTimeount = setTimeout(() => {
            this.fillAnimation(ctx, 0, 0)
        }, 500)
    }

    fillAnimation = (ctx, groupIndex, partIndex) => {
        if(this.unMounted) return null

        const {canvasData, width = 100, fillColor = '#333', splitCallback} = this.props
        const {drawDelay, splitDelay, loopDelay} = this.state
        const {textFill} = canvasData

        ctx.setLineDash([])
        ctx.lineWidth = 2
        ctx.strokeStyle = fillColor
        ctx.lineJoin = "round"
        ctx.lineCap = "round"

        if (splitCallback && !textFill[groupIndex]) splitCallback({loop: false})
        else if (splitCallback && partIndex === 0) splitCallback({loop: true})

        if (groupIndex >= textFill.length) {
            this.loopTimeount = setTimeout(() => {
                this.drawContainer(ctx)
            }, loopDelay)
        } else {
            const prePartIndex = partIndex;
            partIndex = Math.min(textFill[groupIndex].length, partIndex + 50)

            let len = prePartIndex
            while (len < partIndex) {
                const x = textFill[groupIndex][len][0] * width / 760
                const y = textFill[groupIndex][len][1] * width / 760
                if (len === prePartIndex) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
                len++
            }
            ctx.stroke()

            if (partIndex >= textFill[groupIndex].length) {
                this.fillTimeount = setTimeout(() => {
                    this.fillAnimation(ctx, (groupIndex + 1), 0)
                }, splitDelay)
            } else {
                this.fillTimeount = setTimeout(() => {
                    this.fillAnimation(ctx, groupIndex, partIndex)
                }, drawDelay)
            }
        }
    }


    render() {
        const {width = 100} = this.props
        return <canvas id={this.state.id} width={width} height={width}></canvas>
    }

}