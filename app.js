// require modules
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const nodemailer = require('nodemailer') ;
const mysql = require('mysql') ;
const url = require('url') ;
const express = require('express') ; 
const event = require('events') ;
const mongo = require('mongodb') ;

//mail transporter -> gmail
var transporter = nodemailer.createTransport({
service : 'Gmail' ,  //preferred mailing service , mine is google mail
  auth : {
    user : '' , //enter gmail username
    pass : ''    //enter gmail password
  }
});

//mail options 
var mailOption = {
  from : '' ,  //sender email account 
  to : '' ,     //recipient email account 
  subject : 'sending email using node.j' ,
  text : 'Bingo!! you have done it!'
};

//mysql database configuration 
 var  mysqlClient = mysql.createConnection({
            host : 'localhost' ,
            user : '' , //enter mysql user
            password : '' ,  //enter mysql above user's password
            database : ''    // select database to enter into
          });

//Mongodb database configuration 
var mongoClient = mongo.MongoClient ; 
var mongoURL = "mongodb://localhost:27017/mydb" ;
// var mongoURL = "mongodb://user:password@localhost:27017/mydb" ; 

//created server
http.createServer(function (req, res) {
  //switch case to run desirted module check 
  if (req.url == "/nodeModules") {
    //form module
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      //console.log(fields);
      switch(fields.selectpicker) {
        case 'mysql' : //mysql module
           mysqlClient.connect(function(err){
            if(err) throw err ;
            console.log("connected!! , connection to mysql is there!!");
            var sqlQuery = "select password from Users where username = \"root\" ";
            mysqlClient.query( sqlQuery, function (err , result , fields) {
              if (err) throw err ;
              console.log("Result: " + result); 
            res.end();
            });
          });
          break;

          case 'filetoupload' :  // module formidable
          fs.readFile('uploadForm.html' ,  function(err, data) {
            if (err) throw err ;
            res.writeHead(200, {"Content-Type" : "text/html" });
            res.write(data);
          }); 
          if (req.url = "./filetoupload") {
            var oldpath = files.filetoupload.path;
            var newpath = './' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (error) {
              if (error) console.log(error);
            res.end('File uploaded and moved!');
          });
          }
          break ;

          case 'mongo' :

          mongoClient.connect(mongoURL , function(err , db) {
            if (err) throw err ;
            console.log("Bingo!! connected to mongoDB!!") ;
            db.close();
            res.write("Bingo!! connected to mongoDB!!") ;

          });
          break ;

          case 'eve' : // events module 
          /*console.log("event module is not done yet!!");
          res.end("event module is not done yet!!"); */
          var eventEmitter = new event.EventEmitter() ;
          //create event handler 
          var myEventHandler = function () {
          console.log("Bingo!! you are good to go ;)");
          }
          eventEmitter.on('bingo' , myEventHandler); //assign event handler to event 
          //fire event 
          eventEmitter.emit('bingo') ;
          res.end("Bingo!! you are good to go ;)") ;
          break;

          case 'mail' : //nodemailer module

          transporter.sendMail( mailOption , function( error , info) {
          if (error) console.log(error) ;
          console.log('sent email: ' + info.messageId) ;
          });
          res.end();
        }
  });
  //when want to check database conection 
} else {
    fs.readFile('app.html' , function(err , data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
}
}).listen(8080);