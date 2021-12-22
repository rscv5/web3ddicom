/**
 * Simple point link
 * @module lib/scripts/actvolume/pointlink
 */

// absolute imports
import * as THREE from 'three';

/**
 * Class PointLink define link entry
 * @class PointLink
 */
export default class PointLink{
    /**
     * Init all internal data
     * @constructs PointLink
     */
    constructor(){
        this.m_point = new THREE.Vector3();
        this.m_next  = null;
    }
}