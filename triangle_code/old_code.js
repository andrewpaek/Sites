//The function that draws the experiment triangle
// function drawTriangle() {
// 	//alert('drawTriangle'+Global_info.curPage)
// 	$('#triangle').empty();

// 	// var paper = Snap("#triangle").attr({width:"3000",height:"2500"});
// 	var paper = Snap("#triangle");

// //	var TriBaseLengthPerArray=[1, 0.5, 0.25 ,0.08 ,0.02];
// 	var TriBaseLengthPerArray=[1, 0.64, 0.32 ,0.16 ,0.04];
// //	var TriBaseAngleArray=[Math.PI/5, 17*Math.PI/60, 11*Math.PI/30];
// 	var TriBaseAngleArray=[Math.PI/6, Math.PI/5, Math.PI/4];
// 	var dist = function (pt1, pt2) {
//     	var dx = pt1.x - pt2.x;
//     	var dy = pt1.y - pt2.y;
//     	return Math.sqrt(dx * dx + dy * dy);
// 	};
// 	var StrkWdth=2;

// 	// drawing the triangle
// 	//parameters of the run:
// 	// Length constant for the viewable sides of the triangle
// 	var LengthAngleSideOrig=400;
// 	// Angle constant for triange
// 	var AngleOrig=TriBaseAngleArray[Math.floor(Global_info.angleRunNum%3)]; //Size of angle in radians
// 	// Length of one side of the whole abstract triangle
// 	var LengthBaseOrig=1900; //Max Base Length
// 	var BaseLengthFactor=TriBaseLengthPerArray[Math.floor(Global_info.sideRunNum%5)];//TriBaseLengthPerArray[Global_info.sideRunNum]; //Get the current percent of side length from Global_info.sideRunNum
// 	var BaseLength=LengthBaseOrig*BaseLengthFactor;

// 	var TriBaseXStartOrig=400; //Origin position in the X axis for maximal base length
// 	var TriBaseXEndOrig=LengthBaseOrig+TriBaseXStartOrig; //End position of base for maximal base length

// 	var TriBaseXStart=TriBaseXStartOrig+0.5*(1-BaseLengthFactor)*LengthBaseOrig;
// 	var TriBaseXEnd=TriBaseXStart+BaseLength;
// 	var TriBaseYPos=LengthBaseOrig+300;

// 	var TriSideXLengthIn=LengthAngleSideOrig*BaseLengthFactor;
// 	var TriSideYLengthUp=Math.tan(AngleOrig)*TriSideXLengthIn;
// //	var triBase = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXEnd,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});

// 	//drawing the triangle
// 	var triBaseLeft = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
// 	var triBaseRight = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
// 	var triRightSide = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
// 	var triLeftSide = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});

// 	//drawing the third vertex
// 	var thrdVrtxPosX=TriBaseXStartOrig+200;
// 	var thrdVrtxPosY=1000;
// 	var thrdVrtxTxt=paper.text(thrdVrtxPosX-140,thrdVrtxPosY-20,"Move dot to the top corner location").attr({"font-size": "25px"});
// 	var dotSize=5;
// 	var thirdVertex = paper.circle(thrdVrtxPosX,thrdVrtxPosY,dotSize).attr({fill:"firebrick"});

// 	thirdVertex.drag(function(dx,dy){
// 		thirdVertex.attr({cx:+x+dx,cy:+y+dy});
// 	},function(){
// 		x = thirdVertex.attr("cx");
// 		y = thirdVertex.attr("cy");
// 	},function(){
// 	});

// 	// Next Page button
// 	var ButtonPosX=TriBaseXEndOrig;
// 	var ButtonPosY=TriBaseYPos+50;
// 	var NextButtonTxt = paper.text(ButtonPosX,ButtonPosY,"Continue").attr({fontsize:50});
// 	var NextButtonRect = paper.rect(ButtonPosX-20,ButtonPosY-20,120,30,5,5).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round",fill:"lightblue"});
// 	var groupButton = paper.g(NextButtonRect,NextButtonTxt);
// 	groupButton.mouseover(function(){
//     this.attr({cursor: 'pointer'});
// 	});
// 	groupButton.click(function(){

// 	/*var leftVec= {
// 		x: lineLeft.attr("x2")-lineLeft.attr("x1"),
// 		y: lineLeft.attr("y2")-lineLeft.attr("y1")
// 	};
// 	var rightVec={
// 		x: lineRight.attr("x2")-lineRight.attr("x1"),
// 		y: lineRight.attr("y2")-lineRight.attr("y1")
// 	};*/
// 	var angleValue=90;

// 	if ((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) {
// 		alert('Please position the third vertex \n by dragging the dot to its position \n before continuing to the next page');
// 	} else {
// //	alert('The x coordinate of the third vertex is: '+thirdVertex.attr("cx")+'\n'+'The y coordinate of the third vertex is: '+thirdVertex.attr("cy")+'\n'+'The angle is: '+Math.abs(Math.round(angleValue))+' degrees');
// 	Global_info.setup='Angle_'+Math.round(AngleOrig*180/Math.PI)+'_BaseFactor_'+BaseLengthFactor;
// 	Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
// 	onNext();};
// 	});
// };