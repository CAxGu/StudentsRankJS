/** Hash code funtion usefull for getting an unique id based on a large text */
function hashcode(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


/** Pass a text or an element ang get a td table element wrapping it. */ 
function getElementTd(text) {
  let tdEl = document.createElement("td");
  let t = text;
  if (typeof text === "string" || typeof text === "number"){ 
     t = document.createTextNode(text); // Create a text node
  }    
  tdEl.appendChild(t);
   return tdEl;
}


/** Function that loads a template html into the DOM */
function loadTemplate(template,callback){

  let xhr = new XMLHttpRequest();
  xhr.open("GET", template, true);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let content =document.getElementById('content');
      content.removeChild;
      content.innerHTML=xhr.responseText;
      callback(xhr.responseText);
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send();
}


export {hashcode,getElementTd,loadTemplate};

