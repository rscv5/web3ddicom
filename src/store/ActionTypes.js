//
// Action type for redux reducer
//
const StoreActionType = {
    SET_IS_LOADED: 0,
    SET_FILENAME: 1,
    SET_VOLUME_SET: 2,
    SET_VOLUME_INDEX: 3,
    SET_MODE_VIEW: 4,
    SET_MODE_2D: 5,
    SET_MODE_3D: 6,
    SET_UI_APP: 7,
    SET_DICOM_INFO: 8,
    SET_ERR_ARRAY: 9,
    SET_DICOM_SERIES: 10,
    SET_LOADER_DICOM: 11,
    SET_SLIDER_2D: 12,
    SET_GRAPHICS_2D: 13,
    SET_VOLUME_SLICES: 14,

    SET_VOLUME_NUMBER:15,
    
    SET_2D_X_POS:16,
    SET_2D_Y_POS:17,
    SET_2D_TOOLS_INDEX: 18,
    SET_TEXTURE3D:19,
    SET_SLIDER_3DR: 20,
    SET_SLIDER_3DG: 21,
    SET_SLIDER_3DB: 22,
    SET_SLIDER_Opacity:23,
    SET_SLIDER_Isosurface:24,
    SET_SLIDER_Brightness: 25,
    SET_SLIDER_Cut:26,
    SET_SLIDER_Quality:27,
    SET_SLIDER_ErRadius:28,
    SET_SLIDER_ErDepth: 29,
    SET_SLIDER_Contrast3D:30,
    SET_VOLUME_Renderer:31,
    SET_IS_TOOL3D:32,
    SET_MODE_3Droi:33,
};

export default StoreActionType;