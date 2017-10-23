/**
 * GradedTask class. Create a graded task in order to be evaluated for every student engaged
 * @constructor
 * @param {string} name - task name
 * @tutorial pointing-criteria
 */ 

class GradedTask {  
  constructor(name,percent,subject) {  	
    this.name = name;
    this.percent=percent;
    this.subject=subject;     

  }    
}

class PositiveTask extends GradedTask {  
  constructor(points,reason) {  	
    super();
    
    this.points=points;
    this.reason=reason;
  }    
}

export default GradedTask;