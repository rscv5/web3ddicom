// ********************************************************
// Imports
// ********************************************************


import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Button, Divider,List } from 'antd';
import { InputNumber, Slider} from 'antd';

// range start end 
// import Nouislider from 'react-nouislider';


import Modes2d from '../store/Modes2d';
import StoreActionType from '../store/ActionTypes';
// import { List } from 'antd/lib/form/Form';

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
        const mode2d = store.mode2d;
        const inputValue = this.state.inputValue;

        // const strSlider1 ='slider1';
        const bodyPartExamined = store.dicomInfo.m_bodyPartExamined;
        const patientName = store.dicomInfo.m_patientName;
        const patientBirth = store.dicomInfo.m_patientDateOfBirth.toDateString();
        const patientstudyDate = store.dicomInfo.m_studyDate.toDateString();

        const patientInfo = [
                `PatientName:  ${patientName}`,
                `Body Part:  ${bodyPartExamined}`,
                `Patient Birth:  ${patientBirth}`,
                `Patient Study Date:  ${patientstudyDate}`,
            
        ];

        const varSide = (mode2d === Modes2d.SIDEVIEW) ? 'primary':'secondary';
        const varTop = (mode2d === Modes2d.TOPVIEW) ? 'primary':'secondary';
        const varFront = (mode2d === Modes2d.FRONTVIEW)? 'primary':'secondary';


        let xDim = 0, yDim = 0, zDim=0;
        const volSet = store.volumeSet;
        if(volSet.getNumVolumes() > 0){
            const volIndex = store.volumeIndex;
            const vol = volSet.getVolume(volIndex);
            // console.log('<<<<<<<<<volumes>>>>>>>>>>',vol)
            if(vol !== undefined){
                xDim = vol.m_xDim;
                yDim = vol.m_yDim;
                zDim = vol.m_zDim;
            }
        } 
        // if more 0 volumes
        // slider maximum value is depend on current x or y or z 2d mode selection
        let slideRangeMax = 0;
        if(mode2d === Modes2d.SIDEVIEW){
            slideRangeMax = xDim - 1;
        } else if(mode2d === Modes2d.FRONTVIEW){
            slideRangeMax = yDim - 1;
        } else if(mode2d === Modes2d.TOPVIEW){
            slideRangeMax = zDim - 1;
        }
        const rangeDescr = {
            'min': 0,
            'max': slideRangeMax
        };

        const formatterInt = {
            to(valNum){
                const i = Math.floor(valNum);
                return i.toString();
            },
            from(valStr){
                return parseInt(valStr);
            }
        };

        const jsxSlider = (slideRangeMax > 0)?           
            <Row key='row_group_select_2dimg'>
               <span> Select Image </span> 
                <Col span={12} key='col_group_select_2d'>
                    <Slider 
                        step={1}
                        min={0}
                        max={slideRangeMax}
                        onChange={this.onChangeSliderSlice.bind(this)}/>
                </Col>
                <Col span={4} key='col_group_select_num'>
                    <InputNumber
                        min={0}
                        max={slideRangeMax}
                        style={{ margin: '0 16px' }}
                        value={inputValue}
                        onChange={this.onChangeSliderSlice.bind(this)}/>
                </Col>
            </Row> : <p></p>
        
        const jsxSliderSelector = (slideRangeMax > 0)?
            <Row key='row_select_2dMode' gutter={[8, 8]}>
                <Col key='col_sideView' span={8}>
                    <Button type='primary' onClick={this.modeSideView}>
                        SIDE VIEW
                    </Button>
                </Col>
                <Col key='col_topView' span={8}>
                    <Button type='primary' onClick={this.modeTopView}>
                        TOP VIEW
                    </Button>
                </Col>
                <Col key='col_FrontView' span={8}>
                    <Button type='primary' onClick={this.modeFrontView}>
                        Front VIEW
                    </Button>
                </Col>
            </Row> : <p></p>
        
        const jsxPatientInfo = 
            // <Card title='Dicom Info' key='patient_dicominfo'>
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
            <Card key='card_2dimg' title='Plane (Slice) View'>
                {jsxPatientInfo}
            </Card>
        return jsxRenderControls;
    }
}

export default connect(store => store)(UiCtrl2d);