// ********************************************************
// Imports
// ********************************************************

import * as THREE from 'three';


// ********************************************************
// Const
// ********************************************************

// ********************************************************
// Class
// ********************************************************

/**
 * Class Texture3D  some text later...
 */
export default class Texture3D {
  constructor() {
    this.m_texture = -1;
  }

  createFromRawVolume(vol) {
      //DataTexture3d(data, width, height, depth)
    this.m_texture = new THREE.DataTexture3D(vol.m_dataArray, vol.m_xDim, vol.m_yDim, vol.m_zDim);
  }
}