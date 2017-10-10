
'use strict';
import Person from './person.js';
import Task from './newTask.js';

var students = [
  new Person("Paco", "Vañó", 5),
  new Person("Lucia", "Botella", 10),
  new Person("German", "Ojeda", 3),
  new Person("Salva", "Peris", 1),
  new Person("Oscar", "Carrion", 40),
];

function getRanking(students) {

  students.sort(function(a, b) {
    return (b.points - a.points)
  });

  var studentsEl = document.getElementById("ranking");
  var cabecera = document.createElement("tr");
  cabecera.setAttribute('id',"cabecera");
  
  var thNombres = document.createElement("TH");
  var thPoints = document.createElement("TH")
  var thButtons = document.createElement("TH")
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

  students.forEach(function(studentItem,i) {
    var trEl = document.createElement("tr");
    trEl.setAttribute('id','tr'+i);
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
    var puntos="0.25";
    var tb = document.createTextNode("-"+puntos);

    addPointsEl.appendChild(tb);
    botonmasTd.appendChild(addPointsEl);
    trEl.appendChild(botonmasTd);
    studentsEl.appendChild(trEl);

    botonmasTd.addEventListener("click", function() {
     
      studentItem.resPoints(puntos);
      setTimeout(function(){getRanking(students)},1000);
     
    });

  });

  var BotonTask = document.getElementById("new");
  BotonTask.onclick = function(){getRanking(students),newTask(students)};
 
}

var action=0;
function newTask(students) {
  console.log('action vale: '+action);
  action++;

  //creamos la cabecera con un input personalizado
  var trCabecera = document.getElementById("cabecera");
  var thTask = document.createElement("TH");
  thTask.setAttribute('id',"task"+action);
  var value = document.createElement("input");
  value.setAttribute('type','text');
  value.setAttribute('size','10');
  var textTask = document.createTextNode(value.value);

  thTask.appendChild(value);
  thTask.appendChild(textTask);
  trCabecera.appendChild(thTask);

  //añadimos un casillero para la nota de cada alumno
  students.forEach(function(studentItem,i) {

    var notamin=0;
    var notamax=10;
    var incremento=0.25;

    var columnaNew = document.getElementById("tr"+i);
    var tdNota= document.createElement("td");
    
    var value = document.createElement("input");
    value.setAttribute('id','nota'+i+'&'+"task"+action);
    value.setAttribute('type','number');
    value.setAttribute('step',incremento);
    value.setAttribute('min',notamin);
    value.setAttribute('max',notamax);
    value.setAttribute('value',notamin);

    tdNota.appendChild(value);
    columnaNew.appendChild(tdNota);

    value.addEventListener("blur", function() {
      var valor = parseFloat(value.value);
      studentItem.addPoints(valor);
      /*if(studentItem.position == i){
      getRanking(students);
      }*/
      console.log(valor);
      
     });

  });

  cabecera.appendChild(thTask);

}  

window.onload = function() {
  getRanking(students);
}