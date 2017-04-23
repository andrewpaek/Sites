Global_info = {};
Global_info.start = Date.now();
Global_info.end = 0;
Global_info.round = 0; //0 = before change; 1 = after change
Global_info.history = [];
Global_info.sideRunNum = 0; //indicates which Triangle configuration side length is up next
Global_info.angleRunNum = 0; //indicates which Triangle configuration angle size is up next
Global_info.consent=0;
Global_info.comments=0;
Global_info.TotRuns=10; //indicates how many total runs the experiment has
//Global_info.curPage=0;
Global_info.userResponse='';
Global_info.setup='';
Global_info.userID='';

var TriBaseLengthPerArray=[1, 0.64, 0.32 ,0.16 ,0.04];
var TriBaseAngleArray=[Math.PI/6, Math.PI/5, Math.PI/4];

//Create a Random array of runs for this subject, runs #'s go from 1-10
RunNumOrder=getRandomArray(_.range(0,Global_info.TotRuns),Global_info.TotRuns);

// A function that shuffles the array
function getRandomArray(arr, size) {
	var shuffled = arr.slice(0), i = arr.length, temp, index;
	while (i--) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(0, size);
};

//animation function to create the random motion of the dots
function animateAlongPath( path, element, start, dur ) {
    var len = Snap.path.getTotalLength( path );
    Snap.animate( start, len, function( value ) {
            var movePoint = Snap.path.getPointAtLength( path, value );
            element.attr({ x: movePoint.x, y: movePoint.y });
    }, dur);
};

// Function that takes care of the slider and knob
/*
(function() {

  Snap.plugin( function( Snap, Element, Paper, global ) {
        var startDragTarget, startDragElement, startBBox, startScreenCTM;

        // Initialise our slider with its basic transform and drag funcs

        Element.prototype.initSlider = function( params ) {
                        var emptyFunc = function() {};
                        this.data('origTransform', this.transform().local );
                        this.data('onDragEndFunc', params.onDragEndFunc || emptyFunc );
                        this.data('onDragFunc', params.onDragFunc || emptyFunc );
                        this.data('onDragStartFunc', params.onDragStartFunc || emptyFunc );
               };

        // initialise the params, and set up our max and min. Check if its a slider or knob to see how we deal

        Element.prototype.sliderAnyAngle = function( params ) {
                this.initSlider( params );
                this.data("maxPosX", params.max); this.data("minPosX", params.min);
                this.data("centerOffsetX", params.centerOffsetX); this.data("centerOffsetY", params.centerOffsetY);
                this.data("posX", params.min);
                if( params.type == 'knob' ) {
                        this.drag( moveDragKnob, startDrag, endDrag );
                } else {
                        this.drag( moveDragSlider, startDrag, endDrag );
                };
        };

        // load in the slider svg file, and transform the group element according to our params earlier.
        // Also choose which id is the cap

        Paper.prototype.slider = function( params ) {
                var myPaper = this,  myGroup;
                var loaded = Snap.load( params.filename, function( frag ) {
                                myGroup = myPaper.group().add( frag );
                                myGroup.transform("t" + params.x + "," + params.y);
                                var myCap = myGroup.select( params.capSelector );
                                myCap.data("sliderId", params.sliderId);
                                myCap.sliderAnyAngle( params );
                                sliderSetAttributes( myGroup, params.attr );
                                sliderSetAttributes( myCap, params.capattr );
                        } );
                return myGroup;
        };

       // Extra func, to pass through extra attributes passed when creating the slider

        function sliderSetAttributes ( myGroup, attr, data ) {
                var myObj = {};
                if( typeof attr != 'undefined' ) {
                        for( var prop in attr ) {
                                myObj[ prop ] = attr[prop];
                                myGroup.attr( myObj );
                                myObj = {};
                        };
                };
        };

        // Our main slider startDrag, store our initial matrix settings.

        var startDrag = function( x, y, ev ) {
                startDragTarget = ev.target;
                if( ! ( this.data("startBBox") ) ) {
                        this.data("startBBox", this.getBBox());
                        this.data("startScreenCTM",startDragTarget.getScreenCTM());
                }
                this.data('origPosX', this.data("posX") ); this.data('origPosY', this.data("posY") );
                this.data("onDragStartFunc")();
        };


        // move the cap, our dx/dy will need to be transformed to element matrx. Test for min/max
        // set a value 'fracX' which is a fraction of amount moved 0-1 we can use later.

        function updateMovement( el, dx, dy ) {
                // Below relies on parent being the file svg element, 9
                var snapInvMatrix = el.parent().transform().globalMatrix.invert();
                snapInvMatrix.e = snapInvMatrix.f = 0;
                var tdx = snapInvMatrix.x( dx,dy ), tdy = snapInvMatrix.y( dx,dy );

                el.data("posX", +el.data("origPosX") + tdx) ; el.data("posY", +el.data("origPosY") + tdy);
                var posX = +el.data("posX"); //var posY = +el.data("posY");
                var maxPosX = +el.data("maxPosX");
                var minPosX = +el.data("minPosX");

                if( posX > maxPosX ) { el.data("posX", maxPosX ); };
                if( posX < minPosX ) { el.data("posX", minPosX ); };
                el.data("fracX", 1/ ( (maxPosX - minPosX) / el.data("posX") ) );
        }


        // Call the matrix checks above, and set any transformation

        function moveDragSlider( dx,dy ) {
                var posX;
                updateMovement( this, dx, dy );
                posX = this.data("posX");
                this.attr({ transform: this.data("origTransform") + (posX ? "T" : "t") + [posX,0] });
                this.data("onDragFunc")(this);
        };

        // drag our knob. Currently there is no min/max working, need to add a case for testing rotating anticlockwise beyond 0

        function moveDragKnob( dx,dy,x,y, ev ) {
                var pnt = startDragTarget.ownerSVGElement.createSVGPoint();
                pnt.x = ev.clientX; pnt.y = ev.clientY;
                var vPnt = pnt.matrixTransform(this.data("startScreenCTM").inverse());
                var transformRequestObj = startDragTarget.ownerSVGElement.createSVGTransform();

                var deg = Math.atan2(vPnt.x - this.data("startBBox").cx, vPnt.y - this.data("startBBox").cy) * 180 / Math.PI ;
                deg = deg + 180;
//              this.transform('r' + -deg + "," + ( this.data("startBBox").cx - 4 ) + "," + parseInt(this.data("startBBox").cy - -8)  );
                this.transform('r' + -deg + "," + ( this.data("startBBox").cx - this.data("centerOffsetX") ) + "," + parseInt(this.data("startBBox").cy - -this.data("centerOffsetY") )  );
                this.data("fracX", deg/360);
                this.data("onDragFunc")(this);
        }



        function endDrag() {
                this.data('onDragEndFunc')();
        };

  });

})();
*/


function trainTriangle() {
	//alert('drawTriangle'+Global_info.curPage)
	$('#triangleTrain').empty();

	var paper2 = Snap("#triangleTrain").attr({width:$(window).width(), height:$(window).height()});
	var StrkWdth=2;
	var dimx = $(window).width();
	var dimy = $(window).height();
	// drawing the triangle
	//parameters of the run:
	var LengthBaseOrig=dimx*.9; //Max Base Length
	var LengthAngleSideOrig=LengthBaseOrig*.1;
	var AngleOrig=Math.PI/4; //Size of angle in radians - 45 deg
	var BaseLengthFactor=1; //Get the current percent of side length from Global_info.sideRunNum
	var BaseLength=LengthBaseOrig*BaseLengthFactor;
    var height = Math.tan(AngleOrig)*.5*BaseLength;

	var TriBaseXStartOrig=dimx*.05; //Origin position in the X axis for maximal base length
	var TriBaseXEndOrig=LengthBaseOrig+TriBaseXStartOrig; //End position of base for maximal base length

	var TriBaseXStart=TriBaseXStartOrig+0.5*(1-BaseLengthFactor)*LengthBaseOrig;
	var TriBaseXEnd=TriBaseXStart+BaseLength;
	var TriBaseYPos=(dimy - height)*.5+height;
	var TriSideXLengthIn=LengthAngleSideOrig*BaseLengthFactor;
	var TriSideYLengthUp=Math.tan(AngleOrig)*LengthAngleSideOrig*BaseLengthFactor;
//	var triBase = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXEnd,TriBaseYPos).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round"});

	//drawing the real location of the third vertex
	var realPosition=paper2.circle(TriBaseXStart+0.5*BaseLength,TriBaseYPos-Math.tan(AngleOrig)*0.5*BaseLength,8).attr({fill:"lightblue"});


	//drawing the triangle
	var triBaseLeft = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triBaseRight = paper2.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triRightSide = paper2.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triLeftSide = paper2.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});

	//drawing the third vertex
	var textPosX = 0;
	var textPosY = 15;
	var thrdVrtxPosX= 200;
	var thrdVrtxPosY=textPosY+10;
	var thrdVrtxTxt=paper2.text(textPosX, textPosY, "Move dot to the 3rd vertex position (marked in light blue)").attr({"font-size": "20px"});
  var dotSize=5;
	var thirdVertex = paper2.circle(thrdVrtxPosX,thrdVrtxPosY,dotSize).attr({fill:"firebrick"});

    var backgroundCircle = paper2.circle(thrdVrtxPosX, thrdVrtxPosY, 15).attr({fill: "white", "fill-opacity": 0});

    backgroundCircle.drag(function(dx,dy){
        backgroundCircle.attr({cx:+x1+dx,cy:+y1+dy});
        thirdVertex.attr({cx:+x2+dx, cy:+y2+dy})
    },function(){
        x1 = backgroundCircle.attr("cx");
        y1 = backgroundCircle.attr("cy");
        x2 = thirdVertex.attr("cx");
        y2 = thirdVertex.attr("cy");
    },function(){
    });

    backgroundCircle.mouseover(function(){
        this.attr({fill: 'grey', "fill-opacity": 0.5});
    });

    backgroundCircle.mouseout(function(){
        this.attr({fill: 'white', "fill-opacity": 0});
    });

	// Next Page button
	var ButtonPosX=dimx;
	var ButtonPosY=20;
	var NextButtonTxt = paper2.text(ButtonPosX-120, ButtonPosY+20,"Continue").attr({fontsize:50});
	var NextButtonRect = paper2.rect(ButtonPosX-120-20, ButtonPosY,120,30,5,5).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round",fill:"lightblue"});
	var groupButton = paper2.g(NextButtonRect,NextButtonTxt);

	groupButton.mouseover(function(){
    this.attr({cursor: 'pointer'});
	});

	groupButton.click(function(){

    	var angleValue=90;
    	if ((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) {
    		alert('Please position the third vertex \n by dragging the dot to its position \n before continuing to the next page');
    	}
        else {
        	Global_info.setup='TrainingTrial';
        	Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
        	onNext();
        };
	});
};



function drawTriangle() {
	var timeout=10000;
	//alert('drawTriangle'+Global_info.curPage)
	$('#triangle').empty();

	var paper = Snap("#triangle").attr({width:$(window).width(),height:$(window).height()});

	var TriBaseLengthPerArray=[1, 0.64, 0.32 ,0.16 ,0.04];
	var TriBaseAngleArray=[Math.PI/6, Math.PI/5, Math.PI/4];

	var StrkWdth=2;
	var dimx = $(window).width();
	var dimy = $(window).height();

	var LengthBaseOrig=dimx*.85; //Max Base Length
	var LengthAngleSideOrig=LengthBaseOrig*.1;
	var AngleOrig=TriBaseAngleArray[Math.floor(Global_info.angleRunNum%3)]; //Size of angle in radians - 45 deg
	var BaseLengthFactor=TriBaseLengthPerArray[Math.floor(Global_info.sideRunNum%5)]; //Get the current percent of side length from Global_info.sideRunNum
	var BaseLength=LengthBaseOrig*BaseLengthFactor;
    var height = Math.tan(Math.PI/4)*.5*LengthBaseOrig

	var TriBaseXStartOrig=dimx*.05; //Origin position in the X axis for maximal base length
	var TriBaseXEndOrig=LengthBaseOrig+TriBaseXStartOrig; //End position of base for maximal base length

	var TriBaseXStart=TriBaseXStartOrig+0.5*(1-BaseLengthFactor)*LengthBaseOrig;
	var TriBaseXEnd=TriBaseXStart+BaseLength;
    //

//	var TriBaseYPos=(dimy - height)*.5+height;

	var TriBaseYPos=dimy-50;
	var TriSideXLengthIn=LengthAngleSideOrig*BaseLengthFactor;
	var TriSideYLengthUp=Math.tan(AngleOrig)*TriSideXLengthIn;

	//drawing the triangle
	var triBaseLeft = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triBaseRight = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn*1.3,TriBaseYPos).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triRightSide = paper.line(TriBaseXEnd,TriBaseYPos,TriBaseXEnd-TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});
	var triLeftSide = paper.line(TriBaseXStart,TriBaseYPos,TriBaseXStart+TriSideXLengthIn,TriBaseYPos-TriSideYLengthUp).attr({strokeWidth:StrkWdth,stroke:"black",strokeLinecap:"round"});

	var sides_array = [triBaseLeft, triBaseRight, triRightSide, triLeftSide];
	//drawing the third vertex
	var textPosX = 5;
	var textPosY = 15;
	var thrdVrtxTxt=paper.text(textPosX, textPosY, "Move dot to the 3rd vertex position (marked in light blue)").attr({"font-size": "20px"});
  var thrdVrtxPosX= 200;
  var thrdVrtxPosY=textPosY+20;
  var dotSize=4;
	var thirdVertex = paper.circle(thrdVrtxPosX,thrdVrtxPosY,dotSize).attr({fill:"firebrick"});

  var backgroundCircle = paper.circle(thrdVrtxPosX, thrdVrtxPosY, 15).attr({fill: "white", "fill-opacity": 0});

  backgroundCircle.drag(function(dx,dy){
        backgroundCircle.attr({cx:+x1+dx,cy:+y1+dy});
        thirdVertex.attr({cx:+x2+dx, cy:+y2+dy})
  },function(){
        x1 = backgroundCircle.attr("cx");
        y1 = backgroundCircle.attr("cy");
        x2 = thirdVertex.attr("cx");
        y2 = thirdVertex.attr("cy");
  },function(){
  });

  backgroundCircle.mouseover(function(){
      this.attr({fill: 'grey', "fill-opacity": 0.5});
  });

  backgroundCircle.mouseout(function(){
      this.attr({fill: 'white', "fill-opacity": 0});
  });


	var ButtonPosX=dimx;
	var ButtonPosY=40;
	var NextButtonTxt = paper.text(ButtonPosX-140, ButtonPosY+20,"Continue").attr({fontsize:50});
	var NextButtonRect = paper.rect(ButtonPosX-140-20, ButtonPosY,120,30,5,5).attr({strokeWidth:5,stroke:"black",strokeLinecap:"round",fill:"lightblue"});
	var groupButton = paper.g(NextButtonRect,NextButtonTxt);

	var seconds = timeout/1000;

//    document.getElementById("timer").innerHTML = seconds+" seconds ";

    var timeout = setTimeout(function() {
        for (i=0; i<sides_array.length;i++) {
            sides_array[i].attr({strokeWidth: 0});
        }
        thirdVertex.attr({"fill": "white"});
        times_up = true;
        alert('Time is up. Please hit the continue button');
    }, timeout);

    times_up = false;
    var interval = setInterval(function() {
        seconds=seconds-1;
//        document.getElementById("timer").innerHTML = seconds+" seconds";
        if (seconds == 0) {
            clearInterval(interval);
        }
    }, 1000);

    groupButton.mouseover(function(){
        this.attr({cursor: 'pointer'});
	});

	groupButton.click(function(){
		var angleValue=90;
		if (((thirdVertex.attr("cx")==thrdVrtxPosX)||(thirdVertex.attr("cy")==thrdVrtxPosY)||(Math.abs(Math.round(angleValue))==180)) && !times_up) {
			alert('Please position the third vertex \n by dragging the dot to its position \n before continuing to the next page');
		}
		else {
			Global_info.setup='Angle_'+Math.round(AngleOrig*180/Math.PI)+'_BaseFactor_'+BaseLengthFactor;
			Global_info.userResponse=thirdVertex.attr("cx")+'_'+thirdVertex.attr("cy")+'_'+Math.abs(Math.round(angleValue));
            // saved_while_moving: 1 for true if the user was not successful in hitting continue due to timer interruption
            Global_info.timeout = Number(times_up);
            clearInterval(interval);
            clearTimeout(timeout);
			onNext();
        };
	});
};

function submit_demographis() {
	var gender=document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
	var RightLeft=document.getElementById("RightLeft").options[document.getElementById("RightLeft").selectedIndex].value;
	var age = document.getElementById("age").value;
	var Education = document.getElementById("Education").value;

	if (gender=='' | age=='') {
//		onContinue.curPage = onContinue.curPage-1;
		return false;
	}
	else
	{
		sendRequestPost('gender',gender);
		sendRequestPost('age',age);
		sendRequestPost('RightLeft',RightLeft);
		sendRequestPost('Education',Education);
		return true;
	}
};

function getCheckedRadio(radio_group_name) {
    radio_group = document.getElementsByName(radio_group_name);
    for (var i = 0; i < radio_group.length; i++) {
		var button = radio_group[i];
		if (button.checked) {
			return button.value;
		};
	};
	return "noAnswer";
};

function logAnswersSet1_basic()
{
	var sol1_1=document.getElementById("sol1_1").value;
	var sol1_2=document.getElementById("sol1_2").value;
	var sol1_3=document.getElementById("sol1_3").value;
	var sol1_4=document.getElementById("sol1_4").value;
	sendRequestPost('sol1_1',sol1_1);
	sendRequestPost('sol1_2',sol1_2);
	sendRequestPost('sol1_3',sol1_3);
	sendRequestPost('sol1_4',sol1_4);
}

function submit_comments() {
	var comments = document.getElementById("endCommentsText").value;
	if (comments==""|| typeof comments == "undefined") {
		comments = "No comment";
	};
	sendRequestPost("EndComments",comments);
	Global_info.comments=1;
	onNext();
};


function submit_consent() {
	var radio_group = "yesno2Experiment";
	var consent = getCheckedRadio(radio_group);
	if (consent=="no"|| consent == "noAnswer") {
			return false;
	}	else{
		sendRequestPost("yesno2Experiment",consent);
		return true;
	};
};

function onNextuserdata(){
	if (submit_demographis()==false) {
		alert('please provide the requested information');
	} else	{onNext();};
};

function onNextConsentForm(){
	if (submit_consent()==false) {
		alert('If you wish to leave the study, please close the page. \n Otherwise, please check the consent button before proceeding');
	} else	{
		Global_info.consent=1;
		onNext();};
};

//What to do when people press the Continue button (Instructions,Experiment,Thanks+ID)
function onNext(){
	//alert('onNext'+Global_info.curPage)
	$('.page').hide();

	// At the beginning of the experiment - Take demographics data
	if(typeof Global_info.curPage == 'undefined') {
		Global_info.curPage = -3;
		//blank all pages
		$(".page").hide();
		$("#user_data").show();
	};

	// Get consent from participants
	if(Global_info.curPage == -2) {
		//blank all pages
		$(".page").hide();
		$("#initial_instructions").show();
	};

	// Show participants instructions
	if(Global_info.curPage == -1 && Global_info.consent==1) {
		//blank all pages
		$(".page").hide();
		trainTriangle();
		$("#TriangleTraining").show();
	};


	// Show participants the triangles
	if (Global_info.curPage<Global_info.TotRuns && Global_info.curPage>=0 && Global_info.consent==1) {
		Global_info.sideRunNum=RunNumOrder[Global_info.curPage];
		Global_info.angleRunNum=RunNumOrder[Global_info.curPage];
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		var logInfo = 'Run'+Global_info.curPage+'_'+Global_info.setup+'_Time_'+timeRound+'_UserResponse_'+Global_info.userResponse+'_timeout_'+Global_info.timeout;
		//alert(logInfo)
		sendRequestPost('data',logInfo);
		Global_info.start = Date.now();

		//Preparing the next Triangle configuration
		drawTriangle();
		$('#TriangleCompletionPages').show();
	};

	// Get comments from the participants
	if (Global_info.curPage==Global_info.TotRuns && Global_info.comments==0) {
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		var logInfo = 'Run'+Global_info.curPage+'_'+Global_info.setup+'_Time_'+timeRound+'_UserResponse_'+Global_info.userResponse;
		sendRequestPost('data',logInfo);
		Global_info.userID=sendRequestPost('timeRound',timeRound);
		Global_info.start = Date.now();

		//Hide everything and show a thank you page
		$(".page").hide();
		$("#endComments.page").show();
	};

//	if (Global_info.curPage>=Global_info.TotRuns && Global_info.comments==1) {
	if (Global_info.curPage>Global_info.TotRuns) {
		//Measuring the time it took the subject to solve the last page
		Global_info.end=Date.now();
		var timeRound =Global_info.end-Global_info.start;
		Global_info.userID=sendRequestPost('timeRound',timeRound);
		Global_info.start = Date.now();

		//Hide everything and show a thank you page
		$(".page").hide();
		$("#ThankYou.page").show();
		$("#thanks").text('Thank you for your participation.');
		$("#userID").text('Your Validation code is: ' + Global_info.userID);
	};
	Global_info.curPage++;
};

$(document).ready(function() {
	// At beginning - show instructions page
	$('.page').hide();
	$('#ConsentForm').show();
});
