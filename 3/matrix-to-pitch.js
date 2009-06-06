// MUC6444 Spring 2008
// Project 3
// John David Eriksen

inlets = 4;
outlets = 2;

var boardSize = 25;
var octave = 12;
var basePitch = 60; // MIDI C
var noteColumn = new Array(boardSize);
var activeNotes = new Array(octave);
var playFlag = false;
var currentColumn = 0;


function matrix_data() {
	if (arguments.length == boardSize) {
		noteColumn = arguments;
	}

	emitPitches(noteColumn, activeNotes);
}

function table_data() {
	if (arguments.length == octave) {
		activeNotes = arguments;
	}
	
	//printArray(activeNotes, "table data");
}

function update() {
	//post("update: " + arguments[0]);
	//post();
	playFlag = false;
}

function matrix_column() {
	currentColumn = arguments[0];
	//post("read_data: " + currentColumn);
	//post();
	
	read_table();
	playFlag = true;
}

function read_table() {
	//post("read_table");
	//post();
	outlet(1, 1);
}

function printArray(array, name) {
	post("array: " + name);
	post();
	for (var i = 0; i < array.length; i++) {
		post(array[i] + " ");
	}
	post();
}

function emitPitches(column) {
	//printArray(column, "matrix column");
	var pitch = 0;
	var velocity = 0;
	var baseNote = 0;
	var octaveOffset = 0;
	var mappedPitchVelocity = new Array(2);

	for (var i = 0; i < column.length; i++) {
		if ((column[i] == 1) && playFlag) {
			baseNote = Math.abs(i - (boardSize - 1));
			octaveOffset = Math.floor(baseNote / octave);

			baseNote %= octave;

			mappedPitchVelocity = mapBaseNoteToTable(baseNote, activeNotes);
			baseNote = mappedPitchVelocity[0];
			velocity = mappedPitchVelocity[1];
			
			pitch = basePitch + baseNote + (octaveOffset * octave);

	              //post("oct: " + octaveOffset + " baseNote: " + baseNote + " pitch: " + pitch); post();
			scheduleNote(pitch, velocity);
		}
	}

	if (currentColumn == (boardSize - 1)) {
		playFlag = false;
	}
}

function mapBaseNoteToTable(baseNote, pitchTable) {
	var velocity = 0;
	var mappedNote = baseNote;
	var mappedVelocity = 0;
	var lastNote = 0;
	var lastVelocity = 0;
	var noteFound = false;

	for (var i = 0; i < pitchTable.length; i++) {
		velocity = pitchTable[i];
		if (velocity > 0) {
			if (baseNote <= i) {
				//post("velocity: " + velocity + " baseNote: " + baseNote + " i: " + i); post();
				
				mappedNote = i;
				mappedVelocity = velocity;
				noteFound = true;
				break;
			}
			else {
				lastNote = i;
				lastVelocity = velocity;
			}
		}
	}

	if (!noteFound) {
		mappedNote = lastNote;
		mappedVelocity = lastVelocity;
	}

	//post("MAP( base: " + baseNote + " mappedNote: " + mappedNote +")");
	//post();

	return [mappedNote, mappedVelocity];
}

function scheduleNote(pitch, velocity) {
	var repetitionScaler = 25;
	var initialDelayScaler = 40;
	var noteDurationScaler = 10;
	var noteDurationBase = 200;
	
	if ((velocity >= 0) && (velocity <= 127)) {
		var repetitions = Math.ceil(velocity / repetitionScaler);
		var initialdelay = 0;

		for (var i = 0; i < repetitions; i++) {
			var noteTask = new Task(emitNote, this);
			initialdelay = velocity * Math.round(Math.random() * initialDelayScaler);

			noteTask.pitch = pitch; // XXX set pitch here
			noteTask.duration = Math.ceil(Math.random() * velocity * noteDurationScaler) + noteDurationBase;
			noteTask.velocity = 127 - Math.round(Math.random() * velocity);
			noteTask.repeat(0, initialdelay);
		}
	}
}  

function emitNote() {
	pitch = arguments.callee.task.pitch;
	velocity = arguments.callee.task.velocity;
	duration = arguments.callee.task.duration;

	outlet(0, pitch, velocity, duration);
}
emitNote.local = 1;
