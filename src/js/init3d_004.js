//
//
// extrusion & parametric generation 
//
//
//
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
    
    generate(w,h,d);

    meshArr.forEach(e=>{
        scene.add(e);
    });    

    console.log("after: ", scene.children.length)
}


function generate(w,h,d){
    let quads=[];
    let n=w;
    let x=h/10;
    let i=-n;
    while(i<n){
        let j=-n;
        while(j<n){
            let a=[i,j];
            let b=[i+x,j];
            let c=[i+x,j+x];
            let d=[i,j+x];
            quads.push([a,b,c,d]);
            j++;
        }
        i++;
    }

    const E={
        steps:1,
        depth:d,
        bevelEnabled:false
    }

    quads.forEach(e=>{
        let shape = new THREE.Shape();
        shape.moveTo(e[0][0], e[0][1]);
        shape.lineTo(e[1][0], e[1][1]);
        shape.lineTo(e[2][0], e[2][1]);
        shape.lineTo(e[3][0], e[3][1]);
        shape.autoClose=true;

        let g=new THREE.ExtrudeGeometry(shape, E);
        let m=new THREE.MeshBasicMaterial({
            color:new THREE.Color(0xff0000),
            transparent:true,
            opacity:0.5,
            wireframe:true,
        });

        let me= new THREE.Mesh(g,m);
        meshArr.push(me);
    })

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