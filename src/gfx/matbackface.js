/**
* Backface material, used for cube backface rendering
* @module lib/scripts/gfx/matbackface
*/

// ******************************************************************
// imports
// ******************************************************************

// absoulte imports
import * as THREE from 'three';

import BACK_FACE_VERTEX_SHADER from '../shaders/backface.vert';
import BACK_FACE_FRAGMENT_SHADER from '../shaders/backface.frag';

/**Class @class MaterialBF for volume backface rendering */
export default class MaterialBF {
    /** Backface material constructor
     * @constructor
     */
    constructor(){
        this.m_strShaderVertex = '';
        this.m_strShaderFragment = '';
    }
    
    /** Backface material constructor
     * @return {object} Three.js material with this shader
     */
    create(callbackMat){
        // Init uniforms

        // create shader loaders
        const vertexLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        vertexLoader.setResponseType('text');
        const fragmentLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragmentLoader.setResponseType('text');

        vertexLoader.load(BACK_FACE_VERTEX_SHADER, (strVertexSh) =>{
            this.m_strShaderVertex = strVertexSh;
            fragmentLoader.load(BACK_FACE_FRAGMENT_SHADER, (strFragmentSh) =>{
                this.m_strShaderFragment = strFragmentSh;

                const material = new THREE.ShaderMaterial({
                    vertexShader: this.m_strShaderVertex,
                    fragmentShader: this.m_strShaderFragment,
                    side: THREE.BackSide,
                    depthTest: true,
                    depthFunc: THREE.GreaterEqualDepth,
                    blending: THREE.NoBlending,
                });
                if(callbackMat){
                    callbackMat(material);
                }
            });
        });
    }
}
