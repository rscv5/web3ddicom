// ********************************************************
// Imports
// ********************************************************

import React from 'react';
import { connect } from 'react-redux';

import Modes2d from '../store/Modes2d';
import StoreActionType from '../store/ActionTypes';


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

        this.m_mode2d = Modes2d.FRONTVIEW;
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

        // store
        const store = props;
        store.dispatch({ type:StoreActionType.SET_GRAPHICS_2D, graphics2d: this})

    }

    drawSlice(ctx, wScreen, hScreen, imgData, dataDst, series, loaderDicom) {

        const serie = series[0];
        const slices = serie.m_slices;
        const numSlices = slices.length;
        // console.log('>>>>>>>>>>>>>>>>>>',numSlices);
    
        // // sort slices via slice location OR slice number
        // let minSliceNum = slices[0].m_sliceNumber;
        // let maxSliceNum = slices[0].m_sliceNumber;
        // for (let s = 0; s < numSlices; s++) {
        //   const num = slices[s].m_sliceNumber;
        //   minSliceNum = (num < minSliceNum) ? num : minSliceNum;
        //   maxSliceNum = (num > maxSliceNum) ? num : maxSliceNum;
        // }
        // const difSlceNum = maxSliceNum - minSliceNum;
        // if (difSlceNum > 0) {
        //   // sort slices by slice number (read from dicom tag)
        //   slices.sort((a, b) => {
        //     const zDif = a.m_sliceNumber - b.m_sliceNumber;
        //     return zDif;
        //   });
        // } else {
        //   // sort slices by slice location (read from diocom tag)
        //   slices.sort((a, b) => {
        //     const zDif = a.m_sliceLocation - b.m_sliceLocation;
        //     return zDif;
        //   });
        // }
        // assign new slice numbers according accending location
        let ind = 0;
        // for (let s = 0; s < numSlices; s++) {
        //   slices[s].m_sliceNumber = ind;
        //   ind++;
        // }
        // loaderDicom.m_zDim = numSlices;
    
        // const indexCenter = Math.floor(ind);
     
        const slice = slices[ind];
        // console.log('>>>>>>>>',slice.m_image)
        if(slice.m_image === undefined){
            return;
        }
        const sliceData16 = slice.m_image;
        const xDim = slice.m_xDim;
        const yDim = slice.m_yDim;
        let maxVal = -LARGE_NUMBER;
        let minVal = +LARGE_NUMBER;
        const xyDim = xDim * yDim;
        const zOff = 0;
        let i;
        for (i = 0; i < xyDim; i++) {
          let valSrc = sliceData16[i];
          // check big endian
          if (!loaderDicom.m_littleEndian) {
            const valBytesSwap = (valSrc >> 8) | ((valSrc << 8) & 0xffff);
            valSrc = valBytesSwap;
          }
          // check pad value
          valSrc = (valSrc === loaderDicom.m_padValue) ? 0 : valSrc;
          // console.log('valSrc', loaderDicom.m_littleEndian, loaderDicom.m_padValue, valSrc)
          
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
        for (i = 0; i < xyDim; i++) {
          let valSrc = sliceData16[i];
          // check big endian
          if (!loaderDicom.m_littleEndian) {
            const valBytesSwap = (valSrc >> 8) | ((valSrc << 8) & 0xffff);
            valSrc = valBytesSwap;
          }
          // check pad value
          valSrc = (valSrc === loaderDicom.m_padValue) ? 0 : valSrc;
          const valScaled = valSrc * loaderDicom.m_rescaleSlope + loaderDicom.m_rescaleIntercept;
    
          let val = 0;
          if (loaderDicom.m_rescaleHounsfield) {
            // rescale for hounsfield units
            val = Math.floor((valScaled - winMin) * 255 / ww);
          } else {
            // usual (default) rescale
            val = Math.floor(127 + (valScaled - wc) * 128 / (ww / 2));
          }
          val = (val >= 0) ? val : 0;
          val = (val < 255) ? val : 255;
          dataArray[zOff + i] = val;
        } // for i
    
        // draw 8 but image into window
        let j = 0;
        const xStep = xDim / wScreen;
        const yStep = yDim / hScreen;
        let ay = 0.0; 
        for (let y = 0; y < hScreen; y++, ay += yStep) {
          const ySrc = Math.floor(ay);
          const yOff = ySrc * xDim;
          let ax = 0.0;
          for (let x = 0; x < wScreen; x++, ax += xStep) {
            const xSrc = Math.floor(ax);
            const val = dataArray[zOff + yOff + xSrc];
            dataDst[j + 0] = val;
            dataDst[j + 1] = val;
            dataDst[j + 2] = val;
            dataDst[j + 3] = 255; // opacity
            j += 4;
          } // for x
        } // for y
        ctx.putImageData(imgData, 0, 0);
      } // end draw slice

    
    componentDidUpdate(){
        this.prepareImageForRender();
        // this.renderReadyImage();
    }

    // componentWillUnmount(){
    //     this.props.onRef(undefined);
    // }


    componentDidMount(){
        this.m_isMounted = true;

        this.prepareImageForRender();
        this.renderReadyImage();

        // detect actual render window dims
        const w = this.m_mount.clientWidth;
        const h = this.m_mount.clientHeight;
        // const w = 500;
        // const h = 500;

        if(this.state.wRender === 0){
            this.setState({ wRender: w });
            this.setState({ hRender: h });
        }
    }
    /**
     * Render text info about volume
     * 
     * @param {object} ctx - render context
     * @param {VolumeSet} volSet - volume  set to render
     */
    renderTextInfo(ctx, loaderDicom){

        let strMsg;
        let xText = 4;
        let yText = 4;
        const FONT_SZ = 16;
        ctx.font = FONT_SZ.toString() + 'px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'grey';

        strMsg = 'volume dim =' + loaderDicom.m_xDim.toString() + "*" + 
                loaderDicom.m_yDim.toString() + '*' +
                loaderDicom.m_zDim.toString();
        ctx.fillText(strMsg, xText, yText);
        yText += FONT_SZ;

        const xSize = Math.floor(loaderDicom.m_boxSize.x);
        const ySize = Math.floor(loaderDicom.m_boxSize.y);
        // const zSize = Math.floor(loaderDicom.m_boxSize.z);
        strMsg = 'vol size =' + xSize.toString() + ' * ' +
            ySize.toString() + ' * ' +
            // zSize.toString();
        ctx.fillText(strMsg, xText, yText);
        yText += FONT_SZ;

    }

    prepareImageForRender(){
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

        const store = this.props;

        // clear screen
        ctx.fillStyle='rgb(40, 40, 40)';
        ctx.fillRect(0, 0, w, h);

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
        
        this.drawSlice(ctx, w, h, imgData, dataDst, series, loaderDicom);
        this.renderReadyImage();

        
    } // prepareImageForRender

    renderReadyImage(){
        if(!this.m_isMounted){
            return;
        }

        const objCanvas = this.m_mount;
        if(objCanvas === null){
            return;
        }
        const ctx = objCanvas.getContext('2d');
        const store = this.props;

        const loaderDicom = store.loaderDicom;
        
        this.renderTextInfo(ctx,loaderDicom)
    }

    /**
     * Invoke forced rendering, after some tool visual changes
     */
    forceUpdate(){
        this.prepareImageForRender();
        this.forceRender();
    }

    forceRender(){
        if(this.m_isMounted){
            this.setState({state:this.state});
        }
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

        // console.log('>>>>>>>>>>>>>',this.state.wRender, this.state.hRender)
        
        const jsxGrapNonSized = <canvas ref={ (mount) => {this.m_mount = mount} } style={styleObj} />
        const jsxGrapSized = <canvas ref= { (mount) => {this.m_mount = mount}} width={this.state.wRender}
                            height={this.state.hRender}/>
        const jsx = (this.state.wRender > 0) ? jsxGrapSized: jsxGrapNonSized;


        return jsx;
    }
}

export default connect(store => store)(Graphics2d);