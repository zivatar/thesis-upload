var fileData;
var currentState;
var states = {
	SELECT_FILE: { id: "SELECT_FILE", nextState: "SELECT_COLUMNS" },
	SELECT_COLUMNS: { id: "SELECT_COLUMNS", nextState: "UPLOAD_ROWS" },
	UPLOAD_ROWS: { id:"UPLOAD_ROWS", nextState: "FINISHED" },
	FINISHED: { id: "FINISHED" }
}

var weatherParameters = [
  { id: "NA", name: "-" },
  { id: "date", name: "Dátum" },
  { id: "relativePressure", name: "Relatív légnyomás (hPa)" },
  { id: "tempIndoor", name: "Szobahőmérséklet (°C)" },
  { id: "rhIndoor", name: "Relatív nedvesség a szobában (%)" },
  { id: "temperature", name: "Hőmérséklet (°C)" },
  { id: "relativeHumidity", name: "Relatív nedvesség (%)" },
  { id: "dewpoint", name: "Harmatpont (°C)" },
  { id: "windChill", name: "Hőérzet (°C)" },
  { id: "windSpeed", name: "Szélsebesség (m/s)" },
  { id: "windDirection", name: "Szélirány (°)" },
  { id: "windGustSpeed", name: "Széllökés sebesség (m/s)" },
  { id: "precipitation", name: "Csapadékmennyiség (mm)" }
];

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
    header: false,
    dynamicTyping: true,
    complete: function(results) {
      fileData = results;
      if (!!fileData.data) {
        nextState();
        renderColumnSelector();
      } else {
        console.error('something bad happened');
      }
    }
  });
}

function renderWeatherParameterOption(row) {
  var selectList = document.createElement("select");
  selectList.setAttribute("id", "selectColumn"+row);

  for (var i = 0; i < weatherParameters.length; i++) {
    var option = document.createElement("option");
    option.setAttribute("value", weatherParameters[i].id);
    option.text = weatherParameters[i].name;
    selectList.appendChild(option);
  }

  return selectList;
}

function renderColumnSelector() {
  var parent = document.getElementById(currentState);
  var table = document.createElement('table');
  table.className = "table table-striped";
  for (var i = 1; i < fileData.data[0].length; i++){
    var tr = document.createElement('tr');   

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    var text1 = document.createTextNode(fileData.data[0][i]);

    td1.appendChild(text1);
    td2.appendChild(renderWeatherParameterOption('i'));
    tr.appendChild(td1);
    tr.appendChild(td2);

    table.appendChild(tr);
  }
  parent.appendChild(table);
}

