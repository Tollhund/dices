function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
}
function findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
}

function diceRoll() {
    var result;
    result = Math.floor((Math.random() * 6) + 1);
    return result;
}

function dicesDisplay(dice,roll) {
    dice.textContent = roll;
}
function dicesMain(playerid) {
	selector = "#"+playerid+">.table>";
	
	var rollone = diceRoll(),
		rolltwo = diceRoll();
    
	var diceone = document.querySelector(selector+".rollone");
	dicesDisplay(diceone,rollone);
	
    var dicetwo = document.querySelector(selector+".rolltwo");
    dicesDisplay(dicetwo,rolltwo);
	
	if(playerid == "playerone"){
		window.sumone = rollone + rolltwo; 
	} else if (playerid == "playertwo"){
		window.sumtwo = rollone + rolltwo;	
	} else {
		alert("ALARM!");
	}
}	

function game() {
    var button = document.querySelectorAll(".roll");
    for(i=0; i<button.length; i++) {
        button[i].onclick = function() {
            var playerbox = findParentBySelector(this, ".box");
            dicesMain(playerbox.id);
			if (playerbox.id == 'playerone') {
				poneturn = true;
				if (ptwoturn) {
					var board = document.querySelector('#win');
					board.textContent = isWinner(sumone, sumtwo);
					setTimeout(reset, 3000);
				}
				console.log("P1 turn ended");
			} else if (playerbox.id == 'playertwo') {
				ptwoturn = true;
				if (poneturn) {
					var board = document.querySelector('#win');
					board.textContent = isWinner(sumone, sumtwo);
					setTimeout(reset, 3000);
				}
				console.log('P2 turn ended');
			} else {
				setTimeout(reset, 3000);
				alert ("Палехче");
			}
        }
    }
    
}

function isWinner(sumone, sumtwo) {
	if (sumone > sumtwo) {
		return "Player One";
	} else if (sumtwo > sumone) {
		return "Player Two";
	} else {
		return "Nichya";
	}
}

function reset() {
	poneturn = false;
	ptwoturn = false;
	sumone = 0;
	sumtwo = 0;
	document.querySelector('#win').textContent = 'Winner:';
}

var sumone = 0,
	sumtwo = 0;
var poneturn = false,
	ptwoturn = false;
game();