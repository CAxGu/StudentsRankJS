'use strict';

import {context} from './context.js';
import {popupwindow,loadTemplate,formatDate} from './utils.js';
import AttitudeTask from './attitudetask.js';

/** Once the page is loaded we get a context app object an generate students rank view. */

window.onload = function() {
  context.getTemplateRanking();
}

window.onhashchange = function(){
    let url=window.location.href;
    let regUrl = /(#[A-z]*)/g; //Regex to get the #section refered in the url
    let result = regUrl.exec(url);
    let regUrlID = /([0-9,-]*)$/g; //Regex to get the /id refered
    let resultID = regUrlID.exec(url);
    let regUrltask = /([a-z0-9\s,-]*)$/gi; //Regex to get the /task refered
    let resulttask = regUrltask.exec(url);

    /** Routing to load every single section of our aplication using the url */
    if(result){
        switch(result[1]){
            case '#createStudent':
              loadTemplate('templates/addStudent.html',function(responseText) {
                context.addPerson();
              });         
            break;
            case '#addTask':
              loadTemplate('templates/addGradedTask.html',function(responseText) {
                  context.addGradedTask();
                });  
            break;
            case '#XP':
                let STUDENT = context.getStudentbyID(resultID[1]);
                
                let popUp = popupwindow('templates/listAttitudeTasks.html','XP points to ' +
                STUDENT.name,300,400);

                popUp.onload = function() {
                  popUp.document.title = STUDENT.name + ' ' +
                  STUDENT.surname + ' XP points';
                  let popuphead = popUp.document.head;
                
                  popuphead.innerHTML+='<link rel="stylesheet" href="/css/style.css">';
                  let xpButtons = popUp.document.getElementsByClassName('xp');
                  Array.prototype.forEach.call(xpButtons,function(xpBItem) {
                    xpBItem.addEventListener('click', () => {
                  
                      popUp.close();
                      STUDENT.addAttitudeTask(new AttitudeTask('XP task',
                                            xpBItem.innerHTML,xpBItem.value));
                    });
                  });
                };
            break;
            case '#details':
                loadTemplate('templates/detailStudent.html',function(responseText) {
                  let STUDENT = context.getStudentbyID(resultID[1]);
                  let ATTITUDE_TASKS = '';
                  STUDENT.attitudeTasks.reverse().forEach(function(atItem) {
                    ATTITUDE_TASKS += '<li>' + atItem.task.points + '->' +
                                  atItem.task.description + '->' + formatDate(new Date(atItem.task.datetime)) + '</li>';
                  });
                  let GRADED_TASKS = '';
                  STUDENT.gradedTasks.reverse().forEach(function(gtItem) {
                    GRADED_TASKS += '<li>' + gtItem.points + '->' +
                                  gtItem.task.name + '->' + formatDate(new Date(gtItem.task.datetime)) + '</li>';
                  });
                  document.getElementById('content').innerHTML = eval('`' + responseText + '`');
                }.bind(this));

            break;
            case '#editStudent':
                loadTemplate('templates/modifyStudent.html',function(responseText) {
                  let STUDENT = context.getStudentbyID(resultID[1]);
                  document.getElementById('content').innerHTML = eval('`' + responseText + '`');
                  context.editPerson(resultID[1]);
                }.bind(this));

            break;
            case '#deleteStudent':
                let stud = context.getStudentbyID(resultID[1]);
                let conf =confirm("Are you sure?, Delete Student: "+ stud.name+', '+stud.surname+' ?');
                if (conf){
                  context.students.delete(eval(resultID[1]));
                  context.getTemplateRanking();
                }else {
                  context.getTemplateRanking();
                }
                
            break;
            case '#listTask':
                loadTemplate('templates/listTask.html',function(responseText) {
                  let GTASK =  context.getGtaskbyID(resulttask[1]);
                  document.getElementById('content').innerHTML = eval('`' + responseText + '`');
                }.bind(this));
            break;
            case '#editTask':
                loadTemplate('templates/editTask.html',function(responseText) {
                  let GTASK =  context.getGtaskbyID(resulttask[1]);
                  document.getElementById('content').innerHTML = eval('`' + responseText + '`');
                  context.editTask(resulttask[1]);
                }.bind(this));
            break;
            case '#deleteTask':
                let conf1 =confirm("Are you sure?, Delete Task: "+ resulttask[1] +' ?');
                let index;
                if (conf1){
                  context.deleteTask(resulttask[1]);
                }
            break;
          }
    
      }
    
};