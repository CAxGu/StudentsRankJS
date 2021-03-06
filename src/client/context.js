/**
 * Context class. Devised to control every element involved in the app: students, gradedTasks ...
 *
 * @constructor
 * @tutorial pointing-criteria
 */

/*jshint -W061 */

import Person from './person.js';
import GradedTask from './gradedtask.js';
import {updateFromServer,saveStudents,saveGradedTasks} from './dataservice.js';
import {hashcode,loadTemplate,setCookie,getCookie} from './utils.js';
import {generateMenu} from './menu.js';
import {template} from './templator.js';

class Context {

  constructor() {
    this.students = new Map();
    this.gradedTasks = new Map();
    this.showNumGradedTasks = 1;//Max visible graded tasks in ranking list table
    if (getCookie('user')) {
      this.user = JSON.parse(getCookie('user'));
    }
  }

  /** Check if user is logged */
  isLogged() {
    loadTemplate('api/loggedin',function(response) {
      if (response === '0') {
        //alert('LOGGED IN 0');
        this.user = undefined;
        this.login();
        return false;
      }else {
        //alert('LOGGED IN TRUE');
        this.user = JSON.parse(response);
        updateFromServer();
        this.getTemplateRanking();
        return true;
      }
    }.bind(this),'GET','',false);
  }

  /** Show login form template when not authenticated */
  login() {
    let that = this;
    if (!this.user) {
      loadTemplate('templates/login.html',function(responseText) {
        that.hideMenu();
        document.getElementById('content').innerHTML = eval('`' + responseText + '`');
        let loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', (event) => {
          event.preventDefault();
          let username = document.getElementsByName('username')[0].value;
          let password = document.getElementsByName('password')[0].value;
          loadTemplate('api/login',function(userData) {
            that.user = JSON.parse(userData);
            setCookie('user',userData,7);
            updateFromServer();
            that.getTemplateRanking();
          },'POST','username=' + username + '&password=' + password,false);
          return false; //Avoid form submit
        });
      });
    }else {
      generateMenu();
      that.getTemplateRanking();
    }
  }

  showMenu() {
    document.getElementById('navbarNav').style.visibility = 'visible';
  }

  hideMenu() {
    document.getElementById('navbarNav').style.visibility = 'hidden';
  }

  /** Get a Person instance by its ID */
  getPersonById(idHash) {
    return this.students.get(parseInt(idHash));
  }
  /** Get a GradedTask instance by its ID */
  getGradedTaskById(idHash) {
    return this.gradedTasks.get(parseInt(idHash));
  }
  /** Draw Students ranking table in descendent order using total points as a criteria */
  getTemplateRanking() {
    generateMenu();
    this.showMenu();

    if (this.students && this.students.size > 0) {
      //alert('SI STUDENTS');
      /* We sort students descending from max number of points to min */
      let arrayFromMap = [...this.students.entries()];
      let arrayFinal = [...this.students.entries()];

      arrayFromMap.sort(function(a,b) {
        return (b[1].getTotalPoints() - a[1].getTotalPoints());
      });

      let topXPpoints=arrayFromMap[0][1].getTotalPoints(); //Value of the totalpoints of the 1st
      arrayFromMap.forEach(function(student){
        
        let finalxp=context.getfinalXPMark(topXPpoints,student[1].getTotalPoints());
        student[1].setEvaluatedTotalPoints(finalxp);
        let finalmark= GradedTask.getStudentGradedTasksPoints(student[0])+student[1].getEvaluatedTotalPoints();
        student[1].setFinalMark(finalmark)

      });


      /* We sort students descending from highest finalmark to lowest */  
      arrayFinal.sort(function(a,b) {
        return (b[1].getFinalMark() - a[1].getFinalMark());
      });

      this.students = new Map(arrayFinal);

      saveStudents(JSON.stringify([...this.students]));
      let TPL_GRADED_TASKS = '';
      let PERCENT_GT = '';
      let PERCENT_XP = '';
      let FINAL_MARK= '';

      if (this.gradedTasks && this.gradedTasks.size > 0) {
        if (this.showNumGradedTasks >= this.gradedTasks.size) {
          this.showNumGradedTasks = this.gradedTasks.size;
        }
        let arrayGradedTasks = [...this.gradedTasks.entries()].reverse();
        for (let i = 0;i < this.showNumGradedTasks;i++) {
          if (i === (this.showNumGradedTasks - 1)) {
            TPL_GRADED_TASKS += '<th><a href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' +
                  arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)&nbsp;</a><a href="#MoreGradedTasks"><button id="more_gt">--></button></a></th>';
          } else {
            TPL_GRADED_TASKS += '<th><a href="#detailGradedTask/' + arrayGradedTasks[i][0] + '">' + arrayGradedTasks[i][1].name + '(' + arrayGradedTasks[i][1].weight + '%)</a></th>';
          }
        }
      }
      let scope = {};
      scope.TPL_GRADED_TASKS = TPL_GRADED_TASKS;
      scope.TPL_PERSONS = arrayFinal;
      PERCENT_GT = GradedTask.getGTSettings();
      PERCENT_XP = GradedTask.getXPSettings();

      loadTemplate('templates/rankingList.html',function(responseText) {
              let out = template(responseText,scope);
              //console.log(out);
              document.getElementById('content').innerHTML = eval('`' + out + '`');
              let that = this;
              let callback = function() {
                  let gtInputs = document.getElementsByClassName('gradedTaskInput');
                  Array.prototype.forEach.call(gtInputs,function(gtInputItem) {
                        gtInputItem.addEventListener('change', () => {
                          let idPerson = gtInputItem.getAttribute('idStudent');
                          let idGradedTask = gtInputItem.getAttribute('idGradedTask');
                          let gt = that.gradedTasks.get(parseInt(idGradedTask));
                          gt.addStudentMark(idPerson,gtInputItem.value);
                          that.getTemplateRanking();
                        });
                      });
                };
              callback();
            }.bind(this));
    }else {
      //alert('NO STUDENTS');
      document.getElementById('content').innerHTML ='';
    }
  }

  /** Create a form to create a GradedTask that will be added to every student */
  addGradedTask() {

    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveGradedTask = document.getElementById('newGradedTask');
            let totalGTweight = GradedTask.getGradedTasksTotalWeight();
            document.getElementById('labelWeight').innerHTML = 'Task Weight (0-' + (100 - totalGTweight) + '%)';
            let weightIput = document.getElementById('idTaskWeight');
            weightIput.setAttribute('max', 100 - totalGTweight);

            saveGradedTask.addEventListener('submit', () => {
              let name = document.getElementById('idTaskName').value;
              let description = document.getElementById('idTaskDescription').value;
              let weight = document.getElementById('idTaskWeight').value;
              let gtask = new GradedTask(name,description,weight,[]);
              let gtaskId = gtask.getId();
              this.students.forEach(function(studentItem,studentKey,studentsRef) {
                gtask.addStudentMark(studentKey,0);
              });
              this.gradedTasks.set(gtaskId,gtask);
              saveGradedTasks(JSON.stringify([...this.gradedTasks]));
              this.getTemplateRanking();
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addGradedTask.html',callback);
  }
  /** Add a new person to the context app */
  addPerson() {

    let callback = function(responseText) {
            document.getElementById('content').innerHTML = responseText;
            let saveStudent = document.getElementById('newStudent');

            saveStudent.addEventListener('submit', (event) => {
              event.preventDefault();
              let name = document.getElementById('idFirstName').value;
              let surnames = document.getElementById('idSurnames').value;
              let student = new Person(name,surnames,[]);
              this.gradedTasks.forEach(function(iGradedTask) {
                    iGradedTask.addStudentMark(student.getId(),0);
                  });
              this.students.set(student.getId(),student);
              this.getTemplateRanking();
              return false; //Avoid form submit
            });
          }.bind(this);

    loadTemplate('templates/addStudent.html',callback);
  }



  taskSettings(){
    
        let callback = function(responseText) {
          document.getElementById('content').innerHTML = responseText;
    
          let slider = document.getElementById("slider");
          let xpoints = document.getElementById("xpoints");
          let marksweight = document.getElementById("marksweight");

          if(localStorage.getItem('settings')){
            xpoints.innerHTML = GradedTask.getXPSettings();
            marksweight.innerHTML = GradedTask.getGTSettings();
            slider.value = GradedTask.getXPSettings();
          }else{
            xpoints.innerHTML = slider.value;
            marksweight.innerHTML = slider.value;  
          }

          slider.oninput = function() {
            xpoints.innerHTML = this.value;
            marksweight.innerHTML = this.max-this.value;

            //condition to control the 99% - 1% in both sides
            if (xpoints.innerHTML==this.max){
              xpoints.innerHTML = this.value-1;
              marksweight.innerHTML = this.max-this.value+1;
            }
          }
           
          let saveSettings = document.getElementById('settings');
          saveSettings.addEventListener('submit', () => {

            let percentXP =xpoints.innerHTML;
            let percentGT =marksweight.innerHTML;
    
            GradedTask.saveSettings(percentXP,percentGT);
            this.getTemplateRanking();
          });
         
          
    
        }.bind(this);
    
        loadTemplate('templates/settings.html',callback);
    
      }

      /**   Funtion to get the relative weight final mark of xp */
      getfinalXPMark(maxpoints,points){ 
        
    let nota= (points*10)/maxpoints;
    let finaltop=(nota*GradedTask.getXPSettings())/100;
    let finalxpmark=0;

    if(maxpoints==points){
      finalxpmark=finaltop;
    }else{
      finalxpmark=(points*finaltop)/maxpoints;
    }

    return Math.round(finalxpmark*100)/100 
    }

  /** Add last action performed to lower information layer in main app */
  notify(text) {
    document.getElementById('notify').innerHTML = text;
  }
}

export let context = new Context(); //Singleton export
