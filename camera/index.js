/*jshint esversion: 6 */


var image = new Image();
const canvas = document.querySelector("#picture");
const video  = document.querySelector("#camera");
window.onload = () => {
    /** カメラ設定 */
    const constraints = navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: 400,
        height: 300,
        facingMode: "user"   // フロントカメラを利用する
        // facingMode: { exact: "environment" }  // リアカメラを利用する場合
        }
    });
    /**
     * カメラを<video>と同期
     */
    constraints
    .then( (stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
            loop();
        };
    })
    .catch( (err) => {
        console.log(err.name + ": " + err.message);
    });
  };

function loop(){
    requestAnimationFrame(loop);
    const ctx = canvas.getContext("2d");
    video.pause();  // 映像を停止
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.play();
    image.src=canvas.toDataURL('image/jpeg' , 1);
}
image.onload = function () {
    // 顔の検出
    var face_info = ccv.detect_objects({
        "canvas": ccv.grayscale(ccv.pre(image)),
        "cascade": cascade,
        "interval": 5,
        "min_neighbors": 1
    });
    // canvasに写真を表示
    var img_canvas = document.getElementById("img-canvas");
    var canvas_2d = img_canvas.getContext("2d");
    img_canvas.width = image.width;
    img_canvas.height = image.height;
    canvas_2d.drawImage(image, 0, 0);

    for( var i=0; i<face_info.length; i++ ){
        var f_x = face_info[i].x;
        var f_y = face_info[i].y;
        var f_w = face_info[i].width;
        var f_h = face_info[i].height;
        canvas_2d.beginPath();
        canvas_2d.moveTo(f_x,f_y);
        canvas_2d.lineTo(f_x,f_y+f_h);
        canvas_2d.lineTo(f_x+f_w,f_y+f_h);
        canvas_2d.lineTo(f_x+f_w,f_y);
        canvas_2d.closePath();
        canvas_2d.stroke();
    }
    console.log(face_info.length);
};