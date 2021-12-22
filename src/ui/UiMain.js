import React from 'react';
import { connect } from 'react-redux';

import UiMain2d from './UiMain2d';
import UiMain3d from './UiMain3d';

import ModeView from '../store/ModeView';

class UiMain extends React.Component {
    render() {
        const store = this.props;
        const modeViewIndex = store.modeView;
        
        const jsMain2d = <UiMain2d></UiMain2d>;
        const jsMain3d = <UiMain3d></UiMain3d>;

        const jsArray = new Array(ModeView.VIEW_COUNT);
        jsArray[ModeView.VIEW_2D] = jsMain2d;
        jsArray[ModeView.VIEW_3D_LIGHT] = jsMain3d;

        const jsxRet = jsArray[modeViewIndex];
        return jsxRet;
    };
}

export default connect(store => store)(UiMain);