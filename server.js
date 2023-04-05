const express=require('express')
const app=express();
require('dotenv').config()
const session =require('express-session')
// use process.env to get all the setted environment variables
const MongoStore = require('connect-mongo');


const comments = [

    {
        id: 0,
        user:"john",
        text:"this is john's comment"
    },
    {
        id: 1,
        user:"harry",
        text:"this is harry's comment"
    },
    {
        id: 2,
        user:"ron",
        text:"this is ron's comment"
    },
    
]


var methodOverride = require('method-override')


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))



app.patch('/comments/:commentid',(req,res)=>{
        
})







const e = require('express');
const mongo=require('mongoose')
const path = require('path')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs')




mongo.set("strictQuery", false);
    mongo.connect("mongodb+srv://messenger:Project%40123@cluster0.10fn5ry.mongodb.net/?retryWrites=true&w=majority/session" ).then(console.log("Sucessfully ! connected to database...")).catch(err => console.log(err))
const sessionStore={
    mongoUrl: "mongodb+srv://messenger:Project%40123@cluster0.10fn5ry.mongodb.net/?retryWrites=true&w=majority/session",
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native',  // option disabled
    // autoRemove: 'interval',  when you dont want to use ttl so use interval instead
    // autoRemoveInterval: 10 
    touchAfter: 24 * 3600 , //LAZY UPDATE: vgenerally it will will not update database everytime user refreshes but it saves every given range of time 
    // crypto: {
    //     secret: 'squirrel'   when session data contains some useful information
    //   }
}




app.use(session({
    key:'myapp',// Name by which session wil be stored on user session
    
    secret:process.env.key,// a random unique string key used to authenticate a session. 
    saveUninitialized:true,
    resave:false,//takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request.
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, 
    store:MongoStore.create(sessionStore),// max time set to one day   
    // got one error use 127.0.0.1 instead of localhost opps
}))




app.get('/',(req,res)=>{
    if(req.session.uid){
        if(req.session.count){
            req.session.count++

        }else{
            req.session.count=1
        }
        console.log(req.session)
    }
    else{
        req.session.uid='nameme'
    }
    res.render('index')
})

const islogin=(req,res,next)=>{
    if(req.session.uid){
        next();
    }
    else{
        res.redirect('/login')
    }
}
app.get('/value',islogin,(req,res)=>{
    if(req.session){
        res.send('you got valuable info '+req.session.count)
        console.log(req.session)
    }
    else{
        res.redirect('/')
    }
})

app.get('/comments', (req, res) => {
    res.render('index2', { comments });
});


app.get('/comments/new', (req, res) => {
    res.render('new');
});
app.post('/comments', (req, res) => {
    const { user, text } = req.body;
    comments.push({ id: comments.length, user, text });

    res.redirect('/comments');
});



app.listen(process.env.port,()=>{
    console.log(`sucessfully started at ${process.env.port}`)
})
