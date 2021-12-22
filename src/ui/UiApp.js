import React from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col } from 'antd';
import "antd/dist/antd.css";
import StoreActionType from '../store/ActionTypes';

import UiMain from './UiMain'; 
import UiOpenSubMenuTest from './UiOpenSubMenuTest';
import UiOpenSubMenu from './UiOpenSubMenu';
import UiViewMode from './UiViewMode';

const { Header, Content } = Layout;



class UiApp extends React.Component {
    constructor(props) {
        super(props);

        this.m_store = null;
        this.m_fileNameOnLoad = '';

    }
    componentDidMount() {
        const store = this.m_store;
        if (store === null) {
            console.log('UiApp. componentDidMount. store is NULL');
        }
        store.dispatch({ type: StoreActionType.SET_UI_APP, uiApp: this });
    }

    /**
  * Main component render func callback
  */
    render() {
        const store = this.props;
        this.m_store = store;
        const isLoaded = store.isLoaded;
        const fileName = store.fileName;
        const strMessageOnMenu = (isLoaded) ? 'File: ' + fileName : 'Press Computer DICOM button to load scene'

        const jsxReact =
            <Layout theme='light' style={{minHeight:'100vh'}}>
                <Header style={{ paddingLeft: '0px', paddingRight: '0px', background: 'white' }}>
                    <Row>
                        <Col key='file-name'>
                            {strMessageOnMenu}
                        </Col>
                        <Col key='menu-col'>
                            {/* <UiOpenSubMenu fileNameOnLoad={this.m_fileNameOnLoad}/> */}
                            <UiOpenSubMenuTest fileNameOnLoad = {this.m_fileNameOnLoad}/>
                        </Col>
                        <Col key='menu-23d'>
                            {(isLoaded)? <UiViewMode/>: <p></p>}
                        </Col>
                    </Row>
                </Header>
                <Content style={{ padding: '0 10px'}} >
                    {(isLoaded) ? <UiMain /> : 
                        <p>No Content</p>
                    }
                </Content>
            </Layout >

        return jsxReact;
    }
}

export default connect(store => store)(UiApp);