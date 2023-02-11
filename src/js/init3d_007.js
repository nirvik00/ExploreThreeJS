import * as THREE from 'three'
import { DoubleSide } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

var div3d, scene, camera, renderer, controls, raycaster;
var mouse= new THREE.Vector2;
var intersectionArr=[];
var sphereArr =[]; // mesh vertices or nodes
var meshArr =[]; 

init3d();
function init3d(){
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();
    camera= new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.up = new THREE.Vector3(0,0,1);
    camera.position.set(50,50,250);
    camera.lookAt(0,0,0);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    div3d = document.getElementById("div3d");
    div3d.appendChild(renderer.domElement);
    controls= new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    window.addEventListener('onResize', windowResize);

    //
    addMeshVertices();
    connectMeshVertices();
    
    //
    window.addEventListener('mousedown', onMouseDown, false);

    //
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);
    animationLoop();
}

function onMouseDown(e){
    
    mouse= new THREE.Vector2;
    mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length === 0){
        console.log('no object selected');
    }else{
        console.log('some object selected');
        intersects.forEach(e=>{
            e.object.material = new THREE.MeshBasicMaterial({
                color:0xff0000,
                side:THREE.DoubleSide
            })
        })
    }
}


function addMeshVertices(){
    sphereArr.forEach(e=>{
        e.geometry.dispose();
        e.material.dispose();
        scene.remove(e);
    })
    sphereArr=[];

    //
    let i=-5; 
    let c=10;
    while(i<5){
        let j=-5;
        var arr=[];
        while(j<5){
            let g= new THREE.SphereGeometry(1, 12, 12);
            let m= new THREE.MeshBasicMaterial({
                color: 0xfffff00,
            })
            let mesh = new THREE.Mesh(g, m);
            let p=new THREE.Vector3(i*c, j*c, 0);
            let d= Math.sqrt(p.x*p.x + p.y*p.y)
            let z=0;
            if(d===0){
                z=100/Math.sqrt(c*c*c/10)
            }else{
                z=100/d;
            }
            mesh.position.set(i*5, j*5, d);
            arr.push(mesh);
            j++;
        }
        sphereArr.push(arr);
        i++;
    }
    
    //
    sphereArr.forEach(arr=>{
        arr.forEach(e=>{

           scene.add(e);
        })
    })
}

function connectMeshVertices(){
    for(var i=0; i<sphereArr.length-1; i++)
    {
        var arr1 = sphereArr[i];
        var arr2 = sphereArr[i+1];
        for(var j=0; j<arr1.length-1; j++)
        {
            var a= arr1[j].position;
            var b= arr1[j+1].position;
            var c= arr2[j].position;
            var d= arr2[j+1].position;

            let g = new THREE.BufferGeometry();
            var vertices =[];
            vertices.push(a);
            vertices.push(b);
            vertices.push(c);
            vertices.push(c);
            vertices.push(b);
            vertices.push(d);
            g.setFromPoints(vertices);
            g.computeVertexNormals();

            var m= new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
            var mesh=new THREE.Mesh(g,m);
            meshArr.push(mesh);
        }
    }

    meshArr.forEach(e=>{
        scene.add(e);
    })
}

function windowResize(){
    camera.aspect= window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animationLoop(){
    render();
    requestAnimationFrame(animationLoop);
}

function render(){
    renderer.render(scene, camera);
}
