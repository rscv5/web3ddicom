// 3d mode selection
// default MaxPrj

// *************************************************
// Imports
// *************************************************

import React from "react";
import { connect } from "react-redux";
import { Card, Button, Space, Tooltip, Row} from 'antd';

import Modes3d from '../store/Modes3d';
import Modes3droi from '../store/Modes3droi';
import StoreActionType from "../store/ActionTypes";
import { FastBackwardFilled } from "@ant-design/icons";

// import UiTF from './UiTF';
// import UiTFroi from './UiTFroi';
// import UiRoiSelect from './UiRoiSelect';

//*************************************************** */
// Const
//************************************************** */

//************************************************* */
// Class
//************************************************ */

/**
 * Class UiCtrl3dLight some text later....
 */
class UiCtrl3dLight extends React.Component{
    /**
     * @param {object} props -props from up level object
     */
    constructor(props){
        super(props);
        this.onMode = this.onMode.bind(this);
        this.onModeIso = this.onModeIso.bind(this);
        this.onModeVol = this.onModeVol.bind(this);
        this.onModeEraser = this.onModeEraser.bind(this);
        this.onModeMaxPrj = this.onModeMaxPrj.bind(this);
        this.m_updateEnable = true;
    }

    onMode(indexMode){
        this.m_updateEnable = true;
        this.props.dispatch({ type: StoreActionType.SET_MODE_3D, mode3d: indexMode});
        const store = this.props;

        // store.volumeRenderer.offAmbientTextureMode();
    }
    onModeMaxPrj(){
        this.onMode(Modes3d.RAYFAST);
        // this.props.volumeRenderer.setEraseMode(false);
    }

    onModeIso(){
        this.onMode(Modes3d.ISO);
        // this.props.volumeRenderer.setEraseMode(false);
    }
    
    onModeVol(){
        this.onMode(Modes3d.RAYCAST);
        // this.props.volumeRenderer.setEraserMode(false);
    }

    onModeEraser(){
        this.onMode(Modes3d.EREASER);
        // this.props.volumeRenderer.setEraserMode(false);
    }
    render(){
        const store = this.props;
        const mode3d = store.mode3d;

        const jsxRenderControls = 
            <Card title='3d mode selection' key='3d_mode_select'>
                <Space key='3d_select_button_group'>
                    <Tooltip title={"Show just barrier value surface, 1st ray intersection"} color='geekblue'>
                        <Button onClick={this.onModeIso}>
                            Iso
                        </Button>
                    </Tooltip>
                    <Tooltip title="Show complete 3d volumetric rendering" color="green">
                        <Button onClick={this.onModeVol}>
                            Vol
                        </Button>
                    </Tooltip>
                    <Tooltip title="Show maximum projection rendering" color='lime'>
                        <Button onClick={this.onModeMaxPrj}>
                            MaxPrj
                        </Button>
                    </Tooltip>
                    <Tooltip title="Special volume eraser tool" color='cyan'>
                        <Button onClick={this.onModeEraser}>
                            Eraser
                        </Button>
                    </Tooltip>
                </Space>
            </Card>

        let indx = 0;
        const volSet = store.volumeSet;
        if(volSet.getNumVolumes() > 0){
            const volIndex = store.volumeIndex;
            const vol = volSet.getVolume(volIndex);
            const FOUR = 4;
            if(vol.m_bytesPerVoxel === FOUR){
                indx = 1;
            }
        } // end if more 0 volumes
        // const jsxArray=[jsxRenderControls];
        return jsxRenderControls;
    }

}

export default connect(store => store)(UiCtrl3dLight)
