// ==UserScript==
// @name         TimeForge Helper
// @namespace    ganonscrub_script
// @version      0.1
// @description  Makes TimeForge slightly less terrible
// @author       ganonscrub
// @include      *timeforge.com/*employeeSchedules*
// @grant        none
// @updateURL	 https://raw.githubusercontent.com/ganonscrub/TimeForgeHelper/master/TimeForgeHelper.js
// ==/UserScript==

targetChildren = document.getElementsByClassName( "shiftInfo" );
targets = [];
for ( var i = 0; i < targetChildren.length; i++ )
	targets.push( targetChildren[i].parentElement );

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
	else
	{
		if ( startIsPM )
			startHour += 12;
		if ( endIsPM )
			endHour += 12;
	}
	
	startNum = startHour + startFrac;
	endNum = endHour + endFrac;
	
	return Math.abs( endNum - startNum ); // in case start is PM and end is AM
}

for ( var i = 0; i < targets.length; i++ ){
	table = targets[i].getElementsByTagName( "table" )[0];
	curStr = table.rows[0].cells[0].innerHTML.trim();
	startStr = curStr.substr( 0, 8 );
	endStr = curStr.substr( 9, 8 );

	newCol = document.createElement( "td" );
	newCol.innerHTML = "Hours scheduled: " + getTimeDifferenceInHours( startStr, endStr ).toString();
	
	newRow = document.createElement( "tr" ).appendChild( newCol );

	targets[i].getElementsByTagName( "table" )[0].appendChild( newRow );
}