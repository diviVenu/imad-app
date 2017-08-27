var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var app = express();
app.use(morgan('combined'));

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

var pool=require('pg').pool;

var config={
    user: 'divya09feb91',
    database: 'divya09feb91',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_password
};


var articleOne={
    title: 'Article- one',
    heading: 'Article- one',
    date: '20-Aug-2017',
    content: `
    <p>This is the content for article one about article-one.html
    </p>
    `
    
};

function createTemplate(data)
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


app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'))
});

var counter=0;
app.get('/counter', function (req, res) {
    counter=counter+1;
    res.send(counter.toString());
});

app.get('/article-three', function (req, res) {
    res.send('Article 3');
});

var names=[];
app.get('/submit-name/:name', function (req, res) {
    var name=req.params.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

function hash(input,salt)
{
    var hased=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return hashedstring.toString('hex');
}

app.get('/hash/:input',function (req, res) {
    var hashedString=hash(req.params.input,'MyName');
       res.send(hashedString);
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
