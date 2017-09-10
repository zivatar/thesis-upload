var fileData;
var currentState;
var states = {
	SELECT_FILE: { id: "SELECT_FILE", nextState: "SELECT_COLUMNS" },
	SELECT_COLUMNS: { id: "SELECT_COLUMNS", nextState: "UPLOAD_ROWS" },
	UPLOAD_ROWS: { id:"UPLOAD_ROWS", nextState: "FINISHED" },
	FINISHED: { id: "FINISHED" }
}

var weatherParameters = [
  { id: "", name: "-" },
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
  for (var i = 0; i < fileData.data[0].length; i++){
    var tr = document.createElement('tr');   

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    var text1 = document.createTextNode(fileData.data[0][i]);

    td1.appendChild(text1);
    td2.appendChild(renderWeatherParameterOption(i));
    tr.appendChild(td1);
    tr.appendChild(td2);

    table.appendChild(tr);
  }
  parent.appendChild(table);
  renderColumnSelectorOkBtn();
}

function renderColumnSelectorOkBtn() {
  var parent = document.getElementById(currentState);
  var button = document.createElement('button');
  var txt = document.createTextNode("Kész");
  button.appendChild(txt);
  button.onclick = onSelectingColumnOk;
  parent.appendChild(button);
}

function findWeatherParameterById(idx) {
  for (var i = 0; i < weatherParameters.length; i++) {
    if (weatherParameters[i].id == idx) {
      return i;
    }
  }
}

function onSelectingColumnOk() {
  var setParams = [];
  var allParams = [];
  for (var i = 0; i < fileData.data[0].length; i++){
    var elem = document.getElementById("selectColumn"+i);
    if (!!elem.value) {
      setParams.push(elem.value);
    }
    allParams.push(elem.value);
  }
  if (!setParams.length) {
    alert("Nincs kiválasztva semmi!")
  } else if (!!isUnique(setParams)) {
    nextState();
    setTimeout(function() {
      sendData(allParams);
    }, 0);
  } else {
    alert("Nem egyedi a kiválasztás!");
  }
}

function sendData(allParams) {
  var parent = document.getElementById("current_line");

  var iterations = fileData.data.length;

  var loop = function (l) {
    if (l < iterations) {
      setTimeout(function () {
        var line = {};
        for (var j = 0; j < allParams.length; j++) {
          if (!!allParams[j] && fileData.data[l][j] != undefined && fileData.data[l][j] != "---" && fileData.data[l][j] != "") {
            line[allParams[j]] = fileData.data[l][j];
            }
          }
        //console.log(line);
        // TODO post line
        var percentage = "" + Math.round(100 * l / (fileData.data.length - 1)) + "%";
        txt = document.createTextNode(percentage);
        parent.innerText = txt.textContent;
        loop(l + 1)
      }, 0);
    } else {
      nextState();
      // TODO post calculate statistics
    }
  }

  loop(1);

}

/* UTILS ----------------------------------------------- */

function isUnique(arr) {
  var arrUnique = arr.filter(function(item, pos) {
    return arr.indexOf(item) == pos;
  })
  return arr.length == arrUnique.length;
}

// http://geniuscarrier.com/copy-object-in-javascript/
function shallowCopy(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
        if(oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
}