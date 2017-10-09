/*class Task {
    constructor(name,surname,points) {
      this.name = name;
      this.surname = surname;
      this.points = points;
      //anefds  
    }    
  
    createTask(){

        var studentsEl = document.getElementById("ranking");
        var cabecera = document.createElement("tr");
        cabecera.setAttribute('id',"cabecera");
        
        var thNombres = document.createElement("TH");
        var thPoints = document.createElement("TH")
        var thButtons = document.createElement("TH")
        var textNombres = document.createTextNode("Name");
        var textPoints = document.createTextNode("Points");
        var textButtons = document.createTextNode("Negatives");
      
        thNombres.appendChild(textNombres);
        thPoints.appendChild(textPoints);
        thButtons.appendChild(textButtons);
        cabecera.appendChild(thNombres);
        cabecera.appendChild(thPoints);
        cabecera.appendChild(thButtons);
      
        studentsEl.appendChild(cabecera);

    }
  }
  
export default Task;*/