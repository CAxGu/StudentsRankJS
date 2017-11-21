/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {number} id - Person id default value null whwen created first time
 * @tutorial pointing-criteria
 */

import {formatDate,popupwindow,hashcode,loadTemplate} from './utils.js';
import {context} from './context.js';
import AttitudeTask from './attitudetask.js';
import GradedTask from './gradedtask.js';
import {saveStudents,savePicture} from './dataservice.js';
import {template} from './templator.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalPoints = Symbol('TOTAL_POINTS'); /** To acomplish private property */
const _evaluatedtotalPoints = Symbol('EVALUATED_TOTAL_POINTS'); /** To acomplish private property */
const _finalmark = Symbol('FINAL_MARK'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,id=null) {
    this[_totalPoints] = 0;
    this.name = name;
    this.surname = surname;
    if (!id) {
      this.id = hashcode(this.name + this.surname);
    }else {
      this.id = id;
    }
    this.attitudeTasks = attitudeTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalPoints] += parseInt(itemAT['task'].points);
    }.bind(this));

    this[_evaluatedtotalPoints]=0;
    this[_finalmark]=0;
  }

  /** Add points to person. we should use it carefully . */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalPoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Get person id  based on a 10 character hash composed by name+surname */
  getId() {
    return this.id;
  }

  /** Read person _totalPoints. A private property only modicable inside person instance */
  getTotalPoints() {
    return this[_totalPoints];
  }


 /** Read person _totalPoints. A private property only modicable inside person instance */
  getEvaluatedTotalPoints() {
  return this[_evaluatedtotalPoints];
  }

  /** Set value to person _evaluatedtotalPoints. A private property only modicable inside person instance */
  setEvaluatedTotalPoints(points) {
    this[_evaluatedtotalPoints]=parseFloat(points);
  }

  /** Read person _finalmark. A private property only modicable inside person instance */
  getFinalMark() {
    return this[_finalmark];
  }
  
  /** Set value to person _finalmark. A private property only modicable inside person instance */
  setFinalMark(mark) {
    this[_finalmark]=Math.round((parseFloat(mark))*100)/100;
  }
  
  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname);
  }
  /** Get students Marks sliced by showNumGradedTasks from context*/
  getStudentMarks() {
    let gtArray = GradedTask.getStudentMarks(this.getId()).reverse();
    return gtArray.slice(0,context.showNumGradedTasks);
  }

  getGTtotalPoints() {
    return GradedTask.getStudentGradedTasksPoints(this.getId());
  }

  /** Renders person edit form */
  getHTMLEdit() {
    let callback = function(responseText) {
      document.getElementById('content').innerHTML = responseText;
      let saveStudent = document.getElementById('newStudent');
      document.getElementById('idFirstName').value = this.name;
      document.getElementById('idSurnames').value = this.surname;
      saveStudent.addEventListener('submit', () => {
        let oldId = this.getId();
        this.name = document.getElementById('idFirstName').value;
        this.surname = document.getElementById('idSurnames').value;
        let student = new Person(this.name,this.surname,this.attitudeTasks,this.id);
        context.students.set(student.getId(),student);
        saveStudents(JSON.stringify([...context.students]));
      });
    }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }
  /** Renders person detail view */
  getHTMLDetail() {
    loadTemplate('templates/detailStudent.html',function(responseText) {

        document.getElementById('content').innerHTML = responseText;
        let TPL_STUDENT = this;
        let scope = {};
        scope.TPL_ATTITUDE_TASKS = this.attitudeTasks.reverse();

       
        /*scope.TPL_GRADED_TASKS = [...context.gradedTasks.entries()];
        this.attitudeTasks.reverse().forEach(function(atItem) {
          TPL_ATTITUDE_TASKS += '<li class="list-group-item">' + atItem.task.points + '->' +
                        atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
        });
        */
        let TPL_GRADED_TASKS = '';
        context.gradedTasks.forEach(function(gtItem) {
          TPL_GRADED_TASKS += '<li class="list-group-item">' + gtItem.getStudentMark(TPL_STUDENT.getId()) + '->' +
                        gtItem.name + '->' + formatDate(new Date(gtItem.datetime)) + '</li>';
        });
        let out = template(responseText,scope);
        //console.log(out);
        document.getElementById('content').innerHTML = eval('`' + out + '`');


        let profilepic = document.getElementById('profilepic');
        let savepic = document.getElementById('addprofilepic');
        savepic.addEventListener('submit',() =>{
               
        let name=(this.id).toString()+'.jpg';
/*      
        let reader = new FileReader();
        reader.readAsDataURL(profilepic.files[0]);
        reader.onload = function(){
          savePicture(new Buffer (reader.result)); 
        } */

        let array=[];
        let pic = window.btoa(profilepic.files[0]);
        array.push(name);
        array.push(pic);
     
         savePicture(profilepic.files[0]);
      

        });
      }.bind(this));
  }
}

export default Person;
