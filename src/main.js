'use strict';

//import Context from './context.js'; 
import {context} from './context.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
function init(){
  context.inicontext();
 //  context.getRanking();
}


window.onload = function() {
  context.addStudent();
  init();
  /* let context = new Context();
  context.getRanking();*/
}