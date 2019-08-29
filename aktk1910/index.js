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
    //textobj.text++;//########################################
    effectmain();
    //renderer.render(stage);//########################################
}

var word = "0";
var style = {fontFamily : 'Arial',fontSize : '40px', fill:'white', fontWeight : "bold"};
var textobj = new PIXI.Text(word, style);
//stage.addChild(textobj);//########################################

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
//scene.add(axis);//########################################

var geometry = new THREE.CubeGeometry(100, 100, 100);
// var edges = new THREE.EdgesGeometry(geometry);

var box=[];
var box_num;
const meshList = [];
var linegeometry=[];
var line=[];
var count=[];
var step=[];
var box_movflg=[];//0 notmove 1 movenow 2 moveend

var men_box=[];
const meshList_box = [];
var geo_men = new THREE.CubeGeometry(0, 0, 0);

var men_tex=[];
var loader = new THREE.FontLoader();

var link_data;
$.ajaxSetup({async: false});
$.getJSON("./link.json",(data)=>{
	link_data=data;
	box_num=link_data.length;
});
$.ajaxSetup({async: true});
for(var i=0;i<box_num;i++){
    var material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    box[i] = new THREE.Mesh(geometry,material);
    //x 100 ~ 900 y 100 ~ 900
    var x = 100+200*(i%5);
    var y = 800-500*Math.floor(i/5);
    var z = 0;//Math.floor(Math.random()*700);
    box[i].position.set(x,y,z);
    scene.add(box[i]);

    meshList.push(box[i]);

    menubox(i,x,y,z);

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

function menubox(p,x,y,z){
  men_box[p]=[];
  men_tex[p]=[];
  for(var i in link_data[p]){
    var mat_men = new THREE.MeshStandardMaterial( { color: 0xf0f0f0 } );
    men_box[p][i] = new THREE.Mesh(geo_men,mat_men);
    men_box[p][i].position.set(x,y,z);
    scene.add(men_box[p][i]);
    meshList_box.push(men_box[p][i]);
  }
  loader.load('./optimer_regular.typeface.json', (font)=>{
    var geo_mai = new THREE.TextGeometry("Akatsuki's HP(pre)", {
      font: font,
      size: 50,
      height: 5,
      curveSegments: 12
    });
    var mat_mai = new THREE.MeshBasicMaterial( { color: 0xff0000} );
    var title = new THREE.Mesh(geo_mai,mat_mai);
    scene.add(title);
    var a = title.geometry.parameters.text.length;
    title.position.set(500-a/2*50/2,900,0);
    for(var i in link_data[p]){
      var geo_tex = new THREE.TextGeometry(link_data[p][i].menu, {
        font: font,
        size: 0.1,
        height: 5,
        curveSegments: 12
      });
      var mat_tex = new THREE.MeshBasicMaterial( { color: 0xff0000} );
      men_tex[p][i] = new THREE.Mesh(geo_tex,mat_tex);
      scene.add(men_tex[p][i]);
      men_tex[p][i].position.set(x,y,z);
    }
  });
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


var move_flg=true;
var mem_i;
function tick() {
  // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
  raycaster.setFromCamera(mouse, camera);
  // その光線とぶつかったオブジェクトを得る
  const intersects = raycaster.intersectObjects(meshList);
  meshList.map(mesh => {
    if (intersects.length > 0 && mesh === intersects[0].object && move_flg) {
      for(const i in box){
        if(mesh==box[i]){
          if(box_movflg[i]==0){
            move_flg=false;
            mem_i=i;
            box[i].material.color.setHex(0x0000ff);
            mem_x[i]=box[i].position.x;
            mem_y[i]=box[i].position.y;
            console.log(mem_y[i]);
            box_movflg[i]=1;
            picup(i);
            for(const l in box){
              if(box_movflg[l]==2)boxpicdown(l,mesh);
            }
          }else if(box_movflg[i]==2){
            boxpicdown(i,mesh);
          }
        }
      }
    }
  });

  const intersects2 = raycaster.intersectObjects(meshList_box);
  meshList_box.map(mesh => {
    if (intersects2.length > 0 && mesh === intersects2[0].object && move_flg) {
      for(const i in men_box[mem_i]){
        if(mesh==men_box[mem_i][i]){
          location.href=link_data[mem_i][i].link;
        }
      }
    }
  });
}

function boxpicdown(i,mesh){
  move_flg=false;
  box[i].material.color.setHex(0x00ff00);
  mem_x[i]=100+200*(i%5);
  mem_y[i]=800-500*Math.floor(i/5);
  box_movflg[i]=1;
  picdown(i);
}


var mem_x=[];
var mem_y=[];
var mem_z=[];
var spe = 1;
function picup(i){
  switch(step[i]){
    case 0:
      box[i].position.z+=spe*2;
      box[i].position.x+=spe*(300-mem_x[i])/150;
      box[i].position.y+=spe*(500-mem_y[i])/150;
      boxmove(i);
      menuboxmove(i);
      count[i]++;
      break;
    case 1:
      if(300>count[i]){
        menu_bar_dia(1,i);
      }else if(300+150>count[i]){
        menu_bar_str(1,i);
      }
      count[i]++;
      break;
  }
  switch(count[i]){
    case 150:step[i]=1;requestAnimationFrame(picup.bind(null,i));break;
    case 450:box_movflg[i]=2; move_flg=true;break;
    default :requestAnimationFrame(picup.bind(null,i));break;
  }
}

function picdown(i){
  switch(step[i]){
    case 1:
      if(300<count[i]){
        menu_bar_str(-1,i);
      }else if(150<count[i]){
        menu_bar_dia(-1,i);
      }
      count[i]--;
      break;
    case 0:
        box[i].position.z-=spe*2;
        box[i].position.x-=spe*(300-mem_x[i])/150;
        box[i].position.y-=spe*(500-mem_y[i])/150;
        boxmove(i);
        menuboxmove(i);
        count[i]--;
      break;
  }
  switch(count[i]){
    case 150:step[i]=0;requestAnimationFrame(picdown.bind(null,i));break;
    case 0:box_movflg[i]=0;move_flg=true;break;
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

function menuboxmove(i){
  for(var l in men_box[i]){
    men_box[i][l].position.x=linegeometry[i][1].position.x;
    men_box[i][l].position.y=linegeometry[i][1].position.y;
    men_box[i][l].position.z=linegeometry[i][1].position.z;

    men_tex[i][l].position.x=men_box[i][l].position.x;
    men_tex[i][l].position.y=men_box[i][l].position.y;
    men_tex[i][l].position.z=men_box[i][l].position.z;
  }
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
    menuboxmove(i);
}
function menu_bar_str(sn,i){
  linegeometry[i][1].scale.y+=sn*m;
  linegeometry[i][1].position.x+=sn*m/2;
  count[i]+=sn;
  menu_box_str(sn,i);
}
function menu_box_str(sn,i){
  for(var l in men_box[i]){
    men_box[i][l].position.y-=sn*(l*0.7+1);
    men_box[i][l].scale.x+=sn*50/150;
    men_box[i][l].scale.y+=sn*50/150;
    men_box[i][l].scale.z+=sn*50/150;

    men_tex[i][l].position.x+=sn*40/150;
    men_tex[i][l].position.y-=sn*(l*0.7+1)+sn*25/150;
    men_tex[i][l].scale.y+=sn*500/150;
    men_tex[i][l].scale.x+=sn*500/150;
  }
}


function effectmain() {
    for(var i=0;i<lig_num;i++){
      lightHelper[i].update();
    }
    for(var l=0;l<box_num;l++){
      box[l].rotation.y+=0.01;
      for(var p in men_box[l]){
        men_box[l][p].rotation.y+=0.01;
      }
    }
    //tick();
    //controls.update();
    rendererThree.render(scene, camera);
}

animate();