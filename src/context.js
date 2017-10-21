/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */ 

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,loadTemplate} from './utils.js';

class Context {

  constructor() {
    this.students = []; 
  }

    addStudent(){
        var addAlum = document.getElementById("addStudent");
        addAlum.addEventListener("click", () => {
          this.getNewStudent();
    
      });
    }


    inicontext(){
        var addTask = document.getElementById("addGradedTask");
        addTask.addEventListener("click", () => {
          this.addGradedTask();
    });
    this.gradedTasks = [];
    };


  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){
        this.students.sort(function(a, b) {
            return (b.points - a.points);
        });

        var studentsEl = document.getElementById("llistat");
   
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        let headerString="<tr><td colspan='3'></td>";
        this.gradedTasks.forEach(function(taskItem){            
            headerString+="<td>"+taskItem.name+"</td>";
        });
        studentsEl.innerHTML= headerString;
        this.students.forEach(function(studentItem) {
            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });
    }
    /** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){        
        let taskName = prompt("Please enter your task name");
        let gtask = new GradedTask(taskName);
        this.gradedTasks.push(gtask);
        this.students.forEach(function(studentItem) {            
            studentItem.addGradedTask(gtask);
        });
        this.getRanking();
    }


    //Creation in a new form of a new STudent and add it to the array students.
    getNewStudent(){

        let stud=this.students;

        let loadtemplate = new loadTemplate('./templates/createStudent.html',function(responseText){
        
        let name = document.getElementById('name');
        let surename= document.getElementById('surname');
        let btnSend = document.getElementById('send');
        let newStudent;
    
        btnSend.addEventListener('click', () => {
           newStudent = new Person (name.value,surname.value,0);
           stud.push(newStudent);
           console.log(stud);
        });
       
        });
      }


     loadRanking(){
        let ranking = this.getRanking();
        let loadtemplate = new loadTemplate('./templates/createList.html',function(responseText){
            ranking;
        });
      }



}

/* export default Context; */
 export let context = new Context();