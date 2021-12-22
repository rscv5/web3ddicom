/**
 * Single triagle
 * @module lib/scripts/actvolume/trianglesingle
 */

// absolute imports
import * as THREE from 'three';

/**
 * Class TriangleSingle is one triangle
 * @class TriangleSingle
 */
export default class TriangleSingle {
    constructor(){
        this.va = new THREE.Vector3();
        this.vb = new THREE.Vector3();
        this.vc = new THREE.Vector3();
    }
}