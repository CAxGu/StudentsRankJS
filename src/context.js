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

    /** Launch the event to add a new student */
    addStudent(){
        var addAlum = document.getElementById("addStudent");
        addAlum.addEventListener("click", () => {
          this.getNewStudent();
        });
    };

    /** Launch the event to create a new task for the students */
    inicontext(){
        var addTask = document.getElementById("addGradedTask");
        addTask.addEventListener("click", () => {
            let size=(this.students).length;
            if(size===0){
                alert('There is any student registered. Add one first');
            }else{
                this.addGradedTask();
            }
        });
    this.gradedTasks = [];
    };


    /** Click that let us return to the main ranking wherever we are */
    clickTitle(){
        let title = document.getElementById("title");
        title.addEventListener("click", () => {
            /* let size=(this.gradedTasks).length;
            if(size>=1){
                this.students.forEach(function(studentItem) {  
                    //console.log(studentItem.gradedTasks);
                    if(studentItem.gradedTasks.length==0){       
                        studentItem.addGradedTask(context.gradedTasks);
                    }
                });
            } */
          this.getRanking();
        });
    };


  /** Draw Students rank table in descendent order using points as a criteria */
  getRanking(){

        let stud=this.students;
        let gtask=this.gradedTasks;
        
        let loadtemplate = new loadTemplate('./templates/createList.html',function(responseText){

        stud.sort(function(a, b) {
            return (b.points - a.points);
        });

        var studentsEl = document.getElementById("llistat");
   
        while (studentsEl.firstChild) {
            studentsEl.removeChild(studentsEl.firstChild);
        }

        let headerString="<tr><td colspan='4 '></td>";
        gtask.forEach(function(taskItem){            
            headerString+="<td>"+taskItem.name+"</td>";
        });
        studentsEl.innerHTML= headerString;
        stud.forEach(function(studentItem) {

            var liEl = studentItem.getHTMLView();
            studentsEl.appendChild(liEl);
        });

        
         });
    }


    /** Create a form to create a GradedTask that will be added to every student */
   addGradedTask(){       
        let grade = this.gradedTasks;
        let stud= this.students

        let loadtemplate = new loadTemplate('./templates/createTask.html',function(responseText){
            let taskName = prompt("Please enter your task name");
            let gtask = new GradedTask(taskName);
            let percent = document.getElementById("percent");
            let subject= document.getElementById("subject");
            let send=document.getElementById("sendTask");

            send.addEventListener('click', ()=> {
                let gtask = new GradedTask(taskName);

                grade.push(gtask);
                stud.forEach(function(studentItem) {            
                    studentItem.addGradedTask(gtask);
                });
                context.getRanking();
            });

        });
    }


    /** Create a new form to add a new Student to the array */
    getNewStudent(){

        let stud=this.students;

        let loadtemplate = new loadTemplate('./templates/createStudent.html',function(responseText){
        
        let name = document.getElementById('name');
        let surename= document.getElementById('surname');
        let btnSend = document.getElementById('send');
        let newStudent;
    
        btnSend.addEventListener('click', () => {
            if(name.value !=="" & surname.value !==""){
                newStudent = new Person (name.value,surname.value,0);
                if(context.gradedTasks.length>0){
                    context.gradedTasks.forEach(function(taskItem){ 
                        newStudent.addGradedTask(taskItem);
                    })
                }
                stud.push(newStudent);
                context.getNewStudent();
            }else{
                alert("You must fill the names and surnames field first!")
            }
           console.log(stud); 
        });
        
        });
      }

      /** Load the main view where will be show the students what  are contain in our array */
      loadRanking(){

     
      }



}

/* export default Context; */
 export let context = new Context();