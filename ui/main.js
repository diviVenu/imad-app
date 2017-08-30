//initial try
//var button = document.getElementById('counter');
//var counter=0;
//button.onclick = function ()
//{
  //  counter=counter+1;
    // var span = document.getElementById('count');
              //  span.innerHTML = counter.toString();
  // };
function exec(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
          if (request.readyState === XMLHttpRequest.DONE) 
          {
              //Take Some Action
              if (request.status === 200) 
                { 
                    var counter = request.responseText; 
                    var span = document.getElementById('count');
                    span.innerHTML = counter.toString();
                } 
          } 
    }; 
    request.open("GET", "http://divya09feb91.imad.hasura-app.io/counter", true);
    request.send(); 
    console.log('EXECUTED');
}
  
/* first try to get the names on button click 
var name= document.getElementById('name').value;
var submit=document.getElementById('submit_btn');
submit.onclick= function ()
{
   
   var names=['name1','name2', 'name3', 'name4'];
   var list='';
   for(var i=0;i<names.length;i++)
   {
       list+='<li>' + names[i] + '</li>';
       
   }
   var ul=document.getElementById('nameList');
   ul.innerHTML=list;
   
};*/

//Submit uname/paswd to login

var submit=document.getElementById('submit_btn2');
 submit.onclick = function () 
 {
     
      var request = new XMLHttpRequest();
      
    request.onreadystatechange = function ()
    {
        if(request.readyState === XMLHttpRequest.Done)
        {
            if(request.status === 200)
            {
               alert('Logged in successfully');
            }
            else if(request.status===403){
                 alert('uname/paswd is incorrect!');
            }
            else if(request.status===500){
                 alert('sOMETHING WENT WRONG IN THE Server');
            }
        }
    };
    
    var username= document.getElementById('username').value;
var password= document.getElementById('password').value;
console.log(usename);
console.log(password);
    request.open('POST', 'http://divya09feb91.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.Stringify({username: username, password: password}));
 };




