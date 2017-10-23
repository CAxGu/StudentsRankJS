'use strict';

//import Context from './context.js'; 
import {context} from './context.js';

/** Once the page is loaded we get a context app object an generate students rank view. */
function init(){
   context.clickTitle();
   context.inicontext();
   context.getRanking();
   context.addStudent();
}

window.onload = function() {
  init();
}