var fileData;
var currentState = "SELECT_FILE";
var states = {
	SELECT_FILE: { nextState: "SELECT_COLUMNS" },
	SELECT_COLUMNS: { nextState: "UPLOAD_ROWS" },
	UPLOAD_ROWS: { nextState: "FINISHED" },
	FINISHED: {}
}
function nextState() { 
	if (!!states[currentState] && !!states[currentState].nextState) {
		currentState = states[states[currentState].nextstate];
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
