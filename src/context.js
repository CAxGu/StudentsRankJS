/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {hashcode,getElementTd,deleteContent,loadTemplate} from './utils.js';

class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = [];
    this.showNumGradedTasks = 1;


    if (localStorage.getItem('students')) {
    let students_ = new Map(JSON.parse(localStorage.getItem('students')));
    let arraystudents = [...students_];

    for (let i = 0;i < arraystudents.length;i++) {
      let stud=arraystudents[i];
      let p = new Person(stud[1].name,stud[1].surname,
        stud[1].attitudeTasks,stud[1].gradedTasks);

       this.students.set(stud[0],p);
    
    }
  }
   if (localStorage.getItem('gradedTasks')) {
    this.gradedTasks = JSON.parse(localStorage.getItem('gradedTasks'));
  }  

  }

  /** Function to send the student to the router when whe click details, xp.. etc */
  getStudentbyID(hash){
    
    let hashid = eval(hash);
    return this.students.get(hashid);
  }

  /** Function to get a gradedTask by ID */
  getGtaskbyID(name){
   // debugger;
    let t={};
    this.gradedTasks.forEach(function(task){
      if (task.name == name){
        t = task;
      }
    });
    return t;
  }


  /** Draw Students rank table in descendent order using points as a criteria */
  getTemplateRanking() {

  if (this.students && this.students.size > 0) {

    let arraystud = [...this.students];

    /* We sort students descending from max number of points to min */
    arraystud.sort(function(a, b) {
      return (b[1].getTotalPoints() - a[1].getTotalPoints());
    });
    localStorage.setItem('students',JSON.stringify(arraystud));
    this.students= new Map(arraystud);

    let GRADED_TASKS = '';
    let arraytasks = [...this.gradedTasks];
    arraytasks.reverse().forEach(function(taskItem) {
      //GRADED_TASKS += '<td>' + '<a href=#listTask/'+hashcode(taskItem[1].name + taskItem[1].description + taskItem[1].weight)+'>'+ taskItem[1].name  + '</a>' + '</td>';
      GRADED_TASKS += '<td>' + '<a href=#listTask/'+taskItem.name+'>'+ taskItem.name  + '</a>' + '</td>';      
    });

    loadTemplate('templates/rankingList.html',function(responseText) {
            document.getElementById('content').innerHTML = eval('`' + responseText + '`');
            let tableBody = document.getElementById('idTableRankingBody');
            this.students.forEach(function(studentItem) {
              let liEl = studentItem.getHTMLView();
              tableBody.appendChild(liEl);
            });
          }.bind(this));
         
    }
  }

  /** Create a form to create a GradedTask that will be added to every student */
  addGradedTask() {

  

        let saveGradedTask = document.getElementById('newGradedTask');

        saveGradedTask.addEventListener('submit', () => {
            let name = document.getElementById('idTaskName').value;
            let description = document.getElementById('idTaskDescription').value;
            let weight = document.getElementById('idTaskWeight').value;
            let gtask = new GradedTask(name,description,weight);
            this.gradedTasks.push(gtask);
            localStorage.setItem('gradedTasks',JSON.stringify(this.gradedTasks));
            this.students.forEach(function(studentItem) {
               studentItem.addGradedTask(gtask);
            });
              this.getTemplateRanking();
        });

  }
  /** Add a new person to the context app */
  addPerson() {

      let saveStudent = document.getElementById('newStudent');

      saveStudent.addEventListener('submit', () => {
        let name = document.getElementById('idFirstName').value;
        let surnames = document.getElementById('idSurnames').value;
        let student = new Person(name,surnames,[],[]);
        this.gradedTasks.forEach(function(iGradedTask) {
              student.addGradedTask(new GradedTask(iGradedTask.name));
            });              
 
        let hash=hashcode(surnames + name);
        this.students.set(hash,student);
        localStorage.setItem('students',JSON.stringify(Array.from(this.students)));   

      });

  }

  /** Edit an existing person of the context app */
  editPerson(oldstudent) {
  
          let oldstud = this.students.get(eval(oldstudent));
          let saveStudent = document.getElementById('editedStudent');
    
          saveStudent.addEventListener('submit', () => {
            let name = document.getElementById('idFirstName').value;
            let surnames = document.getElementById('idSurnames').value;
            let attitudeTasks = [];
            let gradedTasks = [];
            oldstud.attitudeTasks.forEach(function(element){
              attitudeTasks.push(element);
            });
            oldstud.gradedTasks.forEach(function(element){
              gradedTasks.push(element);
            });
            let student = new Person(name,surnames,attitudeTasks,gradedTasks);             

            let hash=hashcode(surnames + name);
            this.students.set(hash,student);
            this.students.delete(eval(oldstudent));
            localStorage.setItem('students',JSON.stringify(Array.from(this.students)));    
            this.getTemplateRanking();
          });
      }


  /** Edit an existing task of the context app */
  editTask(oldtask) {
    
            let index = this.gradedTasks.findIndex(x => x.name==oldtask);
            let oldt = this.gradedTasks[index];
            let saveTask = document.getElementById('editedTask');
      
            saveTask.addEventListener('submit', () => {

              let name = document.getElementById('nameTask').value;
              let description = document.getElementById('descTask').value;
              let weight = document.getElementById('weightTask').value;

              oldt.name=name;
              oldt.description=description;
              oldt.weight=weight;

              let provStudentsArray = Array.from(this.students);
              provStudentsArray.forEach(function(student){
                student[1].gradedTasks.forEach(function(task){
                  task.task.name = name;
                  task.task.description = description;
                  task.task.weight = weight;
                 
                })
              })

              this.students= new Map(provStudentsArray);
              localStorage.setItem('gradedTasks',JSON.stringify(this.gradedTasks));
              this.getTemplateRanking();
            });            
        }

  deleteTask(idtask){ 
    
    let index = this.gradedTasks.findIndex(x => x.name==idtask);
    this.gradedTasks.splice(index,1);

    let provStudentsArray = Array.from(this.students);
    provStudentsArray.forEach(function(student){
      student[1].gradedTasks.forEach(function(task){

       let a=student[1].gradedTasks.findIndex(x => x.task.name==idtask);
       let points = student[1].getTotalPoints()-parseInt(task.points);
       student[1].resetTotalPoints(points)
       student[1].gradedTasks.splice(a,1);
      })
    })

   this.students=new Map(provStudentsArray);
   localStorage.setItem('gradedTasks',JSON.stringify(this.gradedTasks));
   this.getTemplateRanking();
  }

  /** Add last action performed to lower information layer in main app */

  notify(text) {
    document.getElementById('notify').innerHTML = text;
  }
}

export let context = new Context(); //Singleton export
