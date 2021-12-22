/**
 * @fileoverview Graphics3d rscv5
 * @author rscv5
 * @version 1.0.0
 */

//*********************************************************** */
// Imports
//*********************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import ModeView from '../store/ModeView';
import Modes3d from '../store/Modes3d';
import StoreActionType from '../store/ActionTypes';
import VolumeRenderer3d from './VolumeRenderer3d';

//********************************************************** */
// Class
//********************************************************** *

/**
 * Class Graphics3dtest some text later....
 */
class Graphics3dtest extends React.Component{

    constructor(props){
        super(props);
        this.volume = null;
        this.isLoaded = false;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.m_mount = null;
        this.m_volumeRenderer3D = null;
        this.m_renderer = null;
        this.m_prevMode = Modes3d.RAYCAST;

        // settings
        this.m_fileDataType = {
            thresholdIsosurf: 0.46,
            thresholdTissue1: 0.09,
            thresholdTissue2: 0.30,
            opacityTissue: 0.53,
            startRotX: -Math.PI * 0.5,
            startRotY: Math.PI,
            lightDirComp: -0.5773,
            brightness: 0.56,
        };

        // actual render window dimenison
        this.state = {
            wRender: 0,
            hRender: 0,
        }
    }

    setVolRenderToStore(VolRender){
        const store = this.props;
        store.dispatch({type: StoreActionType.SET_VOLUME_Renderer, volumeRenderer: VolRender});
        store.dispatch({type: StoreActionType.SET_SLIDER_3DR, slider3d_r: Number.parseFloat(0.09)});
        store.dispatch({type: StoreActionType.SET_SLIDER_3DG, slider3d_g: Number.parseFloat(0.3)});
        store.dispatch({type: StoreActionType.SET_SLIDER_3DB, slider3d_b: Number.parseFloat(0.46)});
        store.dispatch({type: StoreActionType.SET_SLIDER_Opacity, sliderOpacity: Number.parseFloat(0.53)});
        store.dispatch({type: StoreActionType.SET_SLIDER_Isosurface, sliderIsosurface: Number.parseFloat(0.46)});
        store.dispatch({type: StoreActionType.SET_SLIDER_Brightness, sliderBrightness: Number.parseFloat(0.56)});
        store.dispatch({type: StoreActionType.SET_SLIDER_Cut, sliderCut: Number.parseFloat(1.0)});
        store.dispatch({type: StoreActionType.SET_SLIDER_Quality, sliderQuality: Number.parseFloat(0.35)});   
    }


    componentDidMount(){
        // detect actual render window dims
        const MIN_DIM = 200;
        const w = (this.m_mount.clientWidth > 0) ? this.m_mount.clientWidth : MIN_DIM;
        const h = (this.m_mount.clientHeight > 0) ? this.m_mount.clientHeight : MIN_DIM;
        if(this.state.wRender === 0){
            this.setState({ wRender : w });
            this.setState({ hRender : h });
        }

        if(this.m_volumeRenderer3D === null){
            this.m_volumeRenderer3D = new VolumeRenderer3d({
                curFileDataType: this.m_fileDataType,
                width: w,
                height: h,
                mount: this.m_mount
            });
        }
        this.setVolRenderToStore(this.m_volumeRenderer3D);
    }

    _onMouseMove(e){
        if(this.m_volumeRenderer3D !== null){
            const box = this.m_mount.getBoundingClientRect();
            const containerX = e.clientX - box.left;
            const containerY = e.clientY - box.top;
            this.m_volumeRenderer3D.onMouseMove(containerX, -(this.state.hRender - containerY), this.props.ereaseStart);
        }
    }

    _onMouseDown(e){
        if(this.m_volumeRenderer3D !== null){
            const box = this.m_mount.getBoundingClientRect();
            const containerX = e.clientX - box.left;
            const containerY = e.clientY - box.top;
            this.m_volumeRenderer3D.onMouseDown(containerX, -(this.state.hRender - containerY), this.props.ereaseStart);
        }
    }

    _onMouseUp(){
        if(this.m_volumeRenderer3D !== null){
            this.m_volumeRenderer3D.onMouseUp();
        }
    }

    _onWheel(e){
        if(this.m_volumeRenderer3D !== null){
            this.m_volumeRenderer3D.onMouseWheel(e);
        }
    }

    onClick(evt){
        evt.stopPropagation();
    }

    onTouchStart(evt){
        if((this.m_mount !== undefined) && (this.m_mount !== null)){
            const touches = evt.changedTouches;
            const numTouches = touches.length;
            if(numTouches >= 2){
                console.log(`onTouchStart. numTouches == 2`)
            }
            if(numTouches >= 1){
                const box = this.m_mount.getBoundingClientRect();
                const x = touches[numTouches -1].pageX - box.left;
                const y = touches[numTouches -1].pageY - box.top;
                if(this.m_volumeRenderer3D !== null){
                    this.m_volumeRenderer3D.onMouseDown(x, this.state.hRender - y, this.props.ereaseStart);
                }
            }
        }
    }

    onTouchMove(evt){
        if((this.m_mount !== undefined) && (this.m_mount !== null)){
            const touches = evt.changedTouches;
            const numTouches = touches.length;
            if(numTouches >= 2){
                console.log(`onTouchStart. numTouches == 2`);
            }
            if(numTouches >= 1){
                const box = this.m_mount.getBoundingClientRect();
                const x = touches[numTouches -1].pageX - box.left;
                const y = touches[numTouches -1].pageY - box.top;
                if(this.m_volumeRenderer3D !== null){
                    this.m_volumeRenderer3D.onMouseMove(x, this.state.hRender - y, this.props.ereaseStart);
                }
            }
        }
    }

    onTouchEnd(){
        if(this.m_volumeRenderer3D !== null){
            this.m_volumeRenderer3D.onMouseUp();
        }
    }

    onKeyDown(evt){
        const key = evt.key;
        if(key === 'Control'){
            console.log('Ctrl key was pressed');
            const store = this.props;
            store.volumeRenderer.setEraserStart(true);
        }
    }

    onKeyUp(evt){
        const key = evt.key;
        if(key === 'Control'){
            console.log('Ctrl key was released');
            const store = this.props;
            store.volumeRenderer.setEraserStart(false);
        }
    }

    /**
     * Main component render func callback
     */
    render(){
        const store = this.props;
        let vol = null;
        const volSet = store.volumeSet;
        const vols = volSet.m_volumes;
        const numVols = vols.length;
        const loaderDicom = store.loaderDicom;
        const series = loaderDicom.m_slicesVolume.m_series;
        if(numVols > 0){
            const  volIndex = store.volumeIndex;
            const  serie = series[0];
            const  slices = serie.m_slices;
            vol = slices[volIndex];
        }
        if(vol !== null){
            this.volume = vol;
        }

        const ZCUTSHIFT = 0.5;
        const mode3d = store.mode3d;
        if(this.m_volumeRenderer3D !== null){
            this.m_preMode = Modes3d.RAYFAST;
            this.m_volumeRenderer3D.switchToFLATRender();
            this.m_volumeRenderer3D.setOpacityBarrier(store.sliderOpacity);
            this.m_volumeRenderer3D.updateBrightness(store.sliderBrightness);
            this.m_volumeRenderer3D.updateZCutPlane(store.sliderCut - ZCUTSHIFT);
            this.m_volumeRenderer3D.setStepsize(store.sliderQuality);
            this.m_volumeRenderer3D.updateContrast(store.sliderContrast3D);
        }
        if(this.m_volumeRenderer3D !== null){
            this.m_volumeRenderer3D.render();
        }

        const styleObj = {
            width: '500px',
            height: '500px',
        }

        const jsxCanvasNonSized = <div
            // styleObj ={styleObj}
            width={this.state.wRender} height={this.state.hRender}
            ref={ (mount) => {this.m_mount = mount} }
            onMouseMove = { this._onMouseMove.bind(this) }
            onMouseDown = { this._onMouseDown.bind(this) }
            onMouseUp = { this._onMouseUp.bind(this) }
            onTouchStart = { this.onTouchStart.bind(this) }
            onTouchEnd = { this.onTouchEnd.bind(this) }
            onTouchMove = { this.onTouchMove.bind(this) }
            onClick = { this.onClick.bind(this) }
            onWheel = { this._onWheel.bind(this) } />
        const jsxCanvasSized = <div
            width={this.state.wRender} height={this.state.hRender}
            ref={ (mount) => {this.m_mount = mount }}
            onMouseMove = {this._onMouseMove.bind(this)}
            onMouseDown = {this._onMouseDown.bind(this)}
            onTouchStart = {this.onTouchStart.bind(this)}
            onTouchEnd = {this.onTouchEnd.bind(this)}
            onTouchMove = {this.onTouchMove.bind(this)}
            onClick = {this.onClick.bind(this)}
            tabIndex = '1'
            onKeyDown = {(evt) => this.onKeyDown(evt)}
            onKeyUp = {(evt) => this.onKeyUp(evt)}
            onWheel = { this._onWheel.bind(this) } />
        const jsx = (this.state.wRender > 0) ? jsxCanvasSized : jsxCanvasNonSized;
        return jsx;
    }
}

export default connect(store => store)(Graphics3dtest);