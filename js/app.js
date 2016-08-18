$(function() {
    currentGame = '';
    //Switches from landing page to player info form page
    $('#playBtn').click(function() {
        $('.landing').hide();
        $('.playersInfo').show();
	    activateTurn1();
	    activateMark1();
    });
    //Disables and styles player 1 form selections
    $('.option2').click(function() {
        var id = this.id;
        $('.turn1').off('click');
        $('.mark1').off('click');
        $('.option2').css('background-color', '#ccff99');
        $('#' + id).css('background-color', '#99ff33');
        form.updateForm(id);
    });
    //Processes form submission
    $('.form').submit(function(e) {
        e.preventDefault();
        var name1 = $('input[name=name1]').val();
        var name2 = $('input[name=name2]').val();
        form.setName(name1, name2);
        $('.playersInfo').hide();
        $('.game').show();
        currentGame = newGame();
        updateTurn();
    });
    //Clears player info board
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
    //Initializes a new game
    $('#newGameBtn').click(function() {
        currentGame = newGame();
        updateTurn();
    });
});
//Reenables turn selection for player 1 
function activateTurn1() {
    $('.turn1').on('click', function() {
        var id = this.id;
        $('.turn1, .mark1').css('background-color', '#ccff99');
        $('#' + id).css('background-color', '#99ff33');
        $('.turn2').hide();
        $('.mark2').show();
        form.updateForm(id);
    });
}
//Reenables mark selection for player 1 
function activateMark1() {
    $('.mark1').on('click', function() {
        var id = this.id;
        $('.turn1, .mark1').css('background-color', '#ccff99');
        $('#' + id).css('background-color', '#99ff33');
        $('.mark2').hide();
        $('.turn2').show();
        form.updateForm(id);
    });
}
//Update board and turn when a player marks a box 
function userSelects() {
    $('.box').on('click', function() {
        var id = this.id;
        var xo = games[currentGame].moveMade(id);
        updateBoard(id, xo);
        updateTurn();
    });
}
//Mark board with an x or o
function updateBoard(id, xo) {
    if (xo == 'x') {
        setX(id);
    } else if (xo == 'o') {
        setO(id);
    }
}
//Displays whose turn it is, who won and whether the game is tied
function updateTurn() {
    if (games[currentGame].winner == '') {
        var player = games[currentGame].turn;
        $('#player').html(games[currentGame][player].name);
    } else if (games[currentGame].winner == 'Tied') {
        deactivateBoard();
        $('.playerTurn').hide();
        $('.tied').show();

    } else if (games[currentGame].winner != '') {
        deactivateBoard();
        updateWinner();
    }
}
//Displays who the winner is 
function updateWinner() {
    var winner = games[currentGame].winner;
    $('.playerTurn').hide();
    $('.winner').show();
    $('.winner #player').html(games[currentGame][winner].name);
}
//Marks a box with x and disables click on box
function setX(id) {
    $('#' + id).addClass('x');
    deactivateBox(id);
}
//Marks a box with o and disables click on box
function setO(id) {
    $('#' + id).addClass('o');
    deactivateBox(id);
}
//Disables click on box to mark x/o
function deactivateBox(id) {
    $('#' + id).off('click');
}
//Disables click on all boxes on board 
function deactivateBoard() {
    $('.box').off('click');
}
//Removes x/o marking from board
function clearBoard() {
    $('.box').removeClass('x');
    $('.box').removeClass('o');
}
//Initializes a new game
function newGame() {
    $('.playersInfo').hide();
    $('.game').show();
    clearBoard();
    $('.box').off('click');
    userSelects();
    var gameName = "Game" + (games.count + 1);

    games.new(gameName);
    games[gameName].initBoard();

    if (form.form1.first) {
        games[gameName].addPlayers(form.form1.name, form.form1.xo, form.form2.name, form.form2.xo);
    } else if (form.form2.first) {
        games[gameName].addPlayers(form.form2.name, form.form2.xo, form.form1.name, form.form1.xo);
    }

    $('.winner').hide();
    $('.tied').hide();
    $('.playerTurn').show();
    console.log(games);
    return gameName;
}
//Form object to process and store player info form submition
form = {
    form1: {
        name: '',
        first: true,
        xo: 'x',
    },
    form2: {
        name: '',
        first: false,
        xo: 'o',
    },
    updateForm: function(id) {
        if (id == 'first' || id == 'second2') {
            form.form1.first = true;
            form.form2.first = false;
        } else if (id == 'second' || id == 'first2') {
            form.form2.first = true;
            form.form1.first = false;
        } else if (id == 'x' || id == 'o2') {
            form.form1.xo = 'x';
            form.form2.xo = 'o';
        } else if (id == 'o' || id == 'x2') {
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
//Player prototype to store player Info
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
//Game prototype to manage game
Game = {
    moveCount: 0,
    player1: Object.create(Player),
    player2: Object.create(Player),
    turn: 'player1',
    winner: '',
    board: {
    	boxes: {}
    },
    //Dynamically adds box objeccts to boxes
    initBoard: function() {
    	for (var i = 1; i <= 9; i++) {
    		var box = 'box' + i;
	    	this.board.boxes[box] = {};
	    	this.board.boxes[box].selected = false;
	    	this.board.boxes[box].marked = i;
	    }
    },
    //Sets a box object with x/o when marked
    markBoard: function(id, xo) {
        this.board.boxes[id].selected = true;
        this.board.boxes[id].marked = xo;
    },
    //Adds players into game object
    addPlayers: function(player1Name, player1XO, player2Name, player2XO) {
        this.endTurn();
        this.player1.setName(player1Name);
        this.player1.pickXO(player1XO);
        this.player1.yourTurn();
        this.player2.setName(player2Name);
        this.player2.pickXO(player2XO);
    },
    //Switches turns
    changeTurn: function() {
        if (this.turn == 'player1') {
            this.player1.turn = false;
            this.player2.turn = true;
            this.turn = 'player2';
        } else if (this.turn == 'player2') {
            this.player2.turn = false;
            this.player1.turn = true;
            this.turn = 'player1';
        }
    },
    //Ends turn when a winner is found
    endTurn: function() {
        if (this.turn == 'player1') {
            this.player1.wonLostTie = 'won';
            this.player2.wonLostTie = 'lost';
        } else if (this.turn == 'player2') {
            this.player2.wonLostTie = 'won';
            this.player1.wonLostTie = 'lost';
        }
       this.player1.turn = false;
       this.player2.turn = false;
    },
    //Looks for if winning sequence of boxes are marked by the same marker (x or o)
    winnerFound: function() {
        var bx = this.board.boxes;
        if (bx.box1.selected && bx.box1.marked == bx.box2.marked && bx.box1.marked == bx.box3.marked) {
            return true;
        } else if (bx.box4.selected && bx.box4.marked == bx.box5.marked && bx.box4.marked == bx.box6.marked) {
            return true;
        } else if (bx.box7.selected && bx.box7.marked == bx.box8.marked && bx.box7.marked == bx.box9.marked) {
            return true;
        } else if (bx.box1.selected && bx.box1.marked == bx.box4.marked && bx.box1.marked == bx.box7.marked) {
            return true;
        } else if (bx.box2.selected && bx.box2.marked == bx.box5.marked && bx.box2.marked == bx.box8.marked) {
            return true;
        } else if (bx.box3.selected && bx.box3.marked == bx.box6.marked && bx.box3.marked == bx.box9.marked) {
            return true;
        } else if (bx.box1.selected && bx.box1.marked == bx.box5.marked && bx.box1.marked == bx.box9.marked) {
            return true;
        } else if (bx.box3.selected && bx.box3.marked == bx.box5.marked && bx.box3.marked == bx.box7.marked) {
            return true;
        } else {
            return false;
        }
    },
    //Processes each move
    moveMade: function(id) {
        if (this[this.turn].turn) {
            this.markBoard(id, this[this.turn].xo);
            this.moveCount++;
            if (this.moveCount >= 5) {
                if (this.winnerFound()) {
                    this.winner = this.turn;
                    this.endTurn();
                } else if (this.moveCount == 9) {
                    this.winner = 'Tied';
                    this.player1.turn = false;
                    this.player2.turn = false;
                }
            }
            var temp = this[this.turn].xo;
            this.changeTurn();
            return temp;
        }
        return '';
    },
}
//Games object to store game objects 
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
