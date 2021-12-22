/**
 * @author rscv5
 * @version 1.0.0
 */

//*************************************************
// Import
//*************************************************

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Slider, Divider, Card } from 'antd';


// import UiCtrl3dLight from './UiCtrl3d';
import Graphics3d from './Graphics3d';
import Graphics3dtest from './Graphics3dtest';

import StoreActionType from '../store/ActionTypes';
// import ModeView from '../store/ModeView';


//*************************************************
// Const
//*************************************************

//*************************************************
// Class
//*************************************************

class UiMain3d extends React.Component {
    /**
     * Main component render func callback
     */
    constructor(props){
        super(props);
        this.m_updateEnable = true;
    }

    onChangesSliderBrightness =(value) =>{
        this.m_updateEnable = false;
        // const aval = this.refs.sliderBrightness.slider.get();
        const store = this.props;
        store.dispatch({ type: StoreActionType.SET_SLIDER_Brightness, sliderBrightness: Number.parseFloat(value) });
    }

    onChangeSliderQuality=(value)=> {
        this.m_updateEnable = false;
        // const aval = this.refs.sliderQuality.slider.get();
        const store = this.props;
        store.dispatch({ type: StoreActionType.SET_SLIDER_Quality, sliderQuality: Number.parseFloat(value) });    
    }

    onChangeSliderCut =(value)=> {
        this.m_updateEnable = false;
        // const aval = this.refs.sliderCut.slider.get();
        const store = this.props;
        store.dispatch({ type: StoreActionType.SET_SLIDER_Cut, sliderCut: Number.parseFloat(value) });
    }



    shouldComponentUpdate(nextProps){
        let flag = this.m_updateEnable;
        if(this.props.isTool3D !== nextProps.isTool3D || this.props.modeView !== nextProps.modeView){
            flag = true;
        }
        return flag;
    }

    

    render() {
        const store = this.props;
        const sliderBrightness = store.sliderBrightness;
        const sliderCut = store.sliderCut;
        const sliderQuality = store.sliderQuality;

        const wArrBrightness = [sliderBrightness];
        const wArrCut  = [sliderCut];
        const wArrQuality = [sliderQuality];
        // const jsx3dLight = <UiCtrl3dLight></UiCtrl3dLight>;

        const jsxCtrlView =
            <Row key='3d_Ctrl'>
                <Divider orientation='left'>Brightness</Divider>
                <Row key='CtrlBrightness' style={{paddingLeft:'30px', width:'90%'}}>
                    <Col span={24}>
                    <Slider min={0} max={1} step={0.03} defaultValue={wArrBrightness}
                        onChange={this.onChangesSliderBrightness}>
                        </Slider>
                    </Col>
                </Row>

                <Divider orientation='left'>Quality</Divider>
                <Row key='CtrlQuality' style={{paddingLeft:'30px', width:'90%'}}>
                    <Col span={24}>
                    <Slider min={0} max={1} step={0.02} defaultValue={wArrQuality}
                        onChange={this.onChangeSliderQuality}>
                        </Slider>
                    </Col>
                </Row>

                <Divider orientation='left'>Cut</Divider>
                <Row key='CtrlCut' style={{paddingLeft:'30px', width:'90%'}}>
                    <Col span={24}>
                    <Slider min={0} max={1} step={0.01} defaultValue={wArrCut}
                        onChange={this.onChangeSliderCut}>
                        </Slider>
                    </Col>
                </Row>
      
            </Row>

        const MIN_HEIGHT = 882;
        const strMinHeight = {
          minHeight: MIN_HEIGHT.toString() + 'px'
        };
        const jsxRet = <Row>
            <Col xs={24} sm md lg={6}>
                <Card key='card_3d'>
                    {jsxCtrlView}
                </Card>
            </Col>
            <Col xs={24} sm md lg={18} style={strMinHeight}>
                {/* <Graphics3d/> */}
                <Graphics3dtest/>
            </Col>
        </Row>
            
        return jsxRet;
    };
}
export default connect(store => store)(UiMain3d);