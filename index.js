function player(id) {
	this.ident = "p" + (id + 1);
	var diceQ = 2;
	var diceSumm = 0;
    var checkTurn = false;
    var playerDices = [];
    
	this.drawBox = function (plBoxSize) {
		var container = document.querySelector('#game>.row');
		var plBox = '<div id="' +
					this.ident +
					'" class="player' + " " +
					plBoxSize +
					'"><div class="row dices">' +
					drawDices(diceQ) +
					'</div><div class="button"></div></div>';
		container.innerHTML += plBox;
	}
	function drawDices(quantity) {
		var dicesBox = "";
		for (var i = 0; i < quantity; i++) {
			dicesBox += "<div class='dice " +
				checkSizeDraw(quantity)+ 
				"'></div>";
		}
		return dicesBox;
	}
	this.roll = function() {
        if(checkTurn){
            console.log("Игрок " + this.ident + " уже походил!");
        } else {
            var playerD = document.querySelectorAll('#' + this.ident + ' .dice');
            this.setDefault();
            checkTurn = true;
            for (var i = 0; i < diceQ; i++) {
                playerDices.push(new dice());
                playerDices[i].setValue(playerD[i]);
                //this.setSnakeEyes(); - подкрутка =)
                this.setDiceSumm(playerDices[i].value);
            }
		}
	}
	this.getPlayerDices = function(){
		return playerDices;
	}
	this.getDiceQ = function(){
		return diceQ;
	}
	this.setDiceSumm = function(diceValue) {
		diceSumm += diceValue;
	}
	this.getDiceSumm = function() {
		return diceSumm;
	}
	this.setDefault = function() {
		checkTurn = false;
        diceSumm = 0;
        for(var i = 0; i < playerDices.length; i++){
            playerDices[i].setValue(playerDices[i].getDiceDiv(), 0);
        }
		playerDices = [];
	}
    this.logDices = function() {
        for(var i = 0; i < playerDices.length; i++){
            console.log("Бросок игрока " + this.ident + " : " + playerDices[i].value);    
        }
    }
    this.setSnakeEyes = function () {
        for(var i = 0; i < playerDices.length; i++){
            playerDices[i].setValue(playerDices[i].getDiceDiv(), 1);
        }
    }
}
function dice() {
	this.type = "d6";
	var diceDiv = ""; 
	this.value = 0;
	this.setValue = function(div, diceValue) {
		var rNumber;
        diceDiv = div;
        if(diceValue == undefined){
            rNumber = Math.floor((Math.random() * 6) + 1);
        } else {
            rNumber = diceValue;    
        }
		diceDiv.textContent = rNumber;
		this.value = rNumber;
	}
    this.getDiceDiv = function(){
        return diceDiv;
    }
}

function checkSizeDraw(quantity) {
	switch (quantity) {
		case 0: 
			alert("Ты поц?");
			break;
		case 1:
			return 'col-12';
		case 2:
			return 'col-6';
		case 3:
			return 'col-4';
		default:
			return 'col-3';
	}
}

function checkWin(players) {
	for (var i = 0; i < players.length; i++){
		var playerDices = players[i].getPlayerDices();
		if (playerDices.length != players[i].getDiceQ()){
			return false;
		}
	}
	return true;
}

function winDisplay(players) {
	var winner = [players[0].ident];
	var winnerDiceSum = players[0].getDiceSumm();
	for (i = 1; i < players.length; i++) {
		if (players[i].getDiceSumm() > winnerDiceSum) {
			winner = [players[i].ident];
			winnerDiceSum = players[i].getDiceSumm();
		}
	}
    for (i = 0; i < players.length; i++) {
        if (players[i].getDiceSumm() == winnerDiceSum && players[i].ident != winner[0]) {
			winner.push(players[i].ident);
		}
    }
	console.log ("Winner is " + winner);
	for(var j = 0; j < players.length; j++) {
		players[j].setDefault();
	}
}

function rollEvent(players) {
	var buttons = document.querySelectorAll('.button');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].onclick = function() {
			var buttonParent = findParentBySelector(this, '.player');
			for (var j = 0; j < players.length; j++) {
				if (buttonParent.id == players[j].ident) {
					players[j].roll();
                    players[j].logDices();
					if (checkWin(players)) {
						winDisplay(players);
					}
				}
			}
		}
	}
}

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

function game(){
	var players = [];
	var plBoxSize = "";
	var plQ = +prompt("Введите количество игроков", "0");

	plBoxSize = checkSizeDraw(plQ);

	for (var i = 0; i < plQ; i++ ) {
		players.push(new player(i));
		players[i].drawBox(plBoxSize);
		console.log("Player " + players[i].ident + " added");
	}
	rollEvent(players);
}

game();
