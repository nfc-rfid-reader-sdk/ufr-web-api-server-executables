var values = {
    run_loop : false,
    counter : 0,
    port_open  : false,
} 

var DlComands = {
    OPEN_PORT : "OPEN_PORT",
    CLOSE_PORT : "CLOSE_PORT",
    GET_CARD_ID_LAST_EX : "GET_CARD_ID_LAST_EX",
    GET_CARD_ID_EX : "GET_CARD_ID_EX",
    GET_DLOGIC_CARD_TYPE : "GET_DLOGIC_CARD_TYPE",
    READER_UI_SIGNAL : "READER_UI_SIGNAL",
    BLOCK_READ_PK : "BLOCK_READ_PK",
    BLOCK_WRITE_PK : "BLOCK_WRITE_PK"
    
}

var DL_OK = 0;

function printUid(arg){
     try {
     data = JSON.parse(arg)

     } catch (e) {
         data = rawResponseToObject(arg);
      }


      if(data.dlStatus == DL_OK){
       document.getElementById("card_uid_box").value = data.data;
     }else{
     document.getElementById("card_uid_box").value = "";
     }

}

function rawResponseToObject(arg){

  var temp = arg.split(',');

  var res = {

     dlStatus : temp[0].split('=')[1],
     dlMsg : temp[1].split('=')[1],
     dlCommand : temp[2].split('=')[1],
     data : temp[3].split('=')[1],
  }
  return res;

}

function clearResponseDisplay(){
    document.getElementById("res_disp").value = "";
}

function print(arg,disp_uid){

     if( document.getElementById("append_to_disp").checked == "1"){
        document.getElementById("res_disp").value =   document.getElementById("res_disp").value + "\n" + arg;
     }else{
        document.getElementById("res_disp").value = arg;
     }


    if(disp_uid){
        printUid(arg);
    }
}

function GetXmlHttpObject() {
    var xmlHttp=null;
    try {
        xmlHttp=new XMLHttpRequest();
    } catch (e) {
        try {
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}


function doAjax(param,disp_uid,callback){
    
    var url =  document.getElementById("server_url").value;
    
    var xmlHttp = GetXmlHttpObject();
    xmlHttp.open("POST", url, true);
    xmlHttp.responseType = 'text';
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function (oEvent) {
    if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
             print(this.response,disp_uid);
             console.log(this.response);
             if(callback != null && callback != undefined){
                callback(this.response);
             }
        } else {
           alert("Ajax Error" + xmlHttp.responseText + ". Please check if your SERVER is running.");
        }
      }
    }

    xmlHttp.send("uFrFunct=" +param );
    
}

function startLoop(){
    console.log("startLoop")
    values.run_loop = true;
    setInterval(function(){
        
         values.counter++;
        
        if(values.run_loop){
           console.log("run loop -> " +  values.counter);
            
            doAjax(DlComands.GET_CARD_ID_LAST_EX,true);
            
            
        }else{
          // console.log("skip loop -> " + values.counter);  
        }
        
    }, 300);
}


function stopLoop(){
     console.log("stopLoop")
     values.run_loop = false;
}

function openPort(){
      console.log("openPort")
      doAjax(DlComands.OPEN_PORT,false,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;

    });
}

function closePort(){
      console.log("closePort")
      doAjax(DlComands.CLOSE_PORT,false,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;

    });
}

function getCardIdEx(){
    if(values.run_loop){
         alert("Please first pause loop!");
         return;
     }
    
     console.log("getCardIdEx")
     doAjax(DlComands.GET_CARD_ID_EX,true,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;

    });
}

function UIsignal(){
      if(values.run_loop){
         alert("Please first pause loop!");
         return;
     }
    
     console.log("UIsignal")
     var sound = document.getElementById("sound_mode").value;
     var light = document.getElementById("light_mode").value;
     var param = DlComands.READER_UI_SIGNAL + "&iSoundMode="+ sound + "&iLightMode=" + light;
     
     doAjax(param,false,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;

    });
}

function BlockReadPK(){

    if(values.run_loop){
         alert("Please first pause loop!");
         return;
   }

   var authMode = document.getElementById("block_read_auth_mode").value;
   var key1 = document.getElementById("block_read_key1").value;
   var key2 = document.getElementById("block_read_key2").value;
   var key3 = document.getElementById("block_read_key3").value;
   var key4 = document.getElementById("block_read_key4").value;
   var key5 = document.getElementById("block_read_key5").value;
   var key6 = document.getElementById("block_read_key6").value;
   var block_address = document.getElementById("block_read_address").value;


   if(block_address < 1){
       alert("Invalid block address");
       return;
   }


    var param = DlComands.BLOCK_READ_PK + "&authMode=" + authMode + "&blockAddress=" + block_address;
    param +=  "&key1=" +  key1;
    param +=  "&key2=" +  key2;
    param +=  "&key3=" +  key3;
    param +=  "&key4=" +  key4;
    param +=  "&key5=" +  key5;
    param +=  "&key6=" +  key6;

    doAjax(param,false,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;
       document.getElementById("block_read_result").value = splitAtEvery(data.data).join(" ");
    });


}

function BlockWritePK(){

   if(values.run_loop){
         alert("Please first pause loop!");
         return;
   }



   var authMode = document.getElementById("block_write_auth_mode").value;
   var key1 = document.getElementById("block_write_key1").value;
   var key2 = document.getElementById("block_write_key2").value;
   var key3 = document.getElementById("block_write_key3").value;
   var key4 = document.getElementById("block_write_key4").value;
   var key5 = document.getElementById("block_write_key5").value;
   var key6 = document.getElementById("block_write_key6").value;
   var block_address = document.getElementById("block_write_address").value;
   var block_write_data = document.getElementById("block_write_data").value;

  if(block_address < 1){
       alert("Invalid block address");
       return;
   }

var param = DlComands.BLOCK_WRITE_PK + "&authMode=" + authMode + "&blockAddress=" + block_address + "&data=" + block_write_data;
    param +=  "&key1=" +  key1;
    param +=  "&key2=" +  key2;
    param +=  "&key3=" +  key3;
    param +=  "&key4=" +  key4;
    param +=  "&key5=" +  key5;
    param +=  "&key6=" +  key6;

    doAjax(param,false,function(res){
       data = rawResponseToObject(res);
       document.getElementById("dl_status").value = data.dlMsg;

    });
}



function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function splitAtEvery(hex){
  var arr = [];
  for(var i =0; i < hex.length; i += 2 ){
     arr.push(hex.substr(i, 2));
  }
  return arr;
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 8) {
        result.push(parseInt(str.substring(0, 8), 16));

        str = str.substring(8, str.length);
    }
    return result;
}


function getDlogicCardType(){
    if(values.run_loop){
         alert("Please first pause loop!");
         return;
     }
     console.log("getDlogicCardType")
     doAjax(DlComands.GET_DLOGIC_CARD_TYPE,false);
}