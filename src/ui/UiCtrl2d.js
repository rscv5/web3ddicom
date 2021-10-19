// ********************************************************
// Imports
// ********************************************************

// special css for NoUiSlioder
// import 'nouislider/distribute/nouislider.css';

import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Slider, Divider, InputNumber} from 'antd';

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
        // show slice along z axis_ 
        // this.modeTopView = this.modeTopView.bind(this);
        // // show slice along y axis 
        // this.modeFrontView = this.modeFrontView.bind(this);
        // // show slice along x axis
        // this.modeSideView = this.modeSideView.bind(this);

        // this.onMode = this.onMode.bind(this);
        // this.m_updateEnable = true;

        this.state = {
            inputValue:0,
        };
    }

    // onMode(indexMode){
    //     const store = this.props;
    //     const gra2d = store.graphics2d;

    //     this.m_updateEnable = true;
    //     store.dispatch({type:StoreActionType.SET_MODE_2D, mode2d: indexMode });
    //     gra2d.m_mode2d = indexMode;
    //     gra2d.clear();

    //     // build render image 
    //     gra2d.forceUpdate();
    //     // render just builded image
    //     gra2d.forceRender();
    // }

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
        // console.log('>>>>>>value',value)
        this.setState({
            inputValue: value,
        }, function(){
            // console.log('>>>>>>why',this.state.inputValue)
            // console.log('>>>>>>>>>why',this.state.inputValue)
        });
        // clear all 2d tools
        const gra2d = store.graphics2d;

        // re-render (and rebuild segm if present)
        gra2d.forceUpdate();

        // render just builded image
        // gra2d.forceRender();
        
    }

    // shouldComponentUpdate(){
    //     return this.m_updateEnable;
    // }

    
    /**
     * Main component render func callback
     */
    render(){
        const store = this.props;
        // const valSlider = store.slider2d;
        const {inputValue} = this.state;
        const volSet = store.volumeSet;
        let slideRangeMax = volSet.getNumVolumes();
        console.log('>>>>>>>>sliderange',slideRangeMax)
        const jsxSlider = (slideRangeMax > 1) ?
        <Row>
          <Divider orientation='left'>Select Dicom</Divider>
          <Col span={12}>
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
        </Row> : <p></p>;

        const jsxRenderControls =
        <Card key='card_2dimg' title='Plane (Slice) View'>
           {/* {jsxSliceSelector} */}
           {jsxSlider}
        </Card>
        return jsxRenderControls;
    }
}

export default connect(store => store)(UiCtrl2d);