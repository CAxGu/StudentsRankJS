(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _person = require('./person.js');

var _person2 = _interopRequireDefault(_person);

var _newTask = require('./newTask.js');

var _newTask2 = _interopRequireDefault(_newTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var students = [new _person2.default("Paco", "Vañó", 5), new _person2.default("Lucia", "Botella", 10), new _person2.default("German", "Ojeda", 3), new _person2.default("Salva", "Peris", 1), new _person2.default("Oscar", "Carrion", 40)];

var ejercises = [];

function getRanking(students) {

  students.sort(function (a, b) {
    return b.points - a.points;
  });
  var studentsEl = document.getElementById("ranking");
  var cabecera = document.createElement("tr");
  cabecera.setAttribute('id', "cabecera");

  var thNombres = document.createElement("TH");
  var thPoints = document.createElement("TH");
  var thButtons = document.createElement("TH");
  var textNombres = document.createTextNode("Name");
  var textPoints = document.createTextNode("Points");
  var textButtons = document.createTextNode("Negatives");

  thNombres.appendChild(textNombres);
  thPoints.appendChild(textPoints);
  thButtons.appendChild(textButtons);
  cabecera.appendChild(thNombres);
  cabecera.appendChild(thPoints);
  cabecera.appendChild(thButtons);

  studentsEl.appendChild(cabecera);

  var rows = studentsEl.getElementsByTagName("tr");
  while (rows.length > 1) {
    rows[1].parentNode.removeChild(rows[1]);
  }
  students.forEach(function (studentItem, i) {
    var trEl = document.createElement("tr");
    trEl.setAttribute('id', 'tr' + i);
    var alumnoTd = document.createElement("td");
    var puntosTd = document.createElement("td");
    var botonmasTd = document.createElement("td");
    var liEl = document.createElement("li");

    var tnombre = document.createTextNode(studentItem.surname + ", " + studentItem.name); // Create a text node
    var tpuntos = document.createTextNode(studentItem.points); // Create a text node

    //Nombre y apellidos
    liEl.appendChild(tnombre);
    alumnoTd.appendChild(liEl);
    trEl.appendChild(alumnoTd);

    //Puntuaciones
    puntosTd.appendChild(tpuntos);
    trEl.appendChild(puntosTd);

    //Boton +x puntos
    var addPointsEl = document.createElement("button");
    var puntos = "0.25";
    var tb = document.createTextNode("-" + puntos);

    addPointsEl.appendChild(tb);
    botonmasTd.appendChild(addPointsEl);
    trEl.appendChild(botonmasTd);
    studentsEl.appendChild(trEl);

    botonmasTd.addEventListener("click", function () {

      studentItem.resPoints(puntos);
      setTimeout(function () {
        getRanking(students);
      }, 1000);
    });
  });

  var BotonTask = document.getElementById("new");
  var titulo = document.getElementById("titulotask");
  BotonTask.onclick = function () {
    getRanking(students), newTask(students, titulo.value);
  };
}

var action = 0;
function newTask(students, titulo) {
  console.log(titulo);
  console.log('action vale: ' + action);
  action++;

  //creamos la cabecera con un input personalizado

  var trCabecera = document.getElementById("cabecera");
  var thTask = document.createElement("TH");
  thTask.setAttribute('id', "task" + action);
  var value = document.createElement("input");
  value.setAttribute('type', 'text');
  value.setAttribute('size', '10');

  value.value = titulo;

  thTask.appendChild(value);
  trCabecera.appendChild(thTask);

  //añadimos un casillero para la nota de cada alumno
  students.forEach(function (studentItem, i) {

    var notamin = 0;
    var notamax = 10;
    var incremento = 0.25;

    var columnaNew = document.getElementById("tr" + i);
    var tdNota = document.createElement("td");

    var value = document.createElement("input");
    value.setAttribute('id', 'nota' + i + '&' + "task" + action);
    value.setAttribute('type', 'number');
    value.setAttribute('step', incremento);
    value.setAttribute('min', notamin);
    value.setAttribute('max', notamax);
    value.setAttribute('value', notamin);

    tdNota.appendChild(value);
    columnaNew.appendChild(tdNota);

    value.addEventListener("blur", function () {
      var valor = parseFloat(value.value);
      studentItem.addPoints(valor);
      /*if(studentItem.position == i){
      getRanking(students);
      }*/
      console.log(valor);
    });
    /*  var titulo = document.getElementById("task"+i).value;
     ejercises.push(new Task(titulo,value.value));
     console.log(ejercises); */
  });

  cabecera.appendChild(thTask);
}

window.onload = function () {
  getRanking(students);
};

},{"./newTask.js":2,"./person.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function Task(task, tasknota) {
        _classCallCheck(this, Task);

        this.task = task;
        this.tasknota = 0;
};

exports.default = Task;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Person prototype. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person points 
 * @tutorial pointing-criteria
 */

var Person = function () {
  function Person(name, surname, points) {
    _classCallCheck(this, Person);

    this.name = name;
    this.surname = surname;
    this.points = points;
    //anefds  
  }

  _createClass(Person, [{
    key: "addPoints",
    value: function addPoints(points) {
      this.points += points;
    }
  }, {
    key: "resPoints",
    value: function resPoints(points) {
      this.points -= points;
    }
  }]);

  return Person;
}();

exports.default = Person;

},{}]},{},[1]);
