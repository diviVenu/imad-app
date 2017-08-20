var button=document.getElementById("counter");
button.onclick=function()
{
    var req=new XMLHttpRequest();
    req.onreadystatechange=function()
    {
        if(req.readystate===XMLHttpRequest.Done)
        {
            if(req.status===200)
            {
                var counter=req.responseText;
                var span=document.getElementById("count");
                span.innerHTML=counter.toString();
                            }
        }
    };
    req.open('GET','http://divya09feb91.imad.hasura-app.io',true);
    req.send(n);
};
