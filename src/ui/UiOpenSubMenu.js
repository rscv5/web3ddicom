/**
 * @author rscv5
 * @version 1.0.0
 */

//*************************************************
// Import
//*************************************************

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Menu } from 'antd';
import "antd/dist/antd.css";
import { ContainerOutlined } from '@ant-design/icons';
// import createReadStream from 'filereader-stream';
// import daikon from 'daikon';

import LoaderDcmDaikon from '../loader/LoaderDcmDaikon';
import VolumeSet from '../features/read/VolumeSet';
import Volume from '../features/read/Volume';
import StoreActionType from '../store/ActionTypes';
import LoaderDicom from '../loader/LoaderDicom';
import LoadResult from '../loader/LoadResult';


//import LoaderDicom from '../engine/loaders/LoaderDicom';

//*************************************************
// Const
//*************************************************

// deep artificially fix volume texture size to 4 * N
const NEED_TEXTURE_SIZE_4X = true;

// use daikon parser for Dicom (*dcm) file loading
const READ_DICOM_VIA_DAIKON = true;

//*************************************************
// Class
//*************************************************


/**
 * Class UiOpenSubMenu....
 */
class UiOpenSubMenu extends React.Component {
    /**
     * @param {object} props -props from up level object
     */
    constructor(props) {
        super(props);
        this.onButtonLocalFile = this.onButtonLocalFile.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
        this.onFileContentReadSingleFile = this.onFileContentReadSingleFile.bind(this);
        this.onFileContentReadSingleSliceFile = this.onFileContentReadSingleSliceFile.bind(this);

        this.onFileContentReadMultipleDicom = this.onFileContentReadMultipleDicom.bind(this);
        this.onDicomSerieSelected = this.onDicomSerieSelected.bind(this);

        this.setErrorString = this.setErrorString.bind(this);


        this.callbackReadSingleDicomComplete = this.callbackReadSingleDicomComplete.bind(this);

        this.callbackReadComplete = this.callbackReadComplete.bind(this);
        this.callbackReadProgress = this.callbackReadProgress.bind(this);


        this.callbackReadMultipleComplete = this.callbackReadMultipleComplete.bind(this);
        this.callbackCompleteMultipleDicom = this.callbackCompleteMultipleDicom.bind(this);

        this.m_fileNameOnLoad = '';
        this.m_fileName = '';
        this.m_fileIndex = 0;
        this.m_fileReader = null;
        this.m_volumeSet = null;
        this.m_volumeSlices=null;

        this.m_volumeRoi = null;
        this.m_updateEnable = true;
        this.roiMode = false;

        this.state = {
            onLoadCounter:1,
        };
    }


    callbackReadMultipleComplete(errCode){
        if(errCode !== LoadResult.SUCCESS){
            const strErr = LoadResult.getResultString(errCode);
            this.setErrorString(strErr);
        }
    }
    callbackReadSingleDicomComplete(errCode) {
        if (errCode === LoadResult.SUCCESS) {

            const store = this.props;
            store.dispatch({ type: StoreActionType.SET_VOLUME_SET, volumeSet: this.m_volumeSet });
            store.dispatch({ type: StoreActionType.SET_VOLUME_INDEX, volumeIndex: 0 });
            // save dicom loader to store
            store.dispatch({ type: StoreActionType.SET_LOADER_DICOM, loaderDicom: this.m_loader });
            store.dispatch({ type: StoreActionType.SET_FILENAME, fileName: this.m_fileName.toString() });
            store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: true });
            // console.log('>>>>>>>>>>>>>>>>>store', store)


            // // setup modal: window min, max
            // this.childModalWindowCenterWidth.initWindowRange();

            // // show modal: select window center, width
            // this.setState({ showModalWindowCW: true });
            return; // do nothing immediately after: wait for dialog
        }
        this.callbackReadComplete(errCode);
    }

    setErrorString(strErr) {
        const store = this.props;
        const arrErrors = [];
        arrErrors.push(strErr);
        store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: false });
        store.dispatch({ type: StoreActionType.SET_ERR_ARRAY, arrErrors: arrErrors });
        store.dispatch({ type: StoreActionType.SET_VOLUME_SET, volume: null });
    }



    finalizeSuccessLoadedVolume(volSet, fileNameIn) {
        const store = this.props;
        console.assert(volSet instanceof VolumeSet, "finalizeSuccessLoadedVolume: should be VolumeSet");
        console.assert(volSet.getNumVolumes() >= 1, "finalizeSuccessLoadedVolume: should be more or 1 volume");
        const indexVol = 0;
        const dicom = store.loaderDicom;
        const vol = volSet.getVolume(indexVol);
        console.assert(vol !== null, "finalizeSuccessLoadedVolume: should be non zero volume");
        console.log('>>>>>>>>>vol',vol);
        console.log('>?>>>>>>>>dicom', dicom);
        if (vol.m_dataArray !== null) {
            console.log(`success loaded volume from ${fileNameIn}`);
            // send update (repaint) if was loaded prev model
            if (store.isLoaded) {
                store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: false });
            }

            store.dispatch({ type: StoreActionType.SET_VOLUME_SET, volumeSet: volSet });
            store.dispatch({ type: StoreActionType.SET_VOLUME_INDEX, volumeIndex: 0 });
            store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: true });
            store.dispatch({ type: StoreActionType.SET_FILENAME, fileName: fileNameIn });
            store.dispatch({ type: StoreActionType.SET_ERR_ARRAY, arrErrors: [] });

            // const tex3d = new Texture3D();
            // tex3d.createFromRawVolume(vol);
            // store.dispatch({ type: StoreActionType.SET_TEXTURE3D, texture3d: tex3d });
            // store.dispatch({ type: StoreActionType.SET_MODE_VIEW, modeView: ModeView.VIEW_2D });
            // store.dispatch({ type: StoreActionType.SET_MODE_3D, mode3d: Modes3d.RAYCAST });
        }
    }

    callbackReadComplete(errCode) {
        // console.log('>>>>>>>>>>>read complete',errCode, LoadResult.SUCCESS)
        if (errCode === undefined) {
            console.log('callbackReadComplete. should be errCode');
        } else {
            if (errCode !== LoadResult.SUCCESS) {
                const strErr = LoadResult.getResultString(errCode);
                this.setErrorString(strErr);
            }
        }

        if (errCode === LoadResult.SUCCESS) {
            // console.log('callbackReadComplete finished OK');
            
            this.finalizeSuccessLoadedVolume(this.m_volumeSet, this.m_fileName);
        } else {
            console.log(`callbackReadComplete failed! reading ${this.m_fileName} file`);
            const arrErr = [];
            const strErr = LoadResult.getResultString(errCode);
            arrErr.push(strErr);
            this.finalizeFailedLoadedVolume(this.m_volumeSet, this.m_fileName, arrErr);
        }
    }



    callbackReadProgress(ratio01) {
        // console.log(`callbackReadProgress = ${ratio01}`);
        const ratioPrc = Math.floor(ratio01 * 100);
        const store = this.props;
        const uiapp = store.uiApp;
        // if (uiapp !== null) {
        //     if (ratioPrc === 0) {
        //         uiapp.doShowProgressBar('Loading...');
        //     }
        //     if (ratioPrc >= 99) {
        //         console.log(`callbackReadProgress. hide on = ${ratio01}`);
        //         uiapp.doHideProgressBar();
        //     } else {
        //         uiapp.doSetProgressBarRatio(ratioPrc);
        //     }
        // }
    } // callback progress

    onFileContentReadSingleFile() {
        let strContent = this.m_fileReader.result;
        this.onFileReadSingleBuffer(strContent);
    }

    onFileContentReadSingleSliceFile(){
        let strContent = this.m_fileReader.result;
        console.log('>>>>>>>',strContent)
    }

    //
    // based on local file read
    // read from string content in this.m_fileReader.result
    //
    onFileReadSingleBuffer(strContent) {
        //daikon read
        //strContent is ArrayBuffer
        // this.m_volumeSet = new VolumeSet();
        // this.m_volumeSet.addVolume(new Volume());
        // const callbackCompleteSingleDicom = this.callbackReadSingleDicomComplete;
        if ((this.m_fileName.endsWith('.dcm') || this.m_fileName.endsWith('.DCM')) && READ_DICOM_VIA_DAIKON) {
            const loaderDcm = new LoaderDcmDaikon();
            const store = this.props;
            const fileName = this.m_fileName;
            const fileIndex = this.m_fileIndex;
            this.m_loader = new LoaderDicom(1);
            // console.log('>>>>>>>>m_loader>>>>',this.m_loader)
            // console.log('>>>>>>>m_volumeSet>>', this.m_volumeSet)
            const ret = loaderDcm.readSingleSlice(store, this.m_loader, fileIndex, fileName, strContent);
            this.callbackReadSingleDicomComplete(ret);
            // this.m_volumeSet.readFromDicom(this.m_loader, strContent, callbackCompleteSingleDicom);
            return ret;
        }
        console.log('UiOpenMenu. onFileReadSingleBuffer....');

        this.m_volumeSet = new VolumeSet();
        this.m_volumeSet.addVolume(new Volume());
        // const callbackComplete = this.callbackReadComplete;
        const callbackCompleteSingleDicom = this.callbackReadSingleDicomComplete;
        if (this.m_fileName.endsWith('.dcm') || this.m_fileName.endsWith('.DCM')) {
            this.m_loader = new LoaderDicom();
            this.m_loader.m_zDim = 1;
            this.m_loader.m_numFiles = 1;
            this.m_volumeSet.readFromDicom(this.m_loader, strContent, callbackCompleteSingleDicom);
            // save dicomInfo to store
            const dicomInfo = this.m_loader.m_dicomInfo;
            const sliceInfo = dicomInfo.m_sliceInfo[0];
            sliceInfo.m_fileName = this.m_fileName;
            sliceInfo.m_sliceName = 'Slice 0';
            const store = this.props;
            store.dispatch({ type: StoreActionType.SET_DICOM_INFO, dicomInfo: dicomInfo });
        }
        else {
            console.log(`onFileContentReadSingleFile: unknown file type: ${this.m_fileName}`);
        }
        
    }

    onButtonLocalFile (evt){
        // evt.preventDefault();
        this.m_fileSelector.click();

    }

    onDicomSerieSelected(indexSelected){
        const store = this.props;
        const series = store.dicomSeries;
        const serieSelected = series[indexSelected];
        const hash = serieSelected.m_hash;
        // console.log('>>>>>>>>hash',hash)
        this.m_loader.createVolumeFromSlices(this.m_volumeSet, indexSelected, hash);
        this.finalizeSuccessLoadedVolume(this.m_volumeSet, this.m_fileName);
        console.log(`onFileContentReadMultipleDicom read all ${this.m_numFiles} files`);
        
        // clear modal
        store.dispatch({type: StoreActionType.SET_DICOM_SERIES, dicomSeries:[] });
    }

    //
    // daikon read individual slice from file buffer (one from multiple files)
    // strContent is ArrayBuffer
    //
    onFileContentReadMultipleDicom(file){
        var fileReader = new FileReader();
        // this.m_volumeSet = new VolumeSet();
        fileReader.readAsArrayBuffer(file);
        this.m_fileIndex++;
        var m_loader = this.m_loader;
        var volumeSet = this.m_volumeSet;
        var m_fileIndex = this.m_fileIndex;
        const store = this.props;
        if(this.m_fileIndex <=1){
            // add new volume to volume set on the first slice
            const vol = new Volume();
            volumeSet.addVolume(vol);
        }
        // can be invoked with error code
        const callbackCompleteVoid = this.callbackCompleteMultipleDicom;
        // const callbackComplete = this.callbackReadComplete;
        let readStatus;

        fileReader.onloadend = function(e){
            var rawlog = fileReader.result;
            const loaderDcm = new LoaderDcmDaikon();
            var index = m_fileIndex - 1; 
            if(READ_DICOM_VIA_DAIKON){
                // const readstatus = volumeSet.readSingleSliceFromDicom(m_loader, index, file.name,
                //     rawlog, callbackComplete);
                readStatus = loaderDcm.readSlice(m_loader, index, file.name, rawlog);

            }else{
                // volumeSet.addVolume(new Volume());
                // m_loader.readFromBuffer(index, file.name, rawlog);
                readStatus = volumeSet.readSingleSliceFromDicom(m_loader, index, file.name,
                     rawlog, callbackCompleteVoid);
            }
            store.dispatch({ type: StoreActionType.SET_VOLUME_INDEX, volumeIndex: index });
            if (readStatus !== LoadResult.SUCCESS) {
                console.log('onFileContentReadMultipleDicom. Error read individual file');                
            }
        }
        if ((this.m_fileIndex === this.m_numFiles) && (this.m_fileIndex !== 1)) {
            // load successfully
            store.dispatch({ type: StoreActionType.SET_LOADER_DICOM, loaderDicom: this.m_loader });
            store.dispatch({ type: StoreActionType.SET_FILENAME, fileName: 'Multiple DICOM Files'})
            store.dispatch({ type: StoreActionType.SET_VOLUME_SET, volumeSet: volumeSet });
            store.dispatch({ type: StoreActionType.SET_IS_LOADED, isLoaded: true });
            //             
            this.callbackReadComplete(LoadResult.SUCCESS);
            return; // do nothing immediately after: wait for dialog
          } // end if successfully read all files (multiple dicom read)
        // else if()
    }

    //
    // Perform open file after it selected in dialog
    handleFileSelected(evt) {
        const store = this.props;
        if (evt.target.files !== undefined) {
            let numFiles = evt.target.files.length;
            console.log(`UiOpenSubMenu.Trying to open ${numFiles} files`);
            if (numFiles <= 0) {
                return;
            }
            console.log(`UiOpenSubMenu. handleFileSelected.file[0]=${evt.target.files[0].name}`);
            this.m_volumeSet = new VolumeSet();
            if (numFiles === 1) {
                const file = evt.target.files[0];
                this.m_fileName = file.name;
                this.m_fileReader = new FileReader();
                this.m_fileReader.onloadend = this.onFileContentReadSingleFile;
                this.m_fileReader.readAsArrayBuffer(file);
            } 
            else {
                // not single file was open
                this.m_files = Array.from(evt.target.files); // filelist -> array
                this.m_fileIndex = 0;
                this.m_numFiles = numFiles;
                let numFilesNew = 0;

                // remove non-dcm files
                for(let i = 0; i < this.m_files.length; i++){
                    if(this.m_files[i].name.endsWith('.dcm') || this.m_files[i].name.endsWith('.DCM')){
                        numFilesNew++;
                    }
                    else{
                        this.m_files.splice(i, 1);
                    }
                }
                numFiles = numFilesNew;
                this.m_numFiles = numFilesNew;
                
                // if multiple files, create Dicom loader

                this.m_loader = new LoaderDicom(numFiles);
                const dicomInfo = this.m_loader.m_dicomInfo;

                //save dicomInfo to store
                store.dispatch({ type: StoreActionType.SET_DICOM_INFO, dicomInfo: dicomInfo })
                // console.log('>>>>>>>>>>>>volumeNumber', this.m_numFiles);
                store.dispatch({ type: StoreActionType.SET_VOLUME_NUMBER, volumeNumber:this.m_numFiles});

                // save dicom loader to store
                store.dispatch({ type: StoreActionType.SET_LOADER_DICOM, loaderDicom: this.m_loader})
                // read files
                for(let i = 0; i < this.m_files.length; i++){
                        const m_file = this.m_files[i];
                        this.onFileContentReadMultipleDicom(m_file)
                }
            }//if num files > 1
        } // if event is mnot empty
    }

    // on complete read multuple dicom
    callbackCompleteMultipleDicom(errCode){
        if(errCode !== LoadResult.SUCCESS){
            const strErr = LoadResult.getResultString(errCode);
            this.setErrorString(strErr);
        }
    }

    buildFileSelector = () => {
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', '.dcm');
        fileSelector.setAttribute('multiple', '');
        fileSelector.onchange = this.handleFileSelected;
        return fileSelector;
    }
    componentDidMount() {
        this.m_fileSelector = this.buildFileSelector();
        // this.onDicomSerieSelected(0);

    }
    //render
    render() {
        const fileNameOnLoad = this.props.fileNameOnLoad;
        this.m_fileNameOnLoad = fileNameOnLoad;
        let jsxOnload = '';
        if (fileNameOnLoad.length > 2) {
            jsxOnload = <p></p>;
            return jsxOnload;
        }

        const jsxOpenMenu =
                <Button key='OpenDicom' onClick={evt => this.onButtonLocalFile(evt)} 
                        icon={<ContainerOutlined/>} size='large' shape='round'
                        style={{marginLeft:'10px'}} type='primary'>
                        Computer DICOM 
                </Button>
        return jsxOpenMenu;
    }
}
export default connect(store => store)(UiOpenSubMenu);

