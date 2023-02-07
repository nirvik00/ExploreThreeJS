//
//
// light shadow curve
//
//
//
import * as THREE from 'three'
import { PCFShadowMap } from 'three';
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
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type= PCFShadowMap;
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById("div3d").appendChild(renderer.domElement);
    
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


    let w= parseFloat(document.getElementById("width").value);
    let h= parseFloat(document.getElementById("height").value);
    let d= parseFloat(document.getElementById("depth").value);
    generate(w,h,d);

    //
    var axis = new THREE.AxesHelper(25);
    scene.add(axis);

    var plane = new THREE.PlaneGeometry(200, 200, 32, 32);
    var mat = new THREE.MeshStandardMaterial({
        color:0xcccccc,
        side: THREE.DoubleSide
    })
    let planeMesh = new THREE.Mesh(plane, mat);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh)


    //
    addLights();

    //
    meshArr.forEach(e=>{
        e.castShadow=true;
        scene.add(e);
    });    

}

function addLights(){
  //Create a PointLight and turn on shadows for the light
  const light = new THREE.PointLight( 0xffffff, 10, 500 );
  light.position.set( 100, 100, 50 );
  light.castShadow = true; // default false
  scene.add( light );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 2048; // default
  light.shadow.mapSize.height = 2048; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default  
}

function generate(w,h,d){
    let zmax=[];
    let quads=[];
    let n=w;
    let x=h/10;
    let i=-n;
    while(i<n){
        let crvpts=[];
        let j=-n;
        while(j<n){
            let a=[i,j];
            let b=[i+x,j];
            let c=[i+x,j+x];
            let d=[i,j+x];
            quads.push([a,b,c,d]);
            let z = Math.sin(i*w/10) + Math.cos(j*h/10)+2;
            zmax.push(z);
            let p = new THREE.Vector3(i, j, z)
            crvpts.push(p);
            j++;
        }
        var crv = new THREE.CatmullRomCurve3(crvpts);
        var geo = new THREE.TubeGeometry(crv, 200, 0.1, 12, false);
        var mat=new THREE.MeshPhongMaterial({
            color:new THREE.Color(0x0000ff)
        })
        var mesh = new THREE.Mesh(geo, mat);
        meshArr.push(mesh);
        i++;
    }   

    quads.forEach((e, i) => {
        let shape = new THREE.Shape();
        shape.moveTo(e[0][0], e[0][1]);
        shape.lineTo(e[1][0], e[1][1]);
        shape.lineTo(e[2][0], e[2][1]);
        shape.lineTo(e[3][0], e[3][1]);
        shape.autoClose=true;

        const E={
            steps:1,
            depth:zmax[i],
            bevelEnabled:false
        }

        let g=new THREE.ExtrudeGeometry(shape, E);
        let m=new THREE.MeshPhongMaterial({
            color:new THREE.Color(0xff0000),
            // transparent:true,
            opacity:1.0, // 0.5,
            // wireframe:true,
        });

        let me= new THREE.Mesh(g,m);
       //  meshArr.push(me);
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