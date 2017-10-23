/**
 * PenaltyTask class. Create a penalty task in order to penalise a student
 * @constructor
 * @param {int} points - amount of points rested in the penalty
 * @param {string} reason - reason of the positive mark
 * @tutorial pointing-criteria
 */ 

import GradedTask from './gradedtask.js';

class PenaltyTask extends GradedTask {  
  constructor(points,reason,date) {  	
    super();

    this.points=points;
    this.reason=reason;
    this.date=date;
  }    
}

export default PenaltyTask;