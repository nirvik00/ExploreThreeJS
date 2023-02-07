import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

var renderer, scene, camera, controls;
var meshArr=[];

function init3d()
{

    scene=new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera=new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(10,10,10);
    camera.up= new THREE.Vector3(0,0,1)
    camera.lookAt(0,0,0);
    
    renderer=new THREE.WebGLRenderer({antialias:true});
    document.getElementById("div3d").appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth,window.innerHeight);
    
    controls=new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    
    window.addEventListener("onResize", onWindowResize)
    document.getElementById("width").addEventListener("change", draw);
    document.getElementById("height").addEventListener("change", draw);
    document.getElementById("depth").addEventListener("change", draw);
    
    draw();
    infiniteLoop();
}

function draw()
{
    meshArr.forEach(e=>{
        e.geometry.dispose();
        e.material.dispose();
        scene.remove(e);
    });
    meshArr=[];

    while(scene.children.length>0){
        scene.remove(scene.children[0]);
    }

    console.log("before: ", scene.children.length)

    let w= parseFloat(document.getElementById("width").value);
    let h= parseFloat(document.getElementById("height").value);
    let d= parseFloat(document.getElementById("depth").value);
    
    console.log(w, h, d);

    var axis = new THREE.AxesHelper(25);
    scene.add(axis);
    
    var box = new THREE.BoxGeometry(3, 3, 3);
    var mat=new THREE.MeshBasicMaterial({
        color:new THREE.Color(0xffff00),
        transparent: true,
        opacity:0.25
    })
    var mesh= new THREE.Mesh(box, mat);
    mesh.scale.set(w,h,d)
    meshArr.push(mesh);


    meshArr.forEach(e=>{
        scene.add(e);
    });    

    console.log("after: ", scene.children.length)
}

function onWindowResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function infiniteLoop()
{
    onWindowResize();
    render();
    requestAnimationFrame(infiniteLoop);
}

function render()
{
    /// last or at the end
    renderer.render(scene, camera);
}


init3d();