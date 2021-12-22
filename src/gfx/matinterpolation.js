/**
 * Final isosurface rendering material for CT dataset
 * @module lib/scripts/gfx/matinterpolation
 */

//****************************************************** */
// imports
//****************************************************** */

// absoulte imports
import * as THREE from 'three';

import INTERP_VERTEX_SHADER from '../shaders/interpolation.vert';
import INTERP_FRAGMENT_SHADER from '../shaders/interpolation.frag';

/** Class @class MaterialVolumeRender for create skull volume render shader material*/
export default class MaterialInterpolation{

    /** Simple material constructor
     * @constructor
     */
    constructor(){
        this.m_strShaderVertex = '';
        this.m_strShaderFragment = '';
        this.m_uniforms = {
            isoSurfTexel: { type: 'v2', value: null },
            texIsoSurface: { type: 't', value: null },
        };
        this.m_defines = {
            isoRenderFlag: 0,
        };
    }

    /** Simple material constructor
     * @return {object} Three.js material with this shader
     */
    create(renderTexture, callbackMat){
        // Init uniforms
        this.m_uniforms.texIsoSurface.value = renderTexture;

        // create shader loaders
        const vertexLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        vertexLoader.setResponseType('text');
        const fragmentLoader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragmentLoader.setResponseType('text');

        vertexLoader.load(INTERP_VERTEX_SHADER, (strVertexSh) =>{
            this.m_strShaderVertex = strVertexSh;
            fragmentLoader.load(INTERP_FRAGMENT_SHADER, (strFragmentSh)=>{
                this.m_strShaderFragment = strFragmentSh;

                const material = new THREE.ShaderMaterial({
                    uniforms: this.m_uniforms,
                    defines: this.m_defines,
                    vertexShader: this.m_strShaderVertex,
                    fragmentShader: this.m_strShaderFragment,
                    side: THREE.BackSide
                });
                if(callbackMat){
                    callbackMat(material);
                }
            });
        });
    }
}