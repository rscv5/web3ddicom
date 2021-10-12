/**
 * @author rscv5
 * @version 1.0.0
 */

//*************************************************
// Import
//*************************************************

import React from 'react';

import Volume from './Volume';
// import LoaderDicom from '../../loader/LoaderDicom';



//*************************************************
// Const
//*************************************************

//*************************************************
// Class UiMain2d...
//*************************************************
/**
 * Class representing a volume set
 * See Volume class as an element of volume set
 */
class VolumeSet extends React.Component {
    /**
     * @param {object} props - props from up level object
     */
    constructor(props) {
        super(props);
        /** number of volumes in set */
        this.m_numVolumes = 0;
        /** volumes array.  see more details in class volume */
        this.m_volumes = [];
        /** patient name (etracted from dicom tags or empty for non-dicom files) */
        this.m_patientName = '';
        /** date of patient of study */
        this.m_seriesDescr = '';
        /** text description of study */
        this.m_studyDescr = '';
        /** text with data of study */
        this.m_studyDate = '';
        /** text with data of study */
        this.m_seriesTime = '';
        /** text with body part */
        this.m_bodyPartExamined = '';
        /** text institution lik clinic, university, etc. */
        this.m_institutionName = '';
        /** text with operator name */
        this.m_operatorsName = '';
        /** text with physican name */
        this.m_physicansName = '';
        /** silices array. see more deatiles in class volume */
        this.m_results = {};
    }

    /**
     * Add volume to set
     * 
     * @param {Volume} vols -added volume
     */
    addVolume(vol) {
        this.m_volumes.push(vol);
        this.m_numVolumes++;
        
    }

    /**
     * Add filename and result to  set
     * @param {Volume} slices - add result filename
     */
    addResult(fileName, vol){
            this.m_results[fileName] = vol;
            // this.m_numVolumes++;
            // console.log('>>>>nums>>>',this.m_numVolumes)
            return this.m_results;
    }

    /**
     * Get number of volumes in st
     * 
     * @return {number} Amount of volumes on set
     */
    getNumVolumes() {
        return this.m_numVolumes;
    }

    /**
     * Get volume by its index
     * @param {number} idx -index of volume in set
     * @return {Volume} volume is set of null
     */
    getVolume(idx) {
        console.assert(Number.isInteger(idx), "VolumeSet.getVolume: arg must be number");
        console.assert(idx < this.m_numVolumes, "index of volume should in range");
        console.assert(idx >= 0, "index of volume should be non negative");
        if ((idx < 0) || (idx >= this.m_numVolumes)) {
            return null;
        }
        return this.m_volumes[idx];
    }

    //do nothing.but we need to implement render() to run Volume tests
    render() {
        return <p></p>;
    }


    // ********************************************
    // Read metyhods. From Dicom, ..
    // ********************************************

    /**
    * Read KTX from local file buffer
     * 
    * @param {char array} arrBuf 
    * @param {func} callbackProgress 
    * @param {func} callbackComplete 
    */

    readFromDicom(loader, arrBuf, callbackProgress, callbackComplete) {
        const indexFile = 0;
        const fileName = 'file???';
        const ratio = 0.0;
        // LoaderDicom func
        const ret = loader.readFromBuffer(indexFile, fileName, ratio, arrBuf, callbackProgress, callbackComplete);
        return ret;
    }

    readSingleSliceFromDicom(loader, indexFile, fileName, ratioLoaded, arrBuf, callbackProgress, callbackComplete) {
        const ret = loader.readFromBuffer(indexFile, fileName, ratioLoaded, arrBuf, callbackProgress, callbackComplete);
        return ret;
    }

}// end VolumeSet

export default VolumeSet;

