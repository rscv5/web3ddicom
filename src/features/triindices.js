/**
 * Triangle indices
 * @module lib/scripts/actvolume/triindices
 */

/**
 * Class TriangleIndices define 3 indices of triangle
 * @class TriangleIndices
 */
export default class TriangleIndices {
    /**
     * Init all internal data
     * @constructs TriangleIndices
     */
    constructor(ia, ib, ic){
        const NUM_VERTS_IN_TRIANGLE = 3;
        this.m_indices = new Int32Array(NUM_VERTS_IN_TRIANGLE);
        this.m_indices[0] = ia;
        this.m_indices[1] = ib;
        this.m_indices[2] = ic;
    }
} // TriangleIndices