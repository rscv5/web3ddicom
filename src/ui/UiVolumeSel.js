/**
 * @fileoverview UiVolumeSel
 * @author rscv5
 * @version 1.0.0
 */

// **************************************************
// Imports
// **************************************************

// import { Card } from "antd";
import {Card, ListGroup, ListGroupItem} from 'react-bootstrap';

import React from "react";
import { connect } from 'react-redux';

import StoreActionType from "../store/ActionTypes";
import UiVolIcon from './UiVolIcon';

// import Texture3D from '../dicomvol/Texture3D'

//**************************************************
// Const
//*********************************************** */

const NEED_TEXTURE_SIZE_4X = true;

//**********************************************
// Class
//**********************************************
class UiVolumeSel extends React.Component{
    constructor(props){
        super(props);
        this.onClickChoice = this.onClickChoice.bind(this);
    }

    setVolumeIndex(indexSelected){
        const store = this.props;
        const volumeSet = store.volumeSet;

        // volumes are already created from slices
        // loaderDicom.createVolumeFromSlices(volumeSet, indexSelected, hash);

        //finalize load
        const vol = volumeSet.getVolume(indexSelected);
        console.assert(vol !== null, 'setVolumeIndex:vol should be non zero volume');

        if(vol.m_dataArray !== null){
            // console.log(`success loaded volume from ${fileNameIn}`);
            if(NEED_TEXTURE_SIZE_4X){
                vol.makeDimensions4x();
            }
            // invoke notification

            // send update (repaint) if was loaded prev model
            if(store.isLoaded){
                store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: false});
            }

            store.dispatch({ type: StoreActionType.SET_VOLUME_SET, volumeSet: volumeSet });
            store.dispatch({ type: StoreActionType.SET_VOLUME_INDEX, volumeIndex: indexSelected});
            // const text3d = new Texture3D();
            // store.dispatch({ type: StoreActionType.SET_TEXTURE3D, texture3d: text3d});
            store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: true});

            const gra = store.graphics2d;
            gra.clear();
            gra.forceUpdate(indexSelected);
            gra.forceRender();

        } // if vol data not null
    }

    onClickChoice(ind){
        console.assert(typeof(ind) == 'number')
        const store = this.props;
        if(ind !== store.volumeIndex){
            // set global selected volume index
            store.dispatch({ type: StoreActionType.SET_VOLUME_INDEX, volumeIndex: ind});
            this.setVolumeIndex(ind);
        }
    }

    render(){
        const store = this.props;
        const volumeSet = store.volumeSet;
        const vols = volumeSet.m_volumes;
        const volumeIndex = store.volumeIndex;

        const strPatName = store.dicomInfo.m_patientName;
        const strStudyDescr = store.dicomInfo.m_studyDescr;
        const strTitle = `Volume select. [${strPatName}:${strStudyDescr}]`;

        const jsx =
        <Card>
            <Card.Header>
                 {strTitle}
            </Card.Header>
            <Card.Body>
            <ListGroup>
            {vols.map( (vol, i) => {
                const numSlices = vol.m_zDim;
                const strSer = vol.m_seriesDescr;
                const strVo = `vol ${strSer} [${numSlices}] slices`;
                let jsxListItem;
                if (i === volumeIndex) {
                jsxListItem = <ListGroupItem key={i} onClick={() => {this.onClickChoice(i)} } active>{strVo}<UiVolIcon index={i} />  </ListGroupItem>;
                } else {
                jsxListItem = <ListGroupItem key={i} onClick={() => {this.onClickChoice(i)} }>{strVo}<UiVolIcon index={i} /> </ListGroupItem>;
                }
                return jsxListItem;
            })}
            </ListGroup>
        </Card.Body>
        </Card>
        return jsx;
    }
}

export default connect(store => store)(UiVolumeSel);