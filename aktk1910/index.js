/*jshint esversion: 6 */
//pixi
var width = window.innerWidth;
var height = window.innerHeight;
var x = width/2;
var y = height/2;
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(width, height,{
    resolution: 1,
    antialias: true,
    transparent: true,
});
document.getElementById("pixiview").appendChild(renderer.view);
window.onresize = function () {
    location.reload();
};

var time=0;
function animate(){
    requestAnimationFrame(animate);
    textobj.text++;
    effectmain();
    renderer.render(stage);
}

var word = "0";
var style = {fontFamily : 'Arial',fontSize : '40px', fill:'white', fontWeight : "bold"};
var textobj = new PIXI.Text(word, style);
stage.addChild(textobj);

//three
// レンダラーを作成
const canvas = document.querySelector('canvas');
const rendererThree = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
rendererThree.setPixelRatio(window.devicePixelRatio);
rendererThree.setSize(width, height);
// シーンを作成
const scene = new THREE.Scene();
// カメラを作成
const camera = new THREE.PerspectiveCamera(60, width / height);
var cam_x = 500;
var cam_y = 500;
var cam_z = 1000;
camera.position.set(cam_x,cam_y,cam_z);
//camera.lookAt(new THREE.Vector3(0, 0, 0));

//var controls = new THREE.TrackballControls(camera);

var light=[];
var lightHelper=[];
var lig_num=10;
for(var i=0;i<lig_num;i++){
    light[i] = new THREE.DirectionalLight(0xffffff);
    var x = Math.floor(Math.random()*500)-250;
    var y = Math.floor(Math.random()*500)-250;
    var z = 1000;//Math.floor(Math.random()*500)-250;
    light[i].position.set(x,y,z);
    scene.add(light[i]);
    lightHelper[i] = new THREE.PointLightHelper(light[i]);
    scene.add(lightHelper[i]);
}

//軸の長さ１０００
var axis = new THREE.AxisHelper(1000);
//sceneに追加
scene.add(axis);

var geometry = new THREE.CubeGeometry(100, 100, 100);
// var edges = new THREE.EdgesGeometry(geometry);

var box=[];
var box_num=10;
const meshList = [];
var linegeometry=[];
var line=[];
var count=[];
var step=[];
var box_movflg=[];//0 notmove 1 movenow 2 moveend
for(var i=0;i<box_num;i++){
    var material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    box[i] = new THREE.Mesh(geometry,material);
    //x 100 ~ 900 y 100 ~ 900
    var x = 100+200*(i%5);
    var y = 900-200*Math.floor(i/5);
    var z = 0;//Math.floor(Math.random()*700);
    box[i].position.set(x,y,z);
    scene.add(box[i]);

    meshList.push(box[i]);

    linegeometry[i]=[];
    var g = new THREE.CylinderGeometry(1,1,0,100 );
    var m = new THREE.MeshBasicMaterial( { color: 0x008866, wireframe:true} );
    linegeometry[i][0] = new THREE.Mesh(g,m);
    linegeometry[i][1] = new THREE.Mesh(g,m);
    scene.add( linegeometry[i][0] );
    scene.add( linegeometry[i][1] );
    linegeometry[i][0].position.set(x,y,z);
    linegeometry[i][1].position.set(x,y,z);
    linegeometry[i][0].rotation.z-=Math.PI/4;
    linegeometry[i][1].rotation.z-=Math.PI/2;

    count[i]=0;
    step[i]=0;
    box_movflg[i]=0;
}

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
document.getElementById("pixiview").addEventListener('mousemove', handleMouseMove);
function handleMouseMove(event) {
    const element = event.currentTarget;
    // canvas要素上のXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;
    // canvas要素の幅・高さ
    const w = width;
    const h = height;
    // -1〜+1の範囲で現在のマウス座標を登録する
    mouse.x = (x / w) * 2 - 1;
    mouse.y = -(y / h) * 2 + 1;
}
// 毎フレーム時に実行されるループイベントです

document.addEventListener( 'mousedown', tick, false );

function tick() {
    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    raycaster.setFromCamera(mouse, camera);
    // その光線とぶつかったオブジェクトを得る
    const intersects = raycaster.intersectObjects(meshList);
    meshList.map(mesh => {
      if (intersects.length > 0 && mesh === intersects[0].object) {
        for(const i in box){
          if(mesh==box[i]){
            mem_x=box[i].position.x;
            mem_y=box[i].position.y;
            if(box_movflg[i]==0){box_movflg[i]=1;picup(i);}
          }
        }
        mesh.material.color.setHex(0x0000ff);
      } else {
        for(const i in box){
          if(box[i].position.z!=0){
            mem_x=100+200*(i%5);
            mem_y=900-200*Math.floor(i/5);
            if(box_movflg[i]==2){box_movflg[i]=1;picdown(i);}
          }
        }
        mesh.material.color.setHex(0x00ff00);
      }
    });
}

var mem_x,mem_y,mem_z;
var spe = 1;
function picup(i){
  switch(step[i]){
    case 0:
      box[i].position.z+=spe*1;
      box[i].position.x+=spe*(300-mem_x)/300;
      box[i].position.y+=spe*(500-mem_y)/300;
      boxmove(i);
      count[i]++;
      break;
    case 1:
      if(300/spe+150>count[i]){
        menu_bar_dia(1,i);
      }else if(300/spe+300>count[i]){
        menu_bar_str(1,i);
      }
      count[i]++;
      break;
  }
  switch(count[i]){
    case 300/*300/spe*/:step[i]=1;requestAnimationFrame(picup.bind(null,i));break;
    case 600/*300/spe+300*/:box_movflg[i]=2; break;
    default :requestAnimationFrame(picup.bind(null,i));break;
  }
}

function picdown(i){
  switch(step[i]){
    case 1:
      if(300/spe+150<count[i]){
        menu_bar_str(-1,i);
      }else if(300/spe<count[i]){
        menu_bar_dia(-1,i);
      }
      count[i]--;
      break;
    case 0:
        box[i].position.z-=spe*1;
        box[i].position.x-=spe*(300-mem_x)/300;
        box[i].position.y-=spe*(500-mem_y)/300;
        boxmove(i);
        count[i]--;
      break;
  }
  switch(count[i]){
    case 300/*300/spe*/:step[i]=0;requestAnimationFrame(picdown.bind(null,i));break;
    case 0:box_movflg[i]=0;break;
    default :requestAnimationFrame(picdown.bind(null,i));break;
  }
}

function boxmove(i){
  linegeometry[i][0].position.x=box[i].position.x;
  linegeometry[i][0].position.y=box[i].position.y;
  linegeometry[i][0].position.z=box[i].position.z;
  linegeometry[i][1].position.x=box[i].position.x;
  linegeometry[i][1].position.y=box[i].position.y;
  linegeometry[i][1].position.z=box[i].position.z;
}

var n=2;
var m=5;
function menu_bar_dia(sn,i){
    linegeometry[i][0].scale.y+=sn*n;
    linegeometry[i][0].position.x+=sn*n*0.5*Math.cos(Math.PI/4);
    linegeometry[i][0].position.y+=sn*n*0.5*Math.cos(Math.PI/4);
    linegeometry[i][1].position.x+=sn*n*Math.cos(Math.PI/4);
    linegeometry[i][1].position.y+=sn*n*Math.cos(Math.PI/4);
    count[i]+=sn;
}
function menu_bar_str(sn,i){
  linegeometry[i][1].scale.y+=sn*m;
  console.log(linegeometry[i][1].scale.y);
  linegeometry[i][1].position.x+=sn*m/2;
  count[i]+=sn;
}


function effectmain() {
    for(var i=0;i<lig_num;i++){
        lightHelper[i].update();
    }
    for(var l=0;l<box_num;l++){
        box[l].rotation.y+=0.01;
    }
    //tick();
    //controls.update();
    rendererThree.render(scene, camera);
}

animate();