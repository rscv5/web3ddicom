// ************************************************
//  Imports
// ************************************************

import React from 'react';
import {connect} from 'react-redux';
import { Button, Tooltip, Space } from 'antd';
import { FileImageOutlined, ProjectOutlined, ReadFilled } from '@ant-design/icons';

import ModeView from '../store/ModeView';
import StoreActionType from '../store/ActionTypes';

// *************************************************
// Class
// *************************************************

class UiViewMode extends React.Component{
    /**
     * @param {object} props -props from up level object
     */
    constructor(props){
        super(props);

        // main view configuration
        // setup true, where you want to see mode renderer
        this.m_needMode2d = true;
        this.m_needMode3dLight = true;

        this.onMode2d = this.onMode2d.bind(this);
        this.onMode3dLight = this.onMode3dLight.bind(this);
        // this.onTool3d = this.onTool3d.bind(this);
        // this.onView3d = this.onView3d.bind(this);
    } 

    onMode(indexMode){
        const store = this.props;
        store.dispatch({ type: StoreActionType.SET_MODE_VIEW, modeView: indexMode });
    }

    onMode2d(){
        this.onMode(ModeView.VIEW_2D);
    }

    onMode3dLight(){
        this.onMode(ModeView.VIEW_3D_LIGHT);
    }

    // onTool_View(isOn){
    //     const store = this.props;
    //     store.dispatch({ type: StoreActionType.SET_IS_TOOL3D, isTool3D: isOn });
    //     store.dispatch({ type: StoreActionType.SET_SLIDER_Contrast3D, sliderContrast3D: 0 });
    // }

    // onTool3d(){
    //     this.onTool_View(true);
    // }

    // onView3d(){
    //     this.onTool_View(false);
    // }

    render(){
        const store = this.props;
        let viewMode = store.modeView;
        // let isTool3D = store.isTool3D;
        if((viewMode === ModeView.VIEW_3D_LIGHT)&&(!this.m_needMode3dLight)){
            viewMode = ModeView.VIEW_2D;
        }
        if((viewMode === ModeView.VIEW_2D)&& (!this.m_needMode2d)){
            viewMode = ModeView.VIEW_3D_LIGHT;
        }

        const jsx3d =
            <Tooltip title={"Show volume in 3d mode"} color='cyan'>
                <Button onClick={this.onMode3dLight} icon={<ProjectOutlined/>} size="large"  shape="round">
                    3D View
                </Button>
            </Tooltip>
        
        const FOUR = 4;
        let needShow3d = false;

        const volSet = store.volumeSet;
        if(volSet.getNumVolumes() > 0){
            const volIndex = store.volumeIndex;
            // console.log('>>>>>volindex',volIndex);
            const vol = volSet.getVolume(0);
            if(vol !== null){
                if(vol.m_bytesPerVoxel !== FOUR){
                    needShow3d  = true;
                }
            }
        } // if more 0 volumes
        // const test = true;
        const jsxOut =
            <Space key='button-group' style={{paddingLeft:'10px'}}>
                <Tooltip title='show volume in 2d mode' color='cyan'>
                    <Button onClick={this.onMode2d} icon={<FileImageOutlined/>} size={'large'} shape='round'>
                        2D View
                    </Button>
                </Tooltip>
                {(needShow3d)? jsx3d:''}
            </Space> 
        return jsxOut;
    }
}

export default connect(store => store)(UiViewMode);