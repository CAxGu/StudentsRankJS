/**
 * Person class. We store personal information and attitudePoints that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {array} attitudeTasks - Person awarded AttitudeTasks array   
 * @param {array} gradedTasks - Person gradedTasks array
 * @tutorial pointing-criteria
 */

import {formatDate,popupwindow,hashcode,getElementTd,loadTemplate} from './utils.js';
import {context} from './context.js';
import AttitudeTask from './attitudetask.js';

const privateAddTotalPoints = Symbol('privateAddTotalPoints'); /** To accomplish private method */
const _totalPoints = Symbol('TOTAL_POINTS'); /** To acomplish private property */

class Person {
  constructor(name,surname,attitudeTasks,gradedTasks) {
    this[_totalPoints] = 0;
    this.name = name;
    this.surname = surname;

    this.attitudeTasks = attitudeTasks;
    this.gradedTasks = gradedTasks;

    this.attitudeTasks.forEach(function (itemAT) {
      this[_totalPoints] += parseInt(itemAT['task'].points);
    }.bind(this));
    this.gradedTasks.forEach(function (itemGT) {
      this[_totalPoints] += parseInt(itemGT.points);
    }.bind(this));
  }

  /** Add points to persons we should carefully use it. */
  [privateAddTotalPoints] (points) {
    if (!isNaN(points)) {
      this[_totalPoints] += points;
      context.getTemplateRanking();
    }
  }

  /** Read person _totalPoints. A private property only modicable inside person instance */
  getTotalPoints() {
    return this[_totalPoints];
  }

/** Reset the total points amount when a task is deleted */
  resetTotalPoints(points) {
    this[_totalPoints]-= eval(points);
    return this[_totalPoints];
  }

  /** Add a gradded task linked to person with its own mark. */
  addGradedTask(taskInstance) {
    this.gradedTasks.push({'task':taskInstance,'points':0});
  }

  /** Add a Attitude task linked to person with its own mark. */
  addAttitudeTask(taskInstance) {
    this.attitudeTasks.push({'task':taskInstance});
    this[privateAddTotalPoints](parseInt(taskInstance.points));
    context.notify('Added ' + taskInstance.description + ' to ' + this.name + ',' + this.surname);
  }

  /** Renders HTML person view Create a table row (tr) with
   *  all name, attitudePoints , add button and one input for 
   * every gradded task binded for that person. */
  getHTMLView() {
    let liEl = document.createElement('tr');
    let a =document.createElement('a');
    let hashid=hashcode(this.surname + this.name);
    a.setAttribute('href',"#details/"+ hashid );
    a.setAttribute('id',hashid);

     
    let esEL = getElementTd(this.surname + ', ' + this.name);

    a.appendChild(esEL);
    liEl.appendChild(a);

    liEl.appendChild(getElementTd(this[_totalPoints]));

   let addAttitudeTaskEl = document.createElement('img');
   addAttitudeTaskEl.src="./img/extra.png"
   addAttitudeTaskEl.height="30";
   addAttitudeTaskEl.width="30";
  
   let editStudent = document.createElement('img');
   editStudent.src="./img/edit.png"
   editStudent.height="30";
   editStudent.width="30";


    let a3 =document.createElement('a');
    a3.setAttribute('href',"#editStudent/"+ hashid);
    a3.setAttribute('id',hashid);

    a3.appendChild(editStudent);
    liEl.appendChild(getElementTd(a3));


    let deleteStudent = document.createElement('img');
    deleteStudent.height="30";
    deleteStudent.width="30";
    deleteStudent.src="./img/delete.png"
    let a2 =document.createElement('a');
    a2.setAttribute('href',"#deleteStudent/"+ hashid);
    a2.setAttribute('id',hashid);

    a2.appendChild(deleteStudent);
    liEl.appendChild(getElementTd(a2));


    let a1 =document.createElement('a');
    a1.setAttribute('href',"#XP/"+ hashid);
    a1.setAttribute('id',hashid);

    a1.appendChild(addAttitudeTaskEl);
    liEl.appendChild(getElementTd(a1));

 
    let that = this;
    
    this.gradedTasks.reverse().forEach(function(gTaskItem) {
        let inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = 0;
        inputEl.max = 100;
        inputEl.value = gTaskItem['points'];
        inputEl.addEventListener('change', function(event) {
            that[privateAddTotalPoints](parseInt(gTaskItem['points'] * (-1)));
            gTaskItem['points'] = inputEl.value;
            that[privateAddTotalPoints](parseInt(gTaskItem['points']));
          });
        liEl.appendChild(getElementTd(inputEl));
      });
    return liEl;
  }
}

export default Person;
