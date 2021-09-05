// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

/*
  const options = { weekday: 'short',day: 'numeric',month: 'long',year: 'numeric',timeZoneName: "long"};
  new Intl.DateTimeFormat('en-US', options).format(date)
  date.toString()       
  // 'Wed Jan 23 2019 17:23:42 GMT+0800 (Singapore Standard Time)'
  date.toDateString()   
  // 'Wed Jan 23 2019'
  date.toLocaleString() 
  // '23/01/2019, 17:23:42'
  date.toLocaleString() 
  // '23/01/2019, 17:23:42'
  date.toGMTString()    
  // 'Wed, 23 Jan 2019 09:23:42 GMT'
  date.toUTCString()    
  // 'Wed, 23 Jan 2019 09:23:42 GMT'
  date.toISOString()    
  // '2019-01-23T09:23:42.079Z'
*/
app.get(`/api/`,(req,res)=>{
  let date = new Date();
  return res.json({unix:date.valueOf(),utc:date.toUTCString()});
});

app.get(`/api/:date`,(req,res)=>{
  const {date}  = req.params;
  let result;

  switch(true){
    //unix
    case /^\d+$/.test(date):
      result = new Date(parseInt(date));
      break;
    //utc /^\d{4}-\d{1,2}-\d{1,2}$/
    default:
      result = new Date(Date.parse(date));
  };
  
  if(!isNaN(result)){
    return res.json({unix:result.valueOf(),utc:result.toUTCString()});
  } else{
    return res.json({error:"Invalid Date"});
  }  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
