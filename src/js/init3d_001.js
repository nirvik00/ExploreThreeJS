//
//
// start with a 3d box
//
//
//


import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

var renderer, scene, camera, controls;

scene=new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
camera=new THREE.PerspectiveCamera(45, 500/500, 0.1, 1000);
camera.position.set(10,10,10);
camera.up= new THREE.Vector3(0,0,1)
camera.lookAt(0,0,0);

renderer=new THREE.WebGLRenderer({antialias:true});
document.body.appendChild(renderer.domElement);
renderer.setSize(500,500);


var axis = new THREE.AxesHelper(25);
scene.add(axis);

var box = new THREE.BoxGeometry(3, 3, 3);
var mat=new THREE.MeshBasicMaterial({
    color:new THREE.Color(0xffff00)
})
var mesh= new THREE.Mesh(box, mat);
scene.add(mesh);



/// last or at the end

renderer.render(scene, camera);