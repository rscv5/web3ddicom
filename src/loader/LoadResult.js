
// ******************************************************************
// imports
// ******************************************************************

/** Class LoadResult to report loading status of binary files */
export default class LoadResult {
    static getResultString(errorCode) {
        switch (errorCode) {
            case LoadResult.SUCCESS:
                return 'Success';
            case LoadResult.BAD_DICOM:
                return 'Bad Dicom';
            case LoadResult.ERROR_COMPRESSED_IMAGE_NOT_SUPPORTED:
                return 'Compressed image formats read is not supported';
            default:
                return 'Unknown error code';
        } //switch
    } // getResultString
} // class LoadResult

LoadResult.SUCCESS = 0;
LoadResult.BAD_DICOM = 1;
LoadResult.ERROR_COMPRESSED_IMAGE_NOT_SUPPORTED = 2;