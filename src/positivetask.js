/**
 * GradedTask class. Create a graded task in order to be evaluated for every student engaged
 * @constructor
 * @param {string} name - task name
 * @tutorial pointing-criteria
 */ 

class PositiveTask extends GradedTask {  
  constructor(name) {  	
    this.name = name;     

  }    
}

export default PositiveTask;