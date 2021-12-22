/**
 * OpenGL, WebGL renderer selector
 * @module lib/scripts/graphics3d/glselector
 * 
 */

export default class GlSelector {
    /**
     * @constructor
     */
    constructor(){
        this.m_useWebGL2 = undefined;
    }

    /**
     * Create compatible canvas
     */
    createWebGLContext(){
        this.canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        let context = this.canvas.getContext('webgl2');
        this.m_useWebGL2 = 1;
        if(context == null){
            console.log('WebGL 2 not supported, moving to webgl 1');
            context = this.canvas.getContext('webgl');
            this.m_useWebGL2 = 0;
        } else {
            console.log('WebGL 2 context created');
        }
        return context;
    }

    /** return canvas */
    getCanvas(){
        return this.canvas;
    }

    /** Create compatible canvas
     * 
     */
    useWebGL2(){
        return this.m_useWebGL2;
    }

}