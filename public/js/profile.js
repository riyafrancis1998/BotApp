$(document).ready(function(){
   
   function myFunction(){
       var doc=document.getElementById("add");
       console.log('Reached')
       doc.append("<input type=text>")
   }
},500);