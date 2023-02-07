import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

var div3d, scene, camera, renderer, controls, raycaster;
var mouse=new THREE.Vector2;
var sphereArr=[];
var meshArr=[];
var intxArr=[];

function init3d(){
    
    div3d=document.createElement("div");
    raycaster=new THREE.Raycaster();
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 100000);

    // camera=new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, 0.1, 10000);

    camera.up=new THREE.Vector3(0,0,1);
    camera.lookAt(new THREE.Vector3(0,0,0));
    camera.position.set(50,50,50);
    renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    div3d.appendChild(renderer.domElement);
    document.body.appendChild(div3d);
    controls=new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    var l=new THREE.PointLight(0xffffff, 1, 100);
    l.position.set(0,0,50);
    var l2=l.clone();
    l2.position.set(0,0,-50);
    scene.add(l);
    scene.add(l2);
    addSphere();
    addMesh();
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener('keydown', onKeyDown, false);
}

function onKeyDown(e){
    console.log(e.key, e.keyCode);
    intxArr.forEach(node=>{
        if(e.keyCode===85) node.position.z+=0.1;
        else if(e.keyCode===68) node.position.z-=0.1;
    });
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            if(e.keyCode===72) scene.remove(node);
            else if(e.keyCode===83) scene.add(node);
        });
    });
    addMesh();
}

function clearIntxArr(){
    var m=new THREE.MeshPhongMaterial({color:0xffffff});
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            node.scale.set(1,1,1);
            node.material=m;
        })
    })
    intxArr=[];
}

function onMouseDown(e){
    var m2=new THREE.MeshPhongMaterial({color:0xff0000});
    mouse.x=(e.clientX/window.innerWidth)*2-1;
    mouse.y=-(e.clientY/window.innerHeight)*2+1;
    raycaster.setFromCamera(mouse, camera);
    var intersects=raycaster.intersectObjects(scene.children);
    if(intersects.length>0){
        var obj=[];
        for(var i=0; i<intersects.length; i++){
            obj=intersects[i];
            var p=obj.object.position;
            sphereArr.forEach(arr=>{
                arr.forEach(node=>{
                    var q=node.position;
                    var d=Math.sqrt(Math.pow(q.x-p.x,2) + Math.pow(q.y-p.y,2) + Math.pow(q.z-p.z,2));
                    if(d<0.1){
                        node.scale.set(2,2,2);
                        node.material=m2;
                        intxArr.push(node);
                    }
                });
            });
        }
    }else{
        clearIntxArr();
    }
}


function addSphere(){
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            node.geometry.dispose();
            node.material.dispose();
            scene.remove(node);
        });
    });
    sphereArr=[];
    var t=5, e=5;
    for(var i=-t; i<t; i++){
        var arr=[];
        for(j=-t; j<t; j++){
            var g=new THREE.SphereGeometry(1, 20,20);
            var m=new THREE.MeshPhongMaterial({color:0xffffff});
            var me=new THREE.Mesh(g,m);
            var p=new THREE.Vector3(i*e, j*e, 0);
            var d=Math.sqrt(p.x*p.x + p.y*p.y);
            var z;
            // z=d;
            if(d!==0) z=100/d;
            else z=100/Math.sqrt(e*e*0.5);
            //Math.random()*2 -1
            me.position.set(i*e, j*e, z);
            arr.push(me);
        }
        sphereArr.push(arr);
    }
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            scene.add(node);
        });
    });
}

function addMesh(){
    meshArr.forEach(node=>{
        node.geometry.dispose();
        node.material.dispose();
        scene.remove(node);
    });
    meshArr=[];

    for(i=0; i<sphereArr.length-1; i++){
        var arr=sphereArr[i];
        var arr2=sphereArr[i+1];
        for(var j=0 ; j<arr.length-1; j++){
            var a=arr[j].position;
            var b=arr[j+1].position;
            var c=arr2[j].position;
            var d=arr2[j+1].position;
            var g=new THREE.BufferGeometry();
            
            var vertices=[];
            vertices.push(a);
            vertices.push(b);
            vertices.push(c);
            vertices.push(c);
            vertices.push(b);
            vertices.push(d);

            
            g.setFromPoints(vertices);
            g.computeVertexNormals();

            var m=new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
            var me=new THREE.Mesh(g,m);
            meshArr.push(me);
        }
    }
    
    meshArr.forEach(node=>{
        scene.add(node);
    });

}

function onWindowResize(){
    camera.aspect=window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animationLoop(){
    requestAnimationFrame(animationLoop);
    onWindowResize();
    render();
}

function render(){
    renderer.render(scene, camera);
}

init3d();