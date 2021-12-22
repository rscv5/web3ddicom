// ********************************************************
// Imports
// ********************************************************

// special css for NoUiSlioder
// import 'nouislider/distribute/nouislider.css';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Slider, Divider, InputNumber} from 'antd';

import Modes2d from '../store/Modes2d';
import StoreActionType from '../store/ActionTypes';

import '../css/ui2d.css';

// ********************************************************
// Const
// ********************************************************

// ********************************************************
// Class
// ********************************************************

/**
 * Class UiCtrl2d some text later...
 */
class UiCtrl2d extends React.Component{
    /**
     * @param {object} props -props from up level object
     */

    constructor(props){
        super(props);
        this.state = {
            inputValue:0,
        };
    }


    modeSideView(){
        // siggital
        this.onMode(Modes2d.SIDEVIEW);
    }

    modeTopView(){
        // transverse
        this.onMode(Modes2d.TOPVIEW);
    }

    modeFrontView(){
        // coronal
        this.onMode(Modes2d.FRONTVIEW);
    }

    onChangeSliderSlice=(value)=>{
        if(this.refs === undefined){
            return;
        }

        // this.m_updateEnable = false;
        let val = 0.0;

        const store = this.props;
        // const mode2d = store.mode2d;
        const volSet = store.volumeSet;
        let slideRangeMax = volSet.getNumVolumes();
        const valNormalizedTo01 = val / slideRangeMax;
        store.dispatch({type:StoreActionType.SET_SLIDER_2D, slider2d: valNormalizedTo01});
        store.dispatch({type:StoreActionType.SET_VOLUME_INDEX, volumeIndex: value});
        // set input value number
        this.setState({
            inputValue: value,
        });
        // clear all 2d tools
        const gra2d = store.graphics2d;

        // re-render (and rebuild segm if present)
        gra2d.forceUpdate();

    }
    
    /**
     * Main component render func callback
     */
    render(){
        const store = this.props;
        const {inputValue} = this.state;
        // const volSet = store.volumeSet;
        const loaderDicom = store.loaderDicom;
        let slideRangeMax = loaderDicom.m_numLoadedFiles;
        const jsxSlider = (slideRangeMax > 1) ?
          <Row key='select_dicom_row' style={{paddingLeft:"30px", width:'90%'}}>
          <Col span={20} >
            <Slider min={0} max={slideRangeMax-1} step={1} defaultValue={0} 
                    onChange={this.onChangeSliderSlice}
                    value = {inputValue}
                    />
            </Col>
          <Col span={4}>
            <InputNumber min={0} max={slideRangeMax-1} step={1} defaultValue={0} 
                        value={inputValue} 
                        onChange={this.onChangeSliderSlice} style={{margin: '0 16px'}}/>  
           </Col>
           </Row> 
        : <p></p>;

        const jsxRenderControls =
        <Row key='select2d_row'>
           <Divider orientation='left'>Select Dicom</Divider>
           {/* {jsxSliceSelector} */}
           {jsxSlider}
        </Row>
        return jsxRenderControls;
    }
}

export default connect(store => store)(UiCtrl2d);