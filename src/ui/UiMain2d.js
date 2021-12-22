/**
 * @author rscv5
 * @version 1.0.0
 */

//*************************************************
// Import
//*************************************************

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Layout, Card } from 'antd';

import UiInfo2d from './UiInfo2d';
import UiTools2d from './UiTools2d';
import Graphics2d from './Graphics2d';
import UiCtrl2d from './UiCtrl2d';
import Graph2dtest from './Graph2dtest';

import '../css/ui2d.css'

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

        const MIN_HEIGHT = 600;
        const MIN_WIDTH = 600;
        const strMinHeight = {
            minHeight: MIN_HEIGHT.toString() + 'px',
            minWidth: MIN_WIDTH.toString() + 'px',
            marginTop:'10px',
            // height:'100%',
            marginLeft:'10px',
            // border:'20px'
        };

        const store = this.props;
        const loaderDicom = store.loaderDicom;
        const numVols = loaderDicom.m_numLoadedFiles;
        // const volSet = store.volumeSet;
        // const vols = volSet.m_volumes;
        // const numVols = vols.length;
        // console.log('>>>>>>numvols',store.loaderDicom)
        const jsxVolSel =  (numVols > 1)? <UiCtrl2d/> : <br/>;


        const jsxMain2d =
            <Layout fluid="true" className='ui-main2d-info'>
                <Row className='ui-main2d-info' key='UiMain2dRow'>
                    <Col xs md lg="4" key='col_2dimg'>
                        <Card key='card_2dimg' title='Plane (Slice) View'
                             style={{margin:'10px'}}>
                                {jsxVolSel}
                                <UiInfo2d/>
                                <UiTools2d/>
                        </Card>
                    </Col>
                    <Col xs md lg='20' style={strMinHeight} key='graph2d_col' >
                        <Graphics2d/>
                        {/* <Graph2dtest/> */}
                    </Col>
                </Row>
             </Layout>
        return jsxMain2d;
    };
}
export default connect(store => store)(UiMain2d);