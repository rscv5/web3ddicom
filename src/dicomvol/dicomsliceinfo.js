/**
* Class @class DicomSliceInfo slice information
*/
class DicomSliceInfo {
    constructor() {
        this.m_sliceName = '';
        this.m_fileName = '';
        // tags info for each slice.Each entry is DicomTagInfo
        this.m_tags = [];
    }
}
export default DicomSliceInfo;