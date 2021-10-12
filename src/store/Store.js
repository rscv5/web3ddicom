//

import ModeView from './ModeView';
import StoreActionType from './ActionTypes';
import Modes2d from './Modes2d';


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
    // volumes slices
    volumeSlices:[],
    // volumes number
    volumeNumber: 0,
    
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
        default:
            return state;
    }
}

export default rootReducer;