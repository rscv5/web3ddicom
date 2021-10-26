
//*********************************************
//            Class
//*********************************************

class ToolPick {
    constructor(objGra){
        this.m_objGraphics2d = objGra;
        this.m_wScreen = 0;
        this.m_hScreen = 0;
        this.m_strMessage = '';
        this.m_xMessage = 0;
        this.m_yMessage = 0;
        this.m_timeStart = 0;

        this.onTimerEnd = this.onTimerEnd.bind(this);
    }

    onTimerEnd() {
        this.m_objGraphics2d.forceUpdate();
    }

    setScreenDim(wScr, hScr){
        this.m_wScreen = wScr;
        this.m_hScreen = hScr;
    }

    /**
     * 
     * @param {number} xScr - relative x screen position [0..1] 
     * @param {number} yScr - relative y screen position [0..1]
     * @param {object} store 
     * @returns 
     */

    screenToTexture(xScr, yScr, store){
        const vTex = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        };

        // const series = store.loaderDicom.m_slicesVolume.m_series;
        // const serie = series[0];
        // const slices = serie.m_slices;
        // const index = store.volumeIndex;
        // const slice = slices[index];
        // if(slice === undefined){
        //     return;
        // }
        // const xDim = slice.m_xDim;
        // const yDim = slice.m_yDim;
        // const zDim = slice.m_zDim;
        const loaderDicom  = store.loaderDicom;
        const xDim = loaderDicom.m_boxSize.x;
        const yDim = loaderDicom.m_boxSize.y;
        const zDim = loaderDicom.m_zDim;


        const xPos = store.render2dxPos;
        const yPos = store.render2dyPos;

        // set vtex
        vTex.x = Math.floor((xPos + xScr) * xDim);
        vTex.y = Math.floor((yPos + yScr) * yDim);
        vTex.z = Math.floor(zDim);

        return vTex;
    }

    onMouseDown(xScr, yScr, store){
        if((this.m_wScreen === 0) || (this.m_hScreen === 0)){
            console.log('ToolPick. onMouseDown. Bad screen size');
            return;
        }

        const xRatioImage = xScr / this.m_wScreen;
        const yRatioImage= yScr / this.m_hScreen;

        if((xRatioImage > 1.0) || (yRatioImage > 1.0)){
            // out if render image
            return;
        }
        const vTex = this.screenToTexture(xRatioImage, yRatioImage, store);

        this.m_xMessage = xScr;
        this.m_yMessage = yScr;
        this.m_strMessage = 'x, y, z : ' +(vTex.x).toString() + ',' + (vTex.y).toString() 
                                + ', ' + (vTex.z).toString();
              
        this.m_timeStart  = Date.now();
        setTimeout(this.onTimerEnd, 1500);

    }


    render(ctx){
        if(this.m_timeStart === 0){
            return;
        }
        const TIME_SHOW_MS = 1200;
        const timeCur = Date.now();
        const timeDelta = timeCur - this.m_timeStart;
        if(timeDelta < TIME_SHOW_MS){
            // render message
            ctx.fillStyle = 'white';
            const FONT_SZ = 16;
            ctx.font = FONT_SZ.toString() + 'px Arial';
            const sizeTextRect = ctx.measureText(this.m_strMessage);
            if(this.m_xMessage + sizeTextRect.width < this.m_wScreen){
                ctx.textAlign = 'left';
            } else{
                ctx.textAlign = 'right';
            }
            if(this.m_yMessage + FONT_SZ < this.m_hScreen){
                ctx.textBaseline = 'top';
            } else{
                ctx.textBaseline = 'bottom';
            }

            ctx.fillText(this.m_strMessage, this.m_xMessage, this.m_yMessage);
        }
    }
}
export default ToolPick;