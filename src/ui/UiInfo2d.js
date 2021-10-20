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
        // // show slice along z axis_ 
        // this.modeTopView = this.modeTopView.bind(this);
        // // show slice along y axis 
        // this.modeFrontView = this.modeFrontView.bind(this);
        // // show slice along x axis
        // this.modeSideView = this.modeSideView.bind(this);

        // this.onMode = this.onMode.bind(this);
        // this.m_updateEnable = true;

        // this.state={
            // inputValue:0,
        // }
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

    // modeSideView(){
    //     // siggital
    //     this.onMode(Modes2d.SIDEVIEW);
    // }

    // modeTopView(){
    //     // transverse
    //     this.onMode(Modes2d.TOPVIEW);
    // }

    // modeFrontView(){
    //     // coronal
    //     this.onMode(Modes2d.FRONTVIEW);
    // }



    // shouldComponentUpdate(){
    //     return this.m_updateEnable;
    // }
    
    /**
     *  Main component render func callback
     */
    render(){
        const store = this.props;
        // const strSlider1 ='slider1';
        const loaderDicom = store.loaderDicom;
        const dicomInfo = loaderDicom.m_dicomInfo; 
        
        const bodyPartExamined = dicomInfo.m_bodyPartExamined;
        const patientName = dicomInfo.m_patientName;
        const institutionName = dicomInfo.m_institutionName;
        const patientBirth = dicomInfo.m_patientDateOfBirth;
        // console.log()

        const patientInfo = [
                `PatientName:  ${patientName}`,
                `Body Part:  ${bodyPartExamined}`,
                `Institution: ${institutionName}`,

                `Patient Birth:  ${patientBirth}`,
                // `Patient Study Date:  ${patientstudyDate}`,    
        ];

        
        const jsxPatientInfo =
        <Row style={{ padding:'20px', paddingLeft:'10%'}} key='dicom2d_info_list'>
            <List
                bordered
                dataSource={patientInfo}
                renderItem={item =>(
                    <List.Item>
                        {item}
                    </List.Item>
                )}
                key='dicom_list'
                style={{width:'100%'}}
                />
        </Row>
        
            

        const jsxRenderControls =
            <Row key='dicom2d_info_row' style={{paddingTop:'10px'}}>
                <Divider orientation='left'>Dicom Info</Divider>
                {jsxPatientInfo}
            </Row>
        return jsxRenderControls;
    }
}

export default connect(store => store)(UiCtrl2d);