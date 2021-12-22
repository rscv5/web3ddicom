//

import ModeView from './ModeView';
import StoreActionType from './ActionTypes';
import Modes2d from './Modes2d';
import Modes3droi from './Modes3droi';
import Modes3d from './Modes3d';

//
// Global app setting with initial configuration
//
export const initialState = {
    // loaded status
    isLoaded: false,
    // fileName
    fileName: '',
    // setting volume state
    volumeSet: null,
    // index of volume
    volumeIndex: 0,
    // view 2D
    modeView: ModeView.VIEW_2D,
    mode2d: Modes2d.SIDEVIEW,
    // view 3D
    mode3d: Modes3d.RAYCAST,
    mode3droi: Modes3droi.RAYCAST,
    //  volume renderer
    volumeRenderer: null,
    // arr errors
    arrErrors: [],
    uiApp: null,
    // dicom information
    dicomInfo: null,
    // none dicom
    dicomSeries: [],
    // loader of dicom 
    loaderDicom: null,
    // 2d graph
    graphics2d: null,
    // slider2d
    slider2d: 0.5,
    // slider3d
    slider3d_r: 0.09,
    slider3d_g: 0.3,
    slider3d_b: 0.46,
    sliderOpacity:0.53,
    sliderIsosurface: 0.46,
    sliderBrightness: 0.56,
    sliderCut: 1.0,
    sliderQuality: 0.35,
    sliderErRadius: 50.0,
    sliderErDepth: 50.0,
    isTool3d: false,
    sliderContrast3D: 0.0,
    // volumes slices
    volumeSlices:[],
    // volumes number
    volumeNumber: 0,
    // render2d
    render2dxPos:0.0,
    render2dyPos:0.0,
    // tools2d
    indexTools2d:0,
    
};
//
// App reducer
//
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case StoreActionType.SET_IS_LOADED:
            // immutability 
            return Object.assign({}, state, { isLoaded: action.isLoaded });
        case StoreActionType.SET_FILENAME:
            return Object.assign({}, state, { fileName: action.fileName });
        case StoreActionType.SET_VOLUME_SET:
            return Object.assign({}, state, { volumeSet: action.volumeSet });
        case StoreActionType.SET_VOLUME_INDEX:
            return Object.assign({}, state, { volumeIndex: action.volumeIndex });
        case StoreActionType.SET_MODE_VIEW:
            return Object.assign({}, state, { modeView: action.modeView });
        case StoreActionType.SET_MODE_2D:
            return Object.assign({}, state, { mode2d: action.mode2d });
        case StoreActionType.SET_SLIDER_2D:
            return Object.assign({}, state, { slider2d: action.slider2d });
        case StoreActionType.SET_MODE_3D:
            return Object.assign({}, state, { mode3d: action.mode3d });
        case StoreActionType.SET_MODE_3Droi:
            return Object.assign({}, state, { mode3droi: action.mode3droi });
        case StoreActionType.SET_SLIDER_3DR:
            return Object.assign({}, state, { slider3d_r: action.slider3d_r });
        case StoreActionType.SET_SLIDER_3DG:
            return Object.assign({}, state, { slider3d_g: action.slider3d_g });
        case StoreActionType.SET_SLIDER_3DB:
            return Object.assign({}, state, { slider3d_b: action.slider3d_b });
        case StoreActionType.SET_SLIDER_Opacity:
            return Object.assign({}, state, { sliderOpacity: action.sliderOpacity });
        case StoreActionType.SET_SLIDER_Isosurface:
            return Object.assign({}, state, { sliderIsosurface: action.sliderIsosurface });
        case StoreActionType.SET_SLIDER_ErRadius:
            return Object.assign({}, state, { sliderErRadius: action.sliderErRadius });
        case StoreActionType.SET_SLIDER_ErDepth:
            return Object.assign({}, state, { sliderErDepth: action.sliderErDepth });
        case StoreActionType.SET_VOLUME_Renderer:
            return Object.assign({}, state, { volumeRenderer: action.volumeRenderer });
        case StoreActionType.SET_SLIDER_Brightness:
            return Object.assign({}, state, { sliderBrightness: action.sliderBrightness });
        case StoreActionType.SET_SLIDER_Cut:
            return Object.assign({}, state, { sliderCut: action.sliderCut });
        case StoreActionType.SET_SLIDER_Quality:
            return Object.assign({}, state, { sliderQuality: action.sliderQuality });
        case StoreActionType.SET_2D_TOOLS_INDEX:
            return Object.assign({}, state, { indexTools2d: action.indexTools2d });
        case StoreActionType.SET_UI_APP:
            return Object.assign({}, state, { uiApp: action.uiApp });
        case StoreActionType.SET_DICOM_INFO:
            return Object.assign({}, state, { dicomInfo: action.dicomInfo });
        case StoreActionType.SET_ERR_ARRAY:
            return Object.assign({}, state, { arrErrors: action.arrErrors });
        case StoreActionType.SET_DICOM_SERIES:
            return Object.assign({}, state, { dicomSeries: action.dicomSeries });
        case StoreActionType.SET_LOADER_DICOM:
            return Object.assign({}, state, { loaderDicom: action.loaderDicom });
        case StoreActionType.SET_GRAPHICS_2D:
            return Object.assign({}, state, { graphics2d: action.graphics2d });
        case StoreActionType.SET_VOLUME_SLICES:
            return Object.assign({}, state, { volumeSlices: action.volumeSlices});
        case StoreActionType.SET_VOLUME_NUMBER:
            return Object.assign({}, state, { volumeNumber: action.volumeNumber});
        case StoreActionType.SET_2D_X_POS:
            return Object.assign({}, state, {render2dxPos: action.render2dxPos});
        case StoreActionType.SET_2D_Y_POS:
            return Object.assign({}, state, { render2dyPos: action.render2dyPos});
        // eslint-disable-next-line no-duplicate-case
        case StoreActionType.SET_2D_TOOLS_INDEX:
            return Object.assign({}, state, { indexTools2d: action.indexTools2d });
        case StoreActionType.SET_SLIDER_Contrast3D:
            return Object.assign({}, state, { sliderContrast3D: action.sliderContrast3D });
        case StoreActionType.SET_IS_TOOL3D:
            return Object.assign({}, state, { isTool3d: action.isTool3d });
        default:
            return state;
    }
}

export default rootReducer;