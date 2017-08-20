console.log('Loaded!');
var button=document.getelementbyid("counter");
button.onclick=function()
{
    var req=new xmlhttprequest();
    req.onreadystatechange=function()
    {
        if(req.readystate===xmlhttprequest.Done)
        {
            if(req.status===200)
            {
                var counter=req.responsetext;
                var span=document.getelementbyid("count");
                span.innerHTML=counter.toString();
                            }
        }
    };
    req.open('GET','http://divya09feb91.imad.hasura-app.io',true);
    req.send(null);
};
