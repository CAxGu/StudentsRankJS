/**
 * Person class. We store personal information and points that reflect daily classroom job
 *
 * @constructor
 * @param {string} name - Person name
 * @param {string} surname - Person surname
 * @param {number} points - Person total points 
 * @tutorial pointing-criteria
 */ 
 
 import {hashcode,getElementTd,loadTemplate} from './utils.js';
 import {PositiveTask} from './positivetask.js';
 import {PenaltyTask} from './penaltytask.js';
 import {context} from './context.js';

class Person {
  constructor(name,surname,points) {
    this.name = name;
    this.surname = surname;
    this.points = points;
    this.gradedTasks = [];
    this.positiveTasks=[];
    this.penaltyTask=[];
  }    
  
  /** Add points to persons we should carefully use it. */
  addPoints(points) {
        this.points += points;
  }

  /** Rest points to persons we should carefully use it. */
   resPoints(points) {
    this.points -= points;
  }

  /** Add a gradded task linked to person with its own mark. */
  addGradedTask(taskInstance) {
        this.gradedTasks.push({"task":taskInstance,"points":0});
       context.getRanking();
  }
  /** Renders HTML person view Create a table row (tr) with all name, points , add button and one input for every gradded task binded for that person. */
  getHTMLView() {

    var liEl = document.createElement("tr");

    liEl.appendChild(getElementTd(this.surname + ", " + this.name));

    liEl.appendChild(getElementTd(this.points));    
    
    var addPointsEl = document.createElement("button");
    var tb = document.createTextNode("+");
    addPointsEl.appendChild(tb);
    var resPointsEL = document.createElement("button");
    var tb1 = document.createTextNode("-");
    resPointsEL.appendChild(tb1);

    liEl.appendChild(getElementTd(addPointsEl));
    liEl.appendChild(getElementTd(resPointsEL));

    addPointsEl.addEventListener("click", () => {

      loadTemplate('./templates/createPositive.html',function(responseText){

          let amount =document.getElementById("points");
          let reason = document.getElementById("reason");
          let send=document.getElementById("sendPositive");

            send.addEventListener('click', () => {
              
                if(amount!=="" & reason!==""){
                  that.positiveTasks.push({"points":points.value,"reason":reason.value,"date":Date()});
                  that.addPoints(eval(amount.value));
                  localStorage.setItem("students",JSON.stringify(context.students));
                  context.getRanking();
                }else{
                  alert("You must fill the fields first!");
                }
            });
      });
    });


    resPointsEL.addEventListener("click", () => {

        loadTemplate('./templates/createPenalty.html',function(responseText){
            let amount =document.getElementById("points");
            let send=document.getElementById("sendPenalty");
            
            send.addEventListener('click', () => {
                        
                if(amount!=="" & reason!==""){
                  that.penaltyTask.push({"points":points.value,"reason":reason.value,"date":Date()});
                  that.resPoints(eval(amount.value));
                  localStorage.setItem("students",JSON.stringify(context.students));
                  context.getRanking();
                }else{
                    alert("You must fill the fields first!");
                }
            });
        });
    });
    

    let that = this;
    this.calculatedPoints = 0;
    this.gradedTasks.forEach(function(gTaskItem) { 


        let inputEl = document.createElement("input");    
        inputEl.type = "number";inputEl.min=0;inputEl.max = 100;  
        inputEl.value = gTaskItem["points"]
        inputEl.addEventListener("change", function(event) {
        that.addPoints(parseInt(gTaskItem["points"])*(-1));
        gTaskItem["points"] = inputEl.value;
        that.addPoints(parseInt(gTaskItem["points"]));
        localStorage.setItem("students",JSON.stringify(context.students));
        context.getRanking();        
      });
      liEl.appendChild(getElementTd(inputEl));


    });
    return liEl;
  }

}

export default Person;