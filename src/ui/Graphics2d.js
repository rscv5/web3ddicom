// ********************************************************
// Imports
// ********************************************************

import React from 'react';
import { connect } from 'react-redux';


import Tools2dType from '../tools2d/ToolTypes';
import StoreActionType from '../store/ActionTypes';
import ToolDistance from '../tools2d/ToolDistance';
import ToolPick from '../tools2d/ToolPick';


// ********************************************************
// Const
// ********************************************************


const LARGE_NUMBER = 0x3FFFFFFF;
const DEFAULT_WIN_MIN = 650 - 2000 / 2;
const DEFAULT_WIN_MAX = 650 + 2000 / 2;

// ********************************************************
// Class
// ********************************************************

/**
 * Class Graphics2d some text later...
 */
 class Graphics2d extends React.Component{
    /**
     * @param {object} props -props from up level object
     */
    constructor(props){
        super(props);

        // this.m_objCanvas = null;
        this.m_dataMin = LARGE_NUMBER;
        this.m_dataMax = LARGE_NUMBER;

        // this.m_mode2d = Modes2d.FRONTVIEW;
        this.m_sliceRation = 0.5;

        // mounted
        this.m_isMounted = false; 

        // actual render window dimenson
        this.state = {
            wRender: 0,
            hRender: 0,
            stateMouseDown: false,
            xMouse: -1,
            yMouse: -1,

            windowMin: DEFAULT_WIN_MIN,
            windowMax: DEFAULT_WIN_MAX,
        };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        // scale
        this.m_xPos = 0;
        this.m_yPos = 0;

        // tools2d
        this.m_toolDistance = new ToolDistance(this);
        this.m_toolPick = new ToolPick(this);

        // store
        const store = props;
        store.dispatch({ type:StoreActionType.SET_GRAPHICS_2D, graphics2d: this})

    }

    
    componentDidMount(){
        this.m_isMounted = true;

        // detect actual render window dims
        const w = this.m_mount.clientWidth;
        const h = this.m_mount.clientHeight;
        // console.log('>>>>>>>>>h',this.m_mount)
        if(this.state.wRender === 0){
            this.setState({ wRender: w });
            this.setState({ hRender: h });
        }
        this.prepareImageForRender();
    }

    componentWillUnmount() {
        this.m_isMounted = false;
      }
    
    componentDidUpdate() {
        if (this.m_isMounted) {
            const store = this.props;
            const index = store.volumeIndex;
            this.prepareImageForRender(index);
            this.renderReadyImage();
        }
    }


    onMouseDown(evt){
        const box = this.m_mount.getBoundingClientRect();
        const xContainer = evt.clientX - box.left;
        const yConatiner = evt.clientY - box.top;
        const xScr = xContainer;
        const yScr = yConatiner;

        const store = this.props;
        const indexTools2d = store.indexTools2d;
        switch(indexTools2d){
            case Tools2dType.INTENSITY:
                this.m_toolPick.onMouseDown(xScr, yScr, store);
                break;
            case Tools2dType.DISTANCE:
                this.m_toolDistance.onMouseDown(xScr, yScr, store);
                break;
            default:
                // not defined
        } // switch
        // force update
        this.forceUpdate();
    }

    onMouseMove(evt){
        const store = this.props;
        const indexTools2d = store.indexTools2d;
        const box = this.m_mount.getBoundingClientRect();
        const xContainer = evt.clientX - box.left;
        const yConatiner = evt.clientY - box.top;
        const xScr = xContainer;
        const yScr = yConatiner;

        if(indexTools2d === Tools2dType.DISTANCE){
            this.m_toolDistance.onMouseMove(xScr, yScr, store);
        }
    }

    onMouseUp(evt){
        const store = this.props;
        const indexTools2d = store.indexTools2d;
        if(indexTools2d === Tools2dType.DISTANCE){
            const store = this.props;
            const box = this.m_mount.getBoundingClientRect();
            const xScr = evt.clientX - box.left;
            const yScr = evt.clientY - box.top;
            this.m_toolDistance.onMouseUp(xScr, yScr, store);
        }
    }

    // clear all tools
    clear(){
        this.m_toolDistance.clear();
    }


    // update graph2dimg
    forceUpdate(){
        const store = this.props;
        const index = store.volumeIndex;
        this.prepareImageForRender(index);
        this.forceRender();
    }

    forceRender(){
        if(this.m_isMounted){
            this.setState({state: this.state});
        }
    }

    /**
     * Render text info about volume
     * 
     * @param {object} ctx - render context
     * @param {VolumeSet} volSet - volume set to rener
     */
    renderTextInfo(ctx, loaderDicom, volIndex){
        let strMsg;
        let xText = 4;
        let yText = 4;
        const FONT_SZ = 16;
        ctx.font = FONT_SZ.toString() + 'px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'grey';

        strMsg = 'volume dim = ' + loaderDicom.m_xDim.toString() + ' * ' + 
        loaderDicom.m_yDim.toString() + ' * ' + 
        loaderDicom.m_zDim.toString();
        ctx.fillText(strMsg, xText, yText);
        yText += FONT_SZ;

        const xSize = Math.floor(loaderDicom.m_boxSize.x);
        const ySize = Math.floor(loaderDicom.m_boxSize.y);
        strMsg = 'vol phys size = ' + xSize.toString() + ' * ' + 
        ySize.toString()
        ctx.fillText(strMsg, xText, yText);
        yText += FONT_SZ;


    }

    prepareImageForRender(volIndexArg){
        const objCanvas = this.m_mount;
        if(objCanvas === null){
            return;
        }

        const ctx = objCanvas.getContext('2d');
        const w = objCanvas.clientWidth;
        const h = objCanvas.clientHeight;
        if(w * h === 0){
            return;
        }

        this.m_toolDistance.setScreenDim(w, h);
        this.m_toolPick.setScreenDim(w, h);

        const store = this.props;
        ctx.fillStyle = 'rgb(64, 64, 64)';
        ctx.fillRect(0, 0, w, h);


        const volIndex = (volIndexArg !== undefined) ? volIndexArg : 0;

        // destination buffer to write
        const imgData = ctx.createImageData(w, h);
        const dataDst = imgData.data;
        let j = 0;
        // test draw chessboard
        const NEED_TEST_RAINBOW = false;
        if(NEED_TEST_RAINBOW){
            console.log('special rainbow test instead slice render')
            for(let y = 0; y < h; y++){
                for(let x = 0; x < w; x++){
                    let b = Math.floor(255 * x / w);
                    let g = Math.floor(255 * y / h);
                    let r = 50;
                    dataDst[j + 0] = r;
                    dataDst[j + 1] = g;
                    dataDst[j + 2] = b;
                    dataDst[j + 3] = 255;
                    j += 4;
                } // for x
            } // for y
            ctx.putImageData(imgData, 0, 0);
            return;
        }

        const loaderDicom = store.loaderDicom;
        if(loaderDicom === null){
            return;
        }
        const series = loaderDicom.m_slicesVolume.m_series;
        if(series.length === 0){
            return;
        }

        // console.log('>>>>>>>store.loaderDicom',store)
        this.drawSlice(ctx, w, h, imgData, dataDst, series, loaderDicom, volIndex);
        this.renderReadyImage(volIndex);
    }

    drawSlice(ctx, wScreen, hScreen, imgData, dataDst, series, loaderDicom, volIndex){
        const serie = series[0];
        const slices = serie.m_slices;
        const numSlices = slices.length; 
        loaderDicom.m_zDim = numSlices;


        const slice = slices[volIndex];
        if(slice === undefined){
            return;
        }
        const sliceData16 = slice.m_image;
        // console.log('>>>>>>>slice.image',sliceData16)
        const xDim = slice.m_xDim;
        const yDim = slice.m_yDim;
        let maxVal = -LARGE_NUMBER;
        let minVal = +LARGE_NUMBER;
        const xyDim = xDim * yDim;
        const zOff = 0;
        
        // setup pixel size for 2d tools
        const xPixelSize = loaderDicom.m_boxSize.x / xDim;
        const yPixelSize = loaderDicom.m_boxSize.y / yDim;
        this.m_toolDistance.setPixelSize(xPixelSize, yPixelSize);

        let i;
        for(i = 0; i < xyDim; i++){
            let valSrc = sliceData16[i];
            // check big endian
            if(!loaderDicom.m_littleEndian){
                const valBytesSwap = (valSrc >> 8) | ((valSrc << 8) & 0xffff);
                valSrc = valBytesSwap;
            }
            // check pad value
            valSrc = (valSrc === loaderDicom.m_padValue) ? 0 : valSrc;
            const valData = valSrc * loaderDicom.m_rescaleSlope + loaderDicom.m_rescaleIntercept;
            minVal = (valData < minVal) ? valData : minVal;
            maxVal = (valData > maxVal) ? valData : maxVal;
        } // for (i) all slice pixels

        const wMin = this.state.windowMin;
        const wMax = this.state.windowMax;
        const wc = Math.floor((wMax + wMin) * 0.5);
        const ww = wMax - wMin;

        // create temp data array: 8 bit image for this slice
        const dataArray = new Uint8Array(xyDim);
        const winMin = wc - ww * 0.5;
        for(i = 0; i < xyDim; i++){
            let valSrc = sliceData16[i];
            // check big endian 
            if(!loaderDicom.m_littleEndian){
                const valBytesSwap = (valSrc >> 8) | ((valSrc << 8) & 0xffff);
                valSrc = valBytesSwap;
            }
            // check pad value
            valSrc = (valSrc === loaderDicom.m_padValue) ? 0 :valSrc;
            const valScaled = valSrc * loaderDicom.m_rescaleSlope + loaderDicom.m_rescaleIntercept
            
            let val = 0;
            if(loaderDicom.m_rescaleHounsfield){
                // rescale for hounsfield units
                val = Math.floor((valScaled - winMin) * 255 / ww);
            } else{
                // usual (default) rescale
                val = Math.floor(127 + (valScaled - wc) * 128 / (ww / 2));
            }
            val = (val >= 0) ? val : 0;
            val = (val <= 255) ? val : 255;
            dataArray[zOff + i] = val;
        } // for i

        // draw 8 but image into window
        let j = 0;
        const xStep = xDim / wScreen;
        const yStep = yDim / hScreen;
        let ay = 0.0;
        for(let y = 0; y < hScreen; y++, ay += yStep){
            const ySrc = Math.floor(ay);
            const yOff = ySrc * xDim;
            let ax = 0.0;
            for(let x = 0; x < wScreen; x++, ax += xStep){
                const xSrc = Math.floor(ax);
                const val = dataArray[ zOff + yOff + xSrc];
                dataDst[j + 0] = val;
                dataDst[j + 1] = val;
                dataDst[j + 2] = val;
                dataDst[j + 3] = 255; // opacity
                j += 4;
            } // for x
        } // for y
        ctx.putImageData(imgData, 0, 0);
    } // end draw slice

    renderReadyImage(volIndex){

        if(!this.m_isMounted){
            return;
        }
        const objCanvas = this.m_mount;
        if(objCanvas === null){
            return;
        }
        const ctx = objCanvas.getContext('2d');
        const store = this.props;

        const info = store.loaderDicom;
        // render text info
        this.renderTextInfo(ctx, info, volIndex);

        // render all tools
        this.m_toolPick.render(ctx);
        this.m_toolDistance.render(ctx, store);

    }

    /**
     * Main component render func callback
     */
    render(){
        this.m_sliceRation = this.props.sliderValue;
        this.m_mode2d = this.props.mode2d;

        const styleObj = {
            width: '100%',
            height: '100%',
        };

        const jsxGrapNonSized = <canvas ref = {(mount) => {this.m_mount = mount}} style={styleObj}/>
        const jsxGrapSized = <canvas ref = { (mount) => {this.m_mount = mount}} 
                                width = { this.state.wRender } 
                                height = { this.state.hRender }
                                onMouseDown={this.onMouseDown}
                                onMouseUp={this.onMouseUp}
                                onMouseMove={this.onMouseMove}
                                // height="100%"
                                // style={{height:'50%'}}
                            />
        const jsx = (this.state.wRender > 0) ? jsxGrapSized : jsxGrapNonSized;
        return jsx;             
    }
}

export default connect(store => store)(Graphics2d);