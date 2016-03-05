var g_pollingActive = true;
var g_pollResponded = true;
var lastUpdateTime = 0;
var lastUpdateTimeU = 0;
var lastUpdateId = 0;
var registers = 0;
var messages = 0;
var connection = 0;
var refreshPeriod = 1000;
var serverRunning = true;

var g_ServerURL = "http://"+location.host;

function SendToServer(url, command, data, callback)
{
	if (url == "null")
		return "";
	var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url+'/'+command, true);
    xmlHttp.send( data );	
	xmlHttp.onreadystatechange = function(e) 
	{
		if ( xmlHttp.readyState === 4 ) 
		{		
			if(callback)
				callback(xmlHttp.responseText, xmlHttp.status);
		}		
		else
		{
			//alert(xmlHttp.readyState);
		}
	}
    return xmlHttp.responseText;
}

function handlePollResponse(text, httpStatus)
{
	g_pollResponded = true;
	if(httpStatus == 0)
	{
		//show connection warning only on second poll failure, 
		//to stop showing warning when changing pages
		if(serverRunning == false)		
			ShowPopup("WARNING", "MODAL", "Connection to server Lost!", "SERVER_CONNECTION_WARNING");
		serverRunning = false;
		return;
	}
	else
	{
		serverRunning = true;
		refreshPeriod = 250;
		closeDialog("SERVER_CONNECTION_WARNING"); //connection restored, close warning			
		if(httpStatus == 403)
		{
			refreshPeriod = 5000;
			ShowPopup("WARNING", "MODAL", "Server access denied!", "SERVER_CONNECTION_DENIED");							
			return;
		}	
		if(httpStatus == 404)
		{
			ShowPopup("WARNING", "MODAL", "Server command not found!", "SERVER_UNKNOWN_QUERY");							
			refreshPeriod = 5000;			
			return;
		}				
		else
			closeDialog("SERVER_CONNECTION_DENIED"); //connection restored, close warning			
	}
	if(text.length > 0)
	{			
		// do data handling
	}
}

//continuously polls data from server if polling is enabled
function Poll() 
{			
	if(g_pollResponded == true && g_pollingActive == true)
	{
		g_pollResponded = false;
		var textToSend = " ";
		textToSend = "PollData";
		SendToServer(g_ServerURL, "Poll", textToSend, handlePollResponse);
	}
	setTimeout(Poll, refreshPeriod);   
}

function togglePolling()
{
	g_pollingActive = !g_pollingActive;	
	if(g_pollingActive == true)
		refresh();
}

var dialogsList = []
var dialogIdsCounter = 0;

//shows popup dialog, already existing dialogID can be given to prevent additional popups
//if no dialogID is given, it will be generated
function ShowPopup(type, modal, message, dialogID)
{	
	var dlgExists = false;
	var dlg;
	//search for already existing dialog
	for(i=0; i<dialogsList.length; ++i)
	{
		if(dialogsList[i].id == dialogID)
		{
			dlgExists = true;
			dialogsList[i].show(message);
		}
	}
	if(dlgExists == false)
	{
		dlg = new Popup(type, modal, message, dialogID);
		dialogsList.splice(-0, 0, dlg);
	}
}

//creates popup dialog object
//types: INFO, WARNING, ERROR
function Popup(type, modal, message, dialogID)
{
	if(dialogID == undefined)
		this.id = "dialog"+(dialogIdsCounter+1).toString();
	else
		this.id = dialogID;
	dialogIdsCounter = dialogIdsCounter + 1;
	this.type = type;	
	
	var msgDiv = document.createElement("div");	
	msgDiv.id = this.id;
	
	var backGrndFULL = document.createElement("div");
	backGrndFULL.id = "backGrndFULL";
	
	backGrndFULL.style.position = "fixed";
	backGrndFULL.style.top = "0";
	backGrndFULL.style.left = "0";
	backGrndFULL.style.height = "100%";
	backGrndFULL.style.width = document.body.offsetWidth + "px";
	backGrndFULL.style.zIndex= "999";
	
	if(modal == "MODAL")
	{
		backGrndFULL.style.backgroundColor="#303030";
		backGrndFULL.style.opacity="0.6";
	}
	else 
	{
		backGrndFULL.style.opacity="0.6";
	}

	var backGrnd = document.createElement("div");
	backGrnd.id = "backGrnd";	
//Style PopUP	
	backGrnd.style.position = "fixed";
	backGrnd.style.top = "40%";
	backGrnd.style.right = "40%";
	backGrnd.style.width = "25%";
	backGrnd.style.zIndex= "1000";
	backGrnd.style.borderRadius = "10px";
	backGrnd.style.padding = "5px 5px 5px 5px";
	backGrnd.style.backgroundColor = "#E0E0E0";
	
	if(type == "INFO")
	{
		backGrnd.innerHTML = "<b>INFO</b>";
		backGrnd.style.border = "thick solid #75AD10";
	}
	else if (type == "ERROR") 
	{
		backGrnd.innerHTML = "<b>ERROR</b>";
		backGrnd.style.border = "thick solid red";
	}
	else if ( type == "WARNING")
	{
		backGrnd.innerHTML = "<b>WARNING</b>";
		backGrnd.style.border = "thick solid orange";
	}
	else 
	{
		backGrnd.innerHTML = "<b>UNKNOWN TYPE</b>";
		backGrnd.style.border = "thick solid #75AD10";
	}

// end PopUp style	
	var btn = document.createElement("input");
	btn.value = "close";
	btn.type = "button";
//Style BTN close
	btn.style.width = "75px";
	btn.style.height = "30px";
	btn.style.margin = "2px";
	btn.style.position = "relative";
// end BTN style close
	var myID = this.id;
	this.show = function(msg)
	{
		var txt = document.getElementById(this.textFieldId);
		txt.innerHTML = msg;
	}
	this.close = function() 
	{
		var me=document.getElementById(this.id); 
		if(me != undefined)
		{
			me.parentElement.removeChild(me);
		}
		else
			alert("me = undefined");
	}
	btn.onclick = function(){ closeDialog(myID); }
		
	var txt = document.createElement("p");
//Style TXT
	txt.style.width = "100%";
	txt.style.height = "60%";
	txt.style.position = "relative";
// end TXT style
	txt.innerHTML = message;	
	txt.id = this.id+"_msg";
	this.textFieldId = txt.id
	backGrnd.appendChild(txt);	
	backGrnd.appendChild(btn);
	
	btn = document.createElement("input");
	btn.value = "close all";
	btn.type = "button";
//Style BTN close all
	btn.style.width = "75px";
	btn.style.position = "relative";
	btn.style.height = "30px";
	btn.style.margin = "2px";
//end Style BTN close all
	
	btn.onclick = function() { closeAllDialogs(); }
	backGrnd.appendChild(btn);
	msgDiv.appendChild(backGrndFULL);
	msgDiv.appendChild(backGrnd);
	
	document.body.appendChild(msgDiv);
}

//closes all dialogs
function closeAllDialogs()
{
	for(i=dialogsList.length-1; i>=0; --i)	
		dialogsList[i].close();			
	dialogsList = [];
}

//closes dialog by id
function closeDialog(id)
{
	var i;
	var dlgExists = false;
	for(i=dialogsList.length-1; i>=0; --i)
	{
		if(dialogsList[i].id == id)
		{
			dlgExists = true;
			dialogsList[i].close();		
			break;
		}
	}
	if(dlgExists)
		dialogsList.splice(i, 1);
}