// ********************************************************
// Imports
// ********************************************************


import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Divider,List } from 'antd';


import Modes2d from '../store/Modes2d';
import StoreActionType from '../store/ActionTypes';

// ********************************************************
// Const
// ********************************************************

// ********************************************************
// Class
// ********************************************************

class UiCtrl2d extends React.Component {
    /**
     * @param {object} props - props from up level object
     */
    constructor(props){
        super(props);
        // show slice along z axis_ 
        this.modeTopView = this.modeTopView.bind(this);
        // show slice along y axis 
        this.modeFrontView = this.modeFrontView.bind(this);
        // show slice along x axis
        this.modeSideView = this.modeSideView.bind(this);

        this.onMode = this.onMode.bind(this);
        this.m_updateEnable = true;

        this.state={
            inputValue:0,
        }
    }

    onMode(indexMode){
        const store = this.props;
        const gra2d = store.graphics2d;

        this.m_updateEnable = true;
        store.dispatch({type:StoreActionType.SET_MODE_2D, mode2d: indexMode });
        gra2d.m_mode2d = indexMode;
        gra2d.clear();

        // build render image 
        gra2d.forceUpdate();
        // render just builded image
        gra2d.forceRender();
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

    onChangeSliderSlice(value){
        if(this.refs === undefined){
            return;
        }
        this.setState({
            inputValue: value
        });

        this.m_updateEnable = false;
        let val = 0.0;
        const aval = this.refs.slider1.slider.get();
        if(typeof(aval) === 'string'){
            val = Number.parseFloat(aval);
            // console.log(`onSlider. val = ${val}`)
            const store = this.props;
            const mode2d = store.mode2d;
            const volSet = store.volumeSet;
            const volIndex = store.volumeIndex;
            const vol = volSet.getVolume(volIndex);

            let xDim = 0, yDim = 0, zDim = 0;
            if(vol !== null){
                xDim = vol.m_xDim;
                yDim = vol.m_yDim;
                zDim = vol.m_zDim;
            }

            let slideRangeMax = 0;
            if(mode2d === Modes2d.SIDEVIEW){
                slideRangeMax = xDim;
            } else if(mode2d === Modes2d.FRONTVIEW){
                slideRangeMax = yDim;
            } else if(mode2d === Modes2d.TOPVIEW){
                slideRangeMax = zDim;
            }
            const valNormalizedTo01 = val / slideRangeMax;
            store.dispatch({type:StoreActionType.SET_SLIDER_2D, slider2d: valNormalizedTo01});
            // clear all 2d tools
            const gra2d = store.graphics2d;
            gra2d.clear();

            // re-render (and rebuild segm if present)
            gra2d.forceUpdate();

            // render just builded image
            gra2d.forceRender();
        }
    }

    shouldComponentUpdate(){
        return this.m_updateEnable;
    }
    
    /**
     *  Main component render func callback
     */
    render(){
        const store = this.props;
        // const valSlider = store.slider2d;
        // const mode2d = store.mode2d;
        // const inputValue = this.state.inputValue;

        // const strSlider1 ='slider1';
        const bodyPartExamined = store.dicomInfo.m_bodyPartExamined;
        const patientName = store.dicomInfo.m_patientName;
        // const patientBirth = store.dicomInfo.m_patientDateOfBirth.toDateString();
        // const patientstudyDate = store.dicomInfo.m_studyDate.toDateString();

        const patientInfo = [
                `PatientName:  ${patientName}`,
                `Body Part:  ${bodyPartExamined}`,
                // `Patient Birth:  ${patientBirth}`,
                // `Patient Study Date:  ${patientstudyDate}`,    
        ];

        
        const jsxPatientInfo = 
            <Row>
            <Divider orientation='left'>Dicom Info</Divider>
            <List
                bordered
                dataSource={patientInfo}
                renderItem={item =>(
                    <List.Item>
                        {item}
                    </List.Item>
                )}/>
            </Row>
        
            

        const jsxRenderControls =
            <Card key='card_2dimg' title='Plane (Slice) View' style={{height:'300px'}} >
                {jsxPatientInfo}
            </Card>
        return jsxRenderControls;
    }
}

export default connect(store => store)(UiCtrl2d);