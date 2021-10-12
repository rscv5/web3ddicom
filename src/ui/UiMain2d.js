/**
 * @author rscv5
 * @version 1.0.0
 */

//*************************************************
// Import
//*************************************************

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Layout } from 'antd';
import UiVolumeSel from './UiVolumeSel';
import UiInfo2d from './UiInfo2d';
import Graphics2d from '../features/Graphics2d';
import Graphics2dtest from './Graphics2dtest';
import UiCtrl2d from './UiCtrl2d';

//*************************************************
// Const
//*************************************************

//*************************************************
// Class UiMain2d...
//*************************************************

class UiMain2d extends React.Component {
    transferFunCallback(transfFuncObj) {
        const i = transfFuncObj.m_indexMoved;
        const x = transfFuncObj.m_handleX[i];
        const y = transfFuncObj.m_handleY[i];
        console.log(`move point[${i}] = ${x}, ${y} `);
    }

    /*
     *
     * Main component render func callback
     */
    render() {

        const MIN_HEIGHT = 500;
        const MIN_WIDTH = 500;
        const strMinHeight = {
            minHeight: MIN_HEIGHT.toString() + 'px',
            minWidth: MIN_WIDTH.toString() + 'px'
        };

        const store = this.props;
        const volSet = store.volumeSet;
        const vols = volSet.m_volumes;
        const numVols = vols.length;
        const jsxVolSel = (numVols > 1)? <UiVolumeSel/> : <UiInfo2d/>
        // const jsxVolSel =  (numVols > 1)? <UiVolumeSel/> : <br/>;


        const jsxMain2d =
            <Layout fluid="true" style={{ height: '100%', minHeight: '100%' }}>
                <Row>
                    <Col xs md lg="4" style={{ height: '100%', position: 'relative' }}>
                        {/* <UiCtrl2d/> */}
                        {jsxVolSel}
                    </Col>
                    <Col xs md lg='20' style={strMinHeight} >
                        <Graphics2d />
                        {/* <Graphics2dtest /> */}
                    </Col>
                </Row>
            </Layout>
        return jsxMain2d;
    };
}
export default connect(store => store)(UiMain2d);