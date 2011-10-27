// MUC6444 Spring 2008
// Project 3
// John David Eriksen

inlets = 1;
outlets = 2;

var boardSize = 25;
var boardCurrent = new Array(boardSize);
var boardUpdated = new Array(boardSize);
var neighborsCoords = new Array();
var neighborsVals = new Array();

var boardCurrentColumn = 0;

function init() {
	initBoards();
	initNeighborsData();
}

function initBoards() {
	for (var i = 0; i < boardSize; i++) {
		boardCurrent[i] = new Array(boardSize);
		boardUpdated[i] = new Array(boardSize);

		for (var j = 0; j < boardSize; j++) {
			boardCurrent[i][j] = 0;
			boardUpdated[i][j] = 0;
		}
	}
}

function initNeighborsData() {
	neighborsCoords = [
		[0, 0], [0, 0], [0, 0], [0, 0],
		[0, 0], [0, 0], [0, 0], [0, 0]
	];

	neighborsVals = new Array(neighborsCoords.length);
}

function neighborValid(i, j) {
	return ((i >= 0) && (i < boardSize) && (j >= 0) && (j < boardSize));
}

function neighborsGetCoords(i, j) {
	var neighborIndex = 0;

	for (var n = -1; n < 2; n++) {
		for (var m = -1; m < 2; m++) {
			if ((n != 0) || (m != 0)) {
				neighborsCoords[neighborIndex][0] = i + n;
				neighborsCoords[neighborIndex][1] = j + m;
				neighborIndex++;
			}
		}
	}

	//printNeighborsCoords();
}

function printNeighborsCoords() {
	for (var i = 0; i < neighborsCoords.length; i++) {
		var n = neighborsCoords[i][0];
		var m = neighborsCoords[i][1];
		post(n + " " + m + " " + neighborValid(n, m));
		post();
	}
	post();
}

function list() {
	if (arguments.length == boardSize) {
		boardCurrent[boardCurrentColumn] = arguments;
	}
}

function update() {
	init();
	readData();
	//printBoard(boardCurrent, "current");
	updateState();
	//printBoard(boardUpdated, "updated");
	updateBoard();
}

function readData() {
	for (var i = 0; i < boardSize; i++) {
		boardCurrentColumn = i;
		outlet(0, boardCurrentColumn);
	}
	boardCurrentColumn = 0;
}

function printBoard(board, name) {
	post("board: " + name);
	post();
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board.length; j++) {
			post(board[i][j] + " ");
		}
		post();
	}
	post();
}

function updateState() {
	for (var i = 0; i < boardCurrent.length; i++) {
		for (var j = 0; j < boardCurrent.length; j++) {
			var cellStateCurrent = boardCurrent[i][j];
			var cellStateNew, liveNeighbors = 0;

			neighborsGetCoords(i, j);

			for (var k = 0; k < neighborsCoords.length; k++) {
				var ni = neighborsCoords[k][0];
				var nj = neighborsCoords[k][1];

				if (neighborValid(ni, nj)) {
					liveNeighbors += boardCurrent[ni][nj];
				}
			}

			if (cellStateCurrent == 1) {
				cellStateNew = ((liveNeighbors >= 2) && (liveNeighbors <= 3)) ? 1 : 0;
			}
			else if (cellStateCurrent == 0) {
				cellStateNew = (liveNeighbors == 3) ? 1 : 0;
			}

			boardUpdated[i][j] = cellStateNew;
		}
	}
}

function updateBoard() {
	for (var i = 0; i < boardUpdated.length; i++) {
		for (var j = 0; j < boardUpdated.length; j++) {
			outlet(1, i, j, boardUpdated[i][j]);
		}
	}
}
