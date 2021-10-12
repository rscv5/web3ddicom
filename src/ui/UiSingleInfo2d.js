// ********************************************************
// Imports
// ********************************************************


import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Divider,List } from 'antd';
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

class UiSingleInfo2d extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    /**
     * Main component render func callback
     */
    render(){
        const store = this.props;
        
        // data source
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

        // info list
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
        
        return jsxPatientInfo;
        }
}
export default connect(store => store)(UiSingleInfo2d);
