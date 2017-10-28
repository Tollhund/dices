// конструктор игрока
function player(id) {
	this.ident = "p" + (id + 1);
	var diceQ = 2;
	var diceSumm = 0;
    var checkTurn = false;
    var playerDices = [];
	var pButtonDiv = "";
	var playerDiv = "";
    var pDicesDiv = "";
	
	this.drawBox = function (plBoxSize) {
		var container = document.querySelector('#game>#playerBox');
		playerDiv = document.createElement('div');
		playerDiv.id = this.ident;
		playerDiv.className = 'player ' + plBoxSize;
		container.appendChild(playerDiv);
		
		pDicesDiv = document.createElement('div');
		pDicesDiv.className = "row dices";
		playerDiv.appendChild(pDicesDiv);
		
		drawDices();
		
		pButtonDiv = document.createElement('div');
		pButtonDiv.className = 'button';
		playerDiv.appendChild(pButtonDiv);
		
		// первый вариант кода добавляющий кубики и 								кнопку
		/*var plBox = '<div id="' + 
					this.ident +
					'" class="player' + " " +
					plBoxSize +
					'"><div class="row dices">' +
					drawDices(diceQ) +
					'</div><div class="button"></div></div>';
		
		container.innerHTML += plBox;*/
	}
	function drawDices() {
		for (var i = 0; i < diceQ; i++) {
			var diceDiv = document.createElement('div');
			diceDiv.className = "dice " + checkSizeDraw(diceQ);
			pDicesDiv.appendChild(diceDiv);
		}
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
	this.getDiceQ = function() {
		return diceQ;
	}
	this.getPlayerDiceDiv = function() {
		return pDicesDiv;
	}
	this.getPlayerDiv = function() {
		return playerDiv;
	}
	this.getPlayerButton = function() {
		return pButtonDiv;
	}
    this.setDiceQ = function(quantity) {
        diceQ = quantity;
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
    //this.setSnakeEyes = function () {
        //for(var i = 0; i < playerDices.length; i++){
            //playerDices[i].setValue(playerDices[i].getDiceDiv(), 1);
        //}
    //} 
}

// конструктор кубиков
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

//создание <div> в зависимости от количества
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

//функция кнопки броска кубиков
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

// функция Drag'n'Drop
function dragEvent(players) {
	for (var i = 0; i < players.length; i++) {
		(function(i){
			players[i].getPlayerDiv().onmousedown = function(e) {
			var target = e.target;
			console.log(players[i].getPlayerButton());
			if (target != players[i].getPlayerButton()) {
				var dragBox = document.createElement('div');
				dragBox.className = "dragBox";
				dragBox.id = this.id;
				console.log(dragBox.id);
				document.body.appendChild(dragBox);

				dragBox.style.top = e.pageY - dragBox.offsetHeight/2 - 1 + 'px';
				dragBox.style.left = e.pageX - dragBox.offsetWidth/2 - 1 + 'px';

				document.onmousemove = function(e) {
					dragBox.style.top = e.pageY - dragBox.offsetHeight/2 - 1 + 'px';
					dragBox.style.left = e.pageX - dragBox.offsetWidth/2 - 1 + 'px';
				}

				dragBox.onmouseup = function(e) {
					if(e.pageX > compareWin.rect.left && e.pageX < compareWin.rect.right && e.pageY > compareWin.rect.top && e.pageY < compareWin.rect.bottom) {
						compareWin.drawPlayer(dragBox.id);
					}

					var start = Date.now();
					var opac = 1;
					var timer = setInterval(function(){
						var timedPassed = Date.now() - start;

						if(timedPassed >= 400) {
							clearInterval(timer);
							document.body.removeChild(dragBox);
						}
						opac -= 0.1;
						dragBox.style.opacity = opac;
					},40);

					document.onmousemove = null;
					dragBox.onmouseup = null;

				}
			}
		}
		})(i);
	}
}

//findParentBySelector function
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

// выяснение победителя
var compareWin = {
	div: document.getElementById('compareTwo'),

	rect: {}, // объект с координатами поля

	box: "",
	
	compPlayersArr: [],

	colBox: function() {
		var box = '<div class="compBox"></div>';
		compareWin.div.innerHTML += box;
		compareWin.box = document.querySelector(".compBox");
		compareWin.setRect();
	},
	setRect: function() {
		compareWin.rect = compareWin.box.getBoundingClientRect();
	},
	
	checkUnic: function(id) {
		for (var i = 0; i < compareWin.compPlayersArr.length; i++) {
			if (compareWin.compPlayersArr[i].id == id) {
				return false;
			}
		}
		return true;
	},
	
	checkSize: function() {
		var arrL = compareWin.compPlayersArr;
		var divSplit;
		for (var i = 0; i < arrL.length; i++) {
			divSplit = arrL[i].className.split(" ");
			divSplit[0] = checkSizeDraw(arrL.length);
			arrL[i].className = divSplit.join(" ");
		}
	},
	
	drawPlayer: function(dragPlayerId) {
		if (compareWin.checkUnic(dragPlayerId)) {
			var playerDiv = document.createElement('div');
			playerDiv.className = 'col-12 comparePlayer';
			playerDiv.id = dragPlayerId;
			compareWin.box.appendChild(playerDiv);
			compareWin.compPlayersArr.push(playerDiv);
			compareWin.checkSize();
		}
	},
}

// main
function game(){
	var players = [];
	var plBoxSize = "";
	var plQ = +prompt("Введите количество игроков", "0");
	
	plBoxSize = checkSizeDraw(plQ);

	for (var i = 0; i < plQ; i++ ) {
		players.push(new player(i));
        var diceQuantity = +prompt( "Cколько кубиков у" + players[i].ident + "?" );
        players[i].setDiceQ(diceQuantity);
		players[i].drawBox(plBoxSize);
		console.log("Player " + players[i].ident + " added");
	}
	rollEvent(players);
	dragEvent(players);
	compareWin.colBox();
	console.log(compareWin.rect.bottom);
}

game();
