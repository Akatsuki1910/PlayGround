$('head').append(
	'<style type="text/css">#container { display: none; } #fade, #loader { display: block; }</style>'
);

var pageH;
$(window).on("load",()=>{ // 全ての読み込み完了後に呼ばれる関数
	pageH = window.innerHeight;
	pageW = window.innerWidth;

	$("#loader").css("top", pageH/2-180+"px");
	$("#loader").css("left", pageW/2-180+"px");
	$("#loader").delay(1700).fadeOut(300);
	$("#fade").css("height", pageH).delay(2000).fadeOut(800);
});