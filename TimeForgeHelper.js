// ==UserScript==
// @name         TimeForge Helper
// @namespace    ganonscrub_script
// @version      0.4
// @description  Makes TimeForge slightly less terrible
// @author       ganonscrub
// @include      *timeforge.com/Scheduler/sa/*
// @grant        none
// @updateURL	 https://raw.githubusercontent.com/ganonscrub/TimeForgeHelper/master/TimeForgeHelper.js
// ==/UserScript==

function getTimeDifferenceInHours( startStr, endStr ){
	startIsPM = startStr.search( "PM" ) != -1;
	endIsPM = endStr.search( "PM" ) != -1;
	
	startHour = parseInt( startStr.substr( 0, 2 ) );
	endHour = parseInt( endStr.substr( 0, 2 ) );
	
	startFrac = parseFloat( startStr.substr( 3, 2 ) / 60 );
	endFrac = parseFloat( endStr.substr( 3, 2 ) ) / 60;
	
	if ( startIsPM && !endIsPM ){
		startHour += 12;
		endHour += 24;
	}		
	else{
		if ( startIsPM )
			startHour += 12;
		if ( endIsPM )
			endHour += 12;
	}
	
	startNum = startHour + startFrac;
	endNum = endHour + endFrac;
	
	return Math.abs( endNum - startNum ); // in case start is PM and end is AM
}

function calculateDailyTotals(){
	targetChildren = document.getElementsByClassName( "shiftInfo" );
	targets = [];
	for ( var i = 0; i < targetChildren.length; i++ )
		targets.push( targetChildren[i].parentElement );

	for ( var i = 0; i < targets.length; i++ ){
		table = targets[i].getElementsByTagName( "table" )[0];
		curStr = table.rows[0].cells[0].innerHTML.trim();
		startStr = curStr.substr( 0, 8 );
		endStr = curStr.substr( 9, 8 );

		newCol = document.createElement( "td" );
		newCol.className = "dailyTotalTd";
		newCol.innerHTML = "Hours scheduled: ";
		newSpan = document.createElement( "span" );
		newSpan.className = "dailyTotal";
		newSpan.innerHTML = getTimeDifferenceInHours( startStr, endStr ).toString();
		newCol.appendChild( newSpan );
		
		newRow = document.createElement( "tr" ).appendChild( newCol );

		targets[i].getElementsByTagName( "table" )[0].appendChild( newRow );
	}	
}

function calculateWeeklyTotals(){
	var totalTd = document.createElement( "td" );
	totalTd.innerHTML = "Total";
	
	var table = document.getElementsByTagName( "table" )[13];
	var daysRow = table.getElementsByTagName( "tr" )[2];
	
	daysRow.appendChild( totalTd );
	
	for ( var i = 0; i < table.children[0].children.length - 2; i++ ){
		var totals = table.children[0].children[2+i].getElementsByClassName( "dailyTotal" );
		var week = 0;
		for ( var j = 0; j < totals.length; j++ )
			week += parseFloat( totals[j].innerHTML );
		
		var newTd = document.createElement( "td" );
		newTd.style.textAlign = "center";
		newTd.style.paddingRight = "2px";
		newTd.style.border = "1px solid rgb(169,169,169)";
		newTd.style.backgroundColor = "rgb(240,240,240)";
		newTd.innerHTML = week.toString() + " Hours";
		table.children[0].children[2+i].appendChild( newTd );
	}
}

function addPickUpShiftsLink(){	
	var row = document.getElementsByClassName( "links3" )[0].parentElement.parentElement;
	var tds = row.getElementsByTagName( "td" );
	var lastTd = tds[ tds.length - 1 ];
	lastTd.innerHTML = "<div class='links2'><ul><li><div><a href='/Scheduler/sa/employeeGivenUpShifts.html'>Pick Up Shifts</a></div></li></ul></div>";
}

function addPickUpShiftsDropdown(){
	var pickUpShiftsParentDropdown = document.getElementById( "schedulesBox" );
	var pickUpShiftsLi = document.createElement( "li" );
	pickUpShiftsParentDropdown.appendChild( pickUpShiftsLi );

	var pickUpShiftsLink = document.createElement( "a" );
	pickUpShiftsLi.appendChild( pickUpShiftsLink );

	pickUpShiftsLink.href = "/Scheduler/sa/employeeGivenUpShifts.html";
	pickUpShiftsLink.innerHTML = "Pick Up Shifts";
}

function addPickUpShiftsLinkMainPage(){
	var box = document.getElementById( "schedulesBox" );
	var li = document.createElement( "li" );
	li.innerHTML = "<a href='/Scheduler/sa/employeeGivenUpShifts.html'>Pick Up Shifts</a>";
	box.appendChild( li );
}

function addCheckBox(){
	var list = document.getElementsByClassName( "rightmenu" )[0];
	var a = document.createElement( "a" );
	a.href = location.href + "#";
	a.id = "cookieToggleButton";
	
	if ( jumpCookieIsTrue() )
		a.innerHTML = "Jump OFF";
	else
		a.innerHTML = "Jump ON";
	
	list.insertBefore( a, list.firstChild );
	
	a.addEventListener( "click", cookieToggle );
}

function jumpCookieExists(){
	return document.cookie.indexOf( "jumpToCal=" ) != -1;
}

function jumpCookieIsTrue(){
	return document.cookie.indexOf( "jumpToCal=true" ) != -1;
}

function cookieToggle(){
	var button = document.getElementById( "cookieToggleButton" );
	if ( jumpCookieIsTrue() ){
		document.cookie = "jumpToCal=false";
		button.innerHTML = "Jump ON";
		console.log( "jumpToCal set to false");
	}
	else{
		document.cookie = "jumpToCal=true";
		button.innerHTML = "Jump OFF";
		console.log( "jumpToCal set to true" );
		if ( onLanding() ){
			document.body.style.userSelect = "none";
			document.body.style.webkitUserSelect = "none";
			document.body.style.MozUserSelect = "none";
			location.href = "/Scheduler/sa/employeeSchedules.html";
		}
	}
}

function onCalendar(){
	return location.href.indexOf( "Scheduler/sa/employeeSchedules.html" ) != -1;
}

function onLanding(){
	return location.href.indexOf( "Scheduler/sa/index.html" ) != -1;
}


// if this is the landing page after logging in
if ( onLanding() ){
	
	// if the script has not been run and the cookie is not set
	if ( !jumpCookieExists() ){
		document.cookie = "jumpToCal=false";
		console.log( "jumpToCal not found; adding and setting default" );
	}
	else{
		if ( !jumpCookieIsTrue() ){
		}
		else{				
			document.body.style.userSelect = "none";
			document.body.style.webkitUserSelect = "none";
			document.body.style.MozUserSelect = "none";
			location.href = "/Scheduler/sa/employeeSchedules.html";
		}
	}
	
	addPickUpShiftsLinkMainPage();
	addCheckBox();
}
else if ( onCalendar() ){
	calculateDailyTotals();
	calculateWeeklyTotals();
	addPickUpShiftsLink();
	addPickUpShiftsDropdown();
	addCheckBox();
}
else{
	addPickUpShiftsLink();
	addPickUpShiftsDropdown();
	addCheckBox();
}
