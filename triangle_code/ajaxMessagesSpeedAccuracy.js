E = {}

E.userid=-1;

function test_func()
{
	alert("test")
}

function initialize_userid(){

	var rn = 0x10 + Math.floor(Math.random()*0xf0);
	var rnhex = rn.toString(16);

	var tm = time();
	tm = Math.floor(tm/1000); //convert to seconds

	tm = 0x10000 + tm % 0xf0000; //representable in 5 letters in hex
	var tmhex = tm.toString(16);

	var cs = (rn + tm)%6;
	cs += 0xa;
	var cshex = cs.toString(16);

	userid = rnhex + cshex + tmhex;



	// alert("in init userid")

	// alert(userid)

	return userid;
}



	function outputResponse(loader){
			// if(loader.xmlDoc.responseXML!=null)
				// alert("We Got Response\n\n"+loader.doSerialization())
			// else
				// alert("Response contains no XML")

		}
		function sendRequestGet(){
			if(!document.getElementById('sync').checked){
				dhtmlxAjax.get("php/processSpeedAccuracy.php?"+encodeURI(document.getElementById('params').value),outputResponse);
				alert("Request Sent");
			}else{
				var loader = dhtmlxAjax.getSync("php/processSpeedAccuracy.php?"+encodeURI(document.getElementById('params').value));
				alert("Request Sent");
				outputResponse(loader)
			}
		}
		function sendRequestPost(key,value){
				 // alert('here')

				if (E.userid==-1)
				{
					E.userid = initialize_userid()
					$(".code").text(E.userid);
				}

/*				if(!window.dhtmlxAjax){
					window.dhtmlxAjax = {
						post: function(url, data, callback){
							return dhx4.ajax.post(url, data, callback);
						},
						get: function(url, callback){
							return dhx4.ajax.get(url, callback);
						}
					};
				}
*/

//				dhtmlxAjax.post("php/process.php","uid="+E.userid+"&key="+key+"&value="+value,outputResponse);
				uid =
				$.ajax({
					method: "POST",
				   url: './php/processSpeedAccuracy.php',
				   data: {uid:E.userid, key: key, value:value},
				   success: function (response) {//response is value returned from php (for your example it's "bye bye"
				    // alert();
				   }
				});
				// alert(E.userid)

				return E.userid;
		}

		function sendRequestPostXML(new_gantt){

				if (E.userid==-1)
				{
					E.userid = initialize_userid()
				}

				dhtmlxAjax.post("php/xml_writer.php","uid="+E.userid+"&gantt="+new_gantt,outputResponse);

		}


//list membership

//timestamp in ms
function time() {
	var t = new Date();
	return t.getTime();
}

function msTime(){
	var t = new Date();
	return t.getTime();
}

//filter function objects from an object
//This does not make a deep copy.
// IE 9+
function toPrintable(obj){

	var printable = {}

	var keys = Object.keys(obj);

	for(var i=0; i<keys.length-2; i++){
		conlog(keys[i] + " " + obj[keys[i]])
		printable[keys[i]] = obj[keys[i]];
	}

	return printable;


}
