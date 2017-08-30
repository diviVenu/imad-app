var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var app = express();
app.use(morgan('combined'));
var bodyParser=require('body-parser');
var session=require('express-session');

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

var articles={
    'article-one':{
    title: 'Article- one',
    heading: 'Article- one',
    date: '20-Aug-2017',
    content: `
    <p>This is the content for article one about article-one.html
    </p>   `
},
 'article-two':{
    title: 'Article- two',
    heading: 'Article- two',
    date: '30-Aug-2017',
    content: `
    <p>This is for Module P4 JS,HTML,CSS in article two.
    </p>   `
}
};

var pool= new Pool(Config);
//Begin Module P10
//test-db
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
            res.status(500).send('Article not found'); 
        }
        else
            {
           var articleData=result.rows[0];
           res.send(createTemplate2(articleData));
        }
        
    });
});
//End Module P10
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

//Begin Module 4
/* app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'))
});
*/
// Replacing the above two separate function calls with the following dynamic variable value subtitution in the URL
app.get('/:articleName',function(req,res){
var articleName=req.params.articleName;
res.send(createTemplate(articles[articleName]));
});

//End Module 4

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


//Module P11
function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input',function (req, res) {
    var hashedString=hash(req.params.input,'MyName');
       res.send(hashedString);
});

app.use(bodyParser.json());
app.use(session({secret:'somerandomvalue', cookie:{maxAge: 1000*60*60*24*30}}));

app.post('/create-user', function(req,res){
    
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.RandomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO USERS (username,password) values ($1,$2)',[username,dbString],function(err,result){
        if (err) {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send('user Successfully created!!'+ username);
        }
    });
    });
    
    //Login and Session
 
 app.post('/login', function(req,res){
    
    var username=req.body.username;
    var password=req.body.password;
   
    pool.query('SELECT * FROM USERS WHERE username=$1',[username],function(err,result){
        if (err) {
            res.status(500).send(err.toString());
        }
        else
        {
           if (result.rows.length===0)
           {
            res.send(403).send('username/paswd os invalid');
                    }
                    else
                    {
                        var dbString=result.rows[0].password;
                        var salt=dbString.split('$1')[2];
                        var hashedPassword=hash(password,salt);
                        
                        if(hashedPassword===dbString)
                        {
                             req.session.auth={userId: result.rows[0].id};
                            res.send('Credentials Correct');
                        }
                        else
                        {
                            res.send(403).send('uname/pswd is invalid');
                        }
                    }
        }
    });
    }); 
    
    //Check session is created
    
    app.get('/Check-login',function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId){
       res.send('You are loged in:'+ req.session.auth.userId.toStrin());
          }
          else{
              res.send("You are not logged in");
          }
});

//Logout and check session
app.get('/Check-logout',function (req, res) {
   delete req.session.auth;
              res.send("You are Logged Out!");
        
});
  
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
