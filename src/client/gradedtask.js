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
  /** Calculate total graded points associated to one student */
  static getStudentGradedTasksPoints(idStudent) {
    let points = 0;
    context.gradedTasks.forEach(function(itemTask) {
        points += itemTask[STUDENT_MARKS].get(idStudent) * (itemTask.weight / 100);
      });

    let nota=parseInt(this.getGTSettings()/10);
    let totalpoints=Math.round((points * parseInt(this.getGTSettings())) / 100);

  return Math.round(((nota * totalpoints) / this.getGTSettings())*100)/100; 
  }
  /** Calculate total aggregated GT weight */
  static getGradedTasksTotalWeight() {
    let points = 0;
    context.gradedTasks.forEach(function(itemTask) {
        points += parseInt(itemTask.weight);
      });
    return points;
  }

  /** Get student mark by their person ID */
  getStudentMark(idStudent) {
    return this[STUDENT_MARKS].get(idStudent);
  }

  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveGradedTask = document.getElementById('newGradedTask');
      document.getElementById('idTaskName').value = this.name;
      document.getElementById('idTaskDescription').value = this.description;
      let totalGTweight = GradedTask.getGradedTasksTotalWeight();
      let weightIput = document.getElementById('idTaskWeight');
      document.getElementById('labelWeight').innerHTML = 'Weight (0-' + (100 - (totalGTweight - this.weight)) + '%)';
      weightIput.value = this.weight;
      weightIput.setAttribute('max', 100 - (totalGTweight - this.weight));

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

/** Function to store the weight values chosen using the settings slider */
  static saveSettings(percentXP,percentGT){

    let PERCENT_GT=parseInt(percentGT);
    let PERCENT_XP=parseInt(percentXP);

    let settings ={'xppercent':PERCENT_XP,'gtpercent':PERCENT_GT};
    localStorage.setItem('settings',JSON.stringify(settings));
  }

  /**Get XP Percent weight stored in local storage */
  static getXPSettings(){
    let PERCENT_XP=50;
    if(JSON.parse(localStorage.getItem('settings'))){
      PERCENT_XP=(JSON.parse(localStorage.getItem('settings'))).xppercent;
    }

    return PERCENT_XP
  }

  /**Get GT Percent weight stored in local storage */
  static getGTSettings(){

    let PERCENT_GT=50;
    if(JSON.parse(localStorage.getItem('settings'))){
      PERCENT_GT=(JSON.parse(localStorage.getItem('settings'))).gtpercent;
    }

    return PERCENT_GT
  }
}

export default GradedTask;
