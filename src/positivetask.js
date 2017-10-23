/**
 * PositiveTask class. Create a positive task in order to reward a student
 * @constructor
 * @param {int} points - amount of points added in the positive
 * @param {string} reason - reason of the positive mark
 * @tutorial pointing-criteria
 */ 

import GradedTask from './gradedtask.js';

class PositiveTask extends GradedTask {  
  constructor(points,reason,date) {  	
    super();

    this.points=points;
    this.reason=reason;
    this.date=date;
  }    
}

export default PositiveTask;