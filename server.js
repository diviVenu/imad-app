var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var app = express();
app.use(morgan('combined'));
var bodyParser=require('body-parser');
var session=require('express-session');
var pool=require('pg').Pool;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

//Begin Module P10


var config={
    user: 'divya09feb91',
    database: 'divya09feb91',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_password
};

//End Module P10
/*var articleOne={
    title: 'Article- one',
    heading: 'Article- one',
    date: '20-Aug-2017',
    content: `
    <p>This is the content for article one about article-one.html
    </p>
    `
    
};*/

var articles={
    'article-one':{
        title: 'Article_One',
      heading: 'Article- one',
    date: '20-Aug-2017',
    content: `
    <p>This is the content for article one about article-one.html
    </p>   `
},
 'article-two':{
     title: 'Article_Two',
       heading: 'Article- two',
    date: '30-Aug-2017',
    content: `
    <p>This is for Module P4 JS,HTML,CSS in article two.
    </p>   `
}
};


function createTemplate(data)
{
          var title=data.title;
           var date=data.date;
    var heading=data.heading;
    var content=data.content;
var htmltemplate= `
    <html>
    <head><title>${title}</title></head>
    <link href="/ui/style.css" rel="stylesheet" />
            </head>
    <body>
        <div class="container">
    <div>
        <a href="/">HOME</a>
        </div>
        <div><h1>${heading}</h1></div>
        <div>
        ${date}
        </div>
    <div>
        ${content}
        </div>
        </div>
        </body>
</html>
`;

return htmltemplate;
}

//Begin Module 4
/* app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'))
});
*/
app.get('/article-three', function (req, res) {
    res.send('Article 3');
});
// Replacing the above two separate function calls with the following dynamic variable value subtitution in the URL
app.get('/articles/:articleName',function(req,res){
var articleName=req.params.articleName;
res.send(createTemplate(articles[articleName]));
});

//End Module 4


var counter=0;
app.get('/counter', function (req, res) {
    counter=counter+1;
    res.send(counter.toString());
});



var names=[];
app.get('/submit-name/:name', function (req, res) {
    var name=req.params.name;
    names.push(name);
    res.send(JSON.stringify(names));
});


//Begin Module P10
//test-db
var pool= new Pool(config);

app.get('/test-db',function (req, res) {
   pool.query('select * from test', function(err, result)
   {
   if (err) {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send(JSON.stringify(result));
        }
  });
});

// Navigate to /test-db to test the above portion of selecting data from DB

//Dynamic content from DB , change the articles function to load articles from DB
app.get('/articlesNew/:articleName',function (req, res) {
    pool.query("select * from article where title='"+req.params.articleName+"'",function(err,result)
    {
        if (err) {
            res.status(500).send(err.toString());
        }
        else
        
        if (result.rows.length===0)
        {
            res.status(404).send('Article not found'); 
        }
        else
            {
           var articleData=result.rows[0];
           res.send(createTemplate2(articleData));
        }
        
    });
});

function createTemplate2(data)
{
       var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
var htmltemplate= `
    <html>
    <head><title>${title}</title>
    <link href="/ui/style.css" rel="stylesheet" />
            </head>
    <body>
        <div class="container">
    <div>
        <a href="/">HOME</a>
        </div>
        <div><h1>${heading}</h1></div>
        <div>
        ${date.toString()}
        </div>
    <div>
        ${content}
        </div>
        </div>
        </body>
</html>
`;

return htmltemplate;
}
//End Module P10



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
