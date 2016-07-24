$(function(){
	currentGame = '';
	form = {
		form1:{
			name: '',
			first: true,
			xo: 'x',
		},
		form2:{
			name: '',
			first: false,
			xo: 'o',
		},
		updateForm: function(id) {
			if (id == 'first' || id == 'second2') {
				form.form1.first = true;
				form.form2.first = false;
			}
			else if (id == 'second' || id == 'first2') {
				form.form2.first = true;
				form.form1.first = false;
			}
			
			else if (id == 'x' || id == 'o2') {
				form.form1.xo = 'x';
				form.form2.xo = 'o';
			}
			else if (id == 'o' || id == 'x2') {
				form.form2.xo = 'x';
				form.form1.xo = 'o';
			}
		},
		setName: function(name1, name2) {
			form.form1.name = name1;
			form.form2.name = name2;
		},
		reset: function() {
			form.form1.first = true;
			form.form2.first = false;
			form.form1.xo = 'x';
			form.form2.xo = 'o';
		},
	}

	$('#playBtn').click(function() {
		$('.landing').hide();
		$('.playersInfo').show();
	});

	$('#playPC').click(function() {
		$('.landing').hide();
		$('.playersInfo').show();
	});

	activateTurn1();
	activateMark1();

	$('.option2').click(function() {
		var id = this.id;
		$('.turn1').off('click');
		$('.mark1').off('click');
		$('.option2').css('background-color', '#ccff99');
		$('#'+id).css('background-color', '#99ff33');
		form.updateForm(id);
	});
	$('.form').submit(function(e){
		e.preventDefault();
		var name1 = $('input[name=name1]').val();
		var name2 = $('input[name=name2]').val();
		form.setName(name1, name2);
		$('.playersInfo').hide();
		$('.game').show();
		newGame();
	});
	$('#resetBtn').click(function() {
		form.reset();
		$('.turn1, .mark1, .option2').css('background-color', '#ccff99');
		$('.turn2').show();
		$('.mark2').show();
		$('.turn1').off('click');
		$('.mark1').off('click');
		activateTurn1();
		activateMark1();
	});

	function activateTurn1() {
		$('.turn1').on('click', function() {
			var id = this.id;
			$('.turn1, .mark1').css('background-color', '#ccff99');
			$('#'+id).css('background-color', '#99ff33');
			$('.turn2').hide();
			$('.mark2').show();
			form.updateForm(id);
		});
	}

	function activateMark1() {
		$('.mark1').on('click', function() {
			var id = this.id;
			$('.turn1, .mark1').css('background-color', '#ccff99');
			$('#'+id).css('background-color', '#99ff33');
			$('.mark2').hide();
			$('.turn2').show();
			form.updateForm(id);
		});
	}
	
	$('#newGameBtn').click(function() {
	  	newGame();
	 });

});

function userSelects() {
	$('.box').on('click', function() {
		var id = this.id;
		var xo = games[currentGame].moveMade(id);
		updateBoard(id, xo);
		updateTurn();
	});
}

function updateBoard(id, xo) {
	if (xo == 'x'){
		setX(id);
	}
	else if (xo == 'o') {
		setO(id);
	}
}

function updateTurn() {
	if (games[currentGame].winner == '') {
		var player = games[currentGame].turn;
		$('#player').html(games[currentGame][player].name);
	}
	else if (games[currentGame].winner != '') {
		deactivateBoard();
		updateWinner();
	}
}

function updateWinner() {
	var winner = games[currentGame].winner;
	$('.playerTurn').hide();
	$('.winner').show();
	$('.winner #player').html(games[currentGame][winner].name);
}

function setX(id) {
	$('#'+id).addClass('x');
	deactivateBox(id);
}

function setO(id) {
	$('#'+id).addClass('o');
	deactivateBox(id);
}

function deactivateBox(id) {
	$('#' +id).off('click');
}

function deactivateBoard() {
	$('.box').off('click');
}

function clearBoard() {
	$('.box').removeClass('x');
	$('.box').removeClass('o');
}

function newGame() {
	$('.playersInfo').hide();
	$('.game').show();
	clearBoard();
	$('.box').off('click');
	userSelects();
	gameName = "Game" + (games.count + 1);
	
	games.new(gameName);
	currentGame = gameName;
		//add players info into newgame
	if (form.form1.first) {
		games[gameName].addPlayers(form.form1.name, form.form1.xo, form.form2.name, form.form2.xo);
	}
	else if (form.form2.first) {
		games[gameName].addPlayers(form.form2.name, form.form2.xo, form.form1.name, form.form1.xo);
	}
	$('#winner').hide();
	$('#player').show();
	updateTurn();
}

Board = {
	boxes: {
		box1: {
			selected: false,
			marked: '',
		}, 
		box2: {
			selected: false,
			marked: '',
		}, 
		box3: {
			selected: false,
			marked: '',
		}, 
		box4: {
			selected: false,
			marked: '',
		}, 
		box5: {
			selected: false,
			marked: '',
		}, 
		box6: {
			selected: false,
			marked: '',
		}, 
		box7: {
			selected: false,
			marked: '',
		}, 
		box8: {
			selected: false,
			marked: '',
		}, 
		box9: {
			selected: false,
			marked: '',
		} 
	},
	mark: function(id, xo) {
		this.boxes[id].selected = true;
		this.boxes[id].marked = xo;
	},
	clear: function() {
		for (var box in this.boxes) {
			this.boxes[box].selected = false;
			this.boxes[box].marked = '';
		}
	}
}

Player = {
	name: '',
	xo: '',
	turn: false,
	wonLostTie: '',
	setName: function(nm) {
		this.name = nm;
	},
	pickXO: function(xo) {
		this.xo = xo;
	},
	yourTurn: function() {
		this.turn = true;
	},
}

Game = {
	moveCount: 0,
	player1: Object.create(Player), 
	player2: Object.create(Player),
	turn: 'player1',
	board: Object.create(Board),
	winner: '',
	player1Mvs: [],
	player2Mvs: [],
	addPlayers: function(player1Name, player1XO, player2Name, player2XO) {
			this.endTurn();
			this.player1.setName(player1Name);
			this.player1.pickXO(player1XO);
			this.player1.yourTurn();
			this.player2.setName(player2Name);
			this.player2.pickXO(player2XO);
	},
	changeTurn: function () {
		if (this.turn == 'player1') {
			this.player1.turn = false;
			this.player2.turn = true;
			this.turn = 'player2';
		}
		else if (this.turn == 'player2') {
			this.player2.turn = false;
			this.player1.turn = true;
			this.turn = 'player1';
		}
	},
	endTurn: function () {
		if (this.turn == 'player1') {
			this.player1.wonLostTie = 'won';
			this.player2.wonLostTie = 'lost';
		}
		else if (this.turn == 'player2') {
			this.player2.wonLostTie = 'won';
			this.player1.wonLostTie = 'lost';
		}
		this.p1Turn = false;
		this.p2Turn = false;
	},
	winnerFound: function() {
		if (this.board.boxes.box1.marked != '' && this.board.boxes.box1.marked == this.board.boxes.box2.marked && this.board.boxes.box1.marked == this.board.boxes.box3.marked)  {
			return true;
		} 
		else if (this.board.boxes.box4.marked != '' && this.board.boxes.box4.marked == this.board.boxes.box5.marked && this.board.boxes.box4.marked == this.board.boxes.box6.marked)  {
			return true;
		}  
		else if (this.board.boxes.box7.marked != '' && this.board.boxes.box7.marked == this.board.boxes.box8.marked && this.board.boxes.box7.marked == this.board.boxes.box9.marked)  {
			return true;
		} 
		else if (this.board.boxes.box1.marked != '' && this.board.boxes.box1.marked == this.board.boxes.box4.marked && this.board.boxes.box1.marked == this.board.boxes.box7.marked)  {
			return true;
		} 
		else if (this.board.boxes.box2.marked != '' && this.board.boxes.box2.marked == this.board.boxes.box5.marked && this.board.boxes.box5.marked == this.board.boxes.box8.marked)  {
			return true;
		} 
		else if (this.board.boxes.box3.marked != '' && this.board.boxes.box3.marked == this.board.boxes.box6.marked && this.board.boxes.box3.marked == this.board.boxes.box9.marked)  {
			return true;
		} 
		else if (this.board.boxes.box1.marked != '' && this.board.boxes.box1.marked == this.board.boxes.box5.marked && this.board.boxes.box1.marked == this.board.boxes.box9.marked)  {
			return true;
		} 
		else if (this.board.boxes.box3.marked != '' && this.board.boxes.box3.marked == this.board.boxes.box5.marked && this.board.boxes.box3.marked == this.board.boxes.box9.marked)  {
			return true;
		} 
		else {
			return false;
		}	
	},
	moveMade: function(id) {
		if (this[this.turn].turn) {
			this[this.turn + 'Mvs'].push(id);
			this.board.mark(id, this[this.turn].xo);
			this.moveCount++;
			if (this.moveCount >= 5) {
				if (this.winnerFound()) {
					this.winner = this.turn;
					this.endTurn();
				}
			}
			var temp = this[this.turn].xo;
			this.changeTurn();
			return temp;
		}
		return '';
	},
}

games = {
	count: 0,
	new: function(gameName) {
		games[gameName] = Object.create(Game);
		games.count++;
	},
	reset: function() {
		for (var game in games) {
			if (game != 'count' && game != 'new' && game != 'reset') {
				delete games[game];
			}
		}
		games.count = 0;
	},
}