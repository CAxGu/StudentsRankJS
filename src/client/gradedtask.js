'use strict';

import Task from './task.js';
import {loadTemplate,hashcode} from './utils.js';
import {saveGradedTasks} from './dataservice.js';
import {context} from './context.js';

/**
 * GradedTask class. Create a graded task in order to be evaluated 
 * for every student engaged. Theory tests and procedure practices 
 * are part of this category.
 * @constructor
 * @param {string} name - task name
 * @param {string} description - task description
 * @param {number} weight - task weight %
 * @param {number} id - task id default null when created for first time
 * @tutorial pointing-criteria
 */

const STUDENT_MARKS = Symbol('STUDENT_MARKS'); /** To acomplish private property */

class GradedTask extends Task {
  constructor(name,description,weight,studentsMark,id=null) {
    super(name,description,id);
    this.weight = weight;
    this.studentsMark = studentsMark;
    this[STUDENT_MARKS] = new Map(studentsMark); //We need a private map to make it easier to access student marks using its id. The problem is that a Map inside other map can be converted to a pair array
  }

  /** Add student mark using his/her person ID   */
  addStudentMark(idStudent,markPoints) {
    this[STUDENT_MARKS].set(parseInt(idStudent),markPoints);
    this.studentsMark = [...this[STUDENT_MARKS].entries()];
    saveGradedTasks(JSON.stringify([...context.gradedTasks]));
  }

  /** Static method to get list marks associated with one student */
  static getStudentMarks(idStudent) {
    let marks = [];
    context.gradedTasks.forEach(function(valueGT,keyGT,gradedTasks_) {
      marks.push([valueGT.getId(),valueGT[STUDENT_MARKS].get(idStudent)]);
     });
    return marks;
  }
  
  /** Get student mark by their person ID */
  getStudentMark(idStudent) {
    return this[STUDENT_MARKS].get(idStudent);
  }


  /** Calculate total graded points associated to one student */
  static getPercent(Student) {
    let tasks= this.getStudentMarks(parseInt(Student.id));

    let EVAL_TOTAL=0;
    let percent_total = 0; //final max mark
    let final_mark=0;

    tasks.forEach(function(task){

      let nota= parseInt(task[1]);
      let gweight=parseInt(context.getGradedTaskById(task[0]).weight);
      percent_total+=gweight;
      let result = (nota*gweight)/100;
      EVAL_TOTAL+=result;

    }); 

    final_mark=(EVAL_TOTAL*10/100);

return final_mark;
}


static totalPercentMark (){

let totalperc=0;

let id=GradedTask.getStudentMarks();
id.forEach(function(task){
  let weight=parseInt(context.getGradedTaskById(task[0]).weight);
  totalperc+=weight;
});

return totalperc;
}




  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveGradedTask = document.getElementById('newGradedTask');
      document.getElementById('idTaskName').value = this.name;
      document.getElementById('idTaskDescription').value = this.description;
      document.getElementById('idTaskWeight').value = this.weight;

      saveGradedTask.addEventListener('submit', () => {
        let oldId = this.getId();
        this.name = document.getElementById('idTaskName').value;
        this.description = document.getElementById('idTaskDescription').value;
        this.weight = document.getElementById('idTaskWeight').value;
        let gradedTask = new GradedTask(this.name,this.description,this.weight,this.studentsMark,this.id);
        context.gradedTasks.set(this.id,gradedTask);
        saveGradedTasks(JSON.stringify([...context.gradedTasks]));
      });
    }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
}

export default GradedTask;
