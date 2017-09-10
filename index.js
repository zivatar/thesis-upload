var fileData;
var currentState;
var states = {
	SELECT_FILE: { id: "SELECT_FILE", nextState: "SELECT_COLUMNS" },
	SELECT_COLUMNS: { id: "SELECT_COLUMNS", nextState: "UPLOAD_ROWS" },
	UPLOAD_ROWS: { id:"UPLOAD_ROWS", nextState: "FINISHED" },
	FINISHED: { id: "FINISHED" }
}

function setState(newState) {
  if (newState in states) {
    currentState = newState;
    for (var i in states) {
      if (i == newState) {
        $('#'+i).show();
      } else {
        $('#'+i).hide();
      }
    }
  }
}

function nextState() { 
	if (!!states[currentState] && !!states[currentState].nextState) {
		setState(states[currentState].nextState);
	}
}

function handleFileSelect(evt) {
  var file = evt.target.files[0];
 
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      fileData = results;
      console.log(fileData);
    }
  });
}

