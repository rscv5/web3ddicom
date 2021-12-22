// ******************************************************
// Import
// ******************************************************

// absolute imports
import * as THREE from 'three';

const CONTROL_CAMERA_MIN_ZOOM = 0.3;
const CONTROL_CAMERA_MAX_ZOOM = 2.5;
const CONTROL_CAMERA_ROTATION_SPEED = 0.008;
const CONTROL_CAMERA_ZOOM_SPEED = 0.2;

//**************************************************** */
// class
//*************************************************** */
export default class OrbitControl {
    /**
     * Initialize render
     * @return {Object} Intsance 
     */
    constructor(domElem, camera, scene, mesh, meshRotationCallback){
        this.m_callback = meshRotationCallback;
        this.m_mesh = mesh;
        this.m_wireMesh = null;
        this.m_camera = camera;
        this.m_target = new THREE.Vector3(0, 0, 0);
        this.m_scene = scene;
        this.m_button = OrbitControl.EVENT_BUTTON_NA;
        this.domElem = domElem;
        this.m_pressedLeft = false;
        this.m_pressedRight = false;
        this.m_prevMouse = { x: -1, y: -1 };
        this.m_prevTime = -1;
        this.m_deltaTime = 0;
        this.m_spherical = new THREE.Spherical();
        this.m_sphericalDelta = new THREE.Spherical();
        this.m_spherical.set(0, 0, 0);
        this.m_sphericalDelta.set(0, 0, 0);
        this.m_autoRotate = false;

        this.m_minDistance = CONTROL_CAMERA_MIN_ZOOM;
        this.m_maxDistance = CONTROL_CAMERA_MAX_ZOOM;

        this.m_minAzimuthAngle = -Infinity; // radians
        this.m_maxAzimuthAngle = Infinity; // radians
        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians
        this.m_minPolarAngle = 0; //  radians
        // eslint-disable-next-line
        this.m_maxPolarAngle = Math.PI * 2.0; // radians

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.m_enableDamping = false;
        this.m_dampingFactor = 0.25;
        this.isEraserMode = false;
    }

    setEraserMode(isOn){
        this.isEraserMode = isOn;
    }

    setMesh(mesh){
        this.m_mesh = mesh;
    }

    setWireMesh(wireMesh){
        this.m_wireMesh = wireMesh;
    }

    setScene(scene){
        this.m_scene = scene;
    }
    
    getX(xx){
        return xx - this.domElem.offsetLeft;
    }

    getY(yy){
        return yy - this.domElem.offsetTop;
    }

    //updateTime(dx, dy, useCallback = true){}
    updateTime(dx, dy){
        if(dx === 0 && dy === 0){
            return;
        }
        // time update
        const curTimeMs = new Date().getTime();
        this.m_prevTime = (this.m_prevTime > 0) ? this.m_prevTime : curTimeMs;
        this.m_deltaTime = curTimeMs - this.m_prevTime;
        this.m_prevTime = curTimeMs;
        if(!this.m_mesh){
            return;
        }

        const rotationY = new THREE.Matrix4();
        const rotationX = new THREE.Matrix4();
        const matrix = new THREE.Matrix4();
        const camDir = new THREE.Vector3();

        camDir.copy(this.m_target).sub(this.m_camera.position).normalize();
        rotationX.makeRotationAxis(this.m_camera.up, dx * CONTROL_CAMERA_ROTATION_SPEED);
        rotationY.makeRotationAxis(camDir.cross(this.m_camera.up), dy * CONTROL_CAMERA_ROTATION_SPEED);
        matrix.identity();
        matrix.multiply(rotationX).multiply(rotationY).multiply(this.m_mesh.matrix);

        this.m_mesh.rotation.setFromRotationMatrix(matrix);
        if(this.m_wireMesh){
            matrix.identity();
            matrix.multiply(rotationX).multiply(rotationY).multiply(this.m_wireMesh.matrix);
            this.m_wireMesh.rotation.setFromRotationMatrix(matrix);
        }
        this.m_callback();
    }

    onMouseDown(xMouse, yMouse, ctrlKey){
        this.m_pressedLeft = true;
        this.m_prevMouse = { x: xMouse, y: yMouse };
        this.m_spherical.set(0, 0, 0);
        this.m_sphericalDelta.set(0, 0, 0);
        this.m_prevTime = new Date().getTime(); // -1
        this.ctrlKey = ctrlKey;
    }

    onMouseUp(){
        this.m_pressedLeft = false;
        this.m_prevMouse.x = -1;
        this.m_prevMouse.y = -1;
    }

    onMouseMove(x, y){
        if(this.m_prevMouse.x < 0){
            this.m_prevMouse.x = x;
            this.m_prevMouse.y = y;
        }
        const dx = x - this.m_prevMouse.x;
        const dy = y - this.m_prevMouse.y;
        this.m_prevMouse.x = x;
        this.m_prevMouse.y = y;
        
        if(this.m_pressedLeft){
            this.updateTime(dx, dy);
        }
    }

    onZoom(delta){
        const step = delta * CONTROL_CAMERA_ZOOM_SPEED;
        let camPos = this.m_camera.position.length();
        const camDir = this.m_camera.position.sub(this.m_target);
        camDir.normalize();
        camPos += step;
        camPos = Math.max(camPos, CONTROL_CAMERA_MIN_ZOOM);
        camPos = Math.min(camPos, CONTROL_CAMERA_MAX_ZOOM);

        camDir.multiplyScalar(camPos);
        this.m_camera.position.set(camDir.x, camDir.y, camDir.z);
        this.m_camera.lookAt(this.m_target);
        this.m_camera.updateMatrixWorld();
    }

} // class

OrbitControl.EVENT_BUTTON_NA = -1;
OrbitControl.EVENT_BUTTON_LEFT = 0;
OrbitControl.EVENT_BUTTON_CENTER = 1;
OrbitControl.EVENT_BUTTON_RIGHT = 2;