require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



//URL Shortener Microservice
const dns = require('dns');

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});

app.post(`/api/shorturl`, urlencodedParser, function (request, response) {
    if(!request.body) response.status(404).json({"error":"Invalid URL"});
    console.log(request.body);
    
    const regex = /^((http:\/\/|https:\/\/)*(www\.)*)*((\d|\w|\-{1})+\.)+(\d|\w|\-{1})+(\d|\w|\-{1})*(\d|\w)*($|\/)/mgi;    
    const url = request.body.url;

    if(regex.test(url))
    { 
      const match = /(www\.)*((\d|\w|\-{1})+\.)+(\d|\w|\-{1})+(\d|\w|\-{1})*(\d|\w)/mgi;
      const result = url.match(match).toString();
      console.log(`match: ${result}`);

      /*
      dns.lookup(result, (err, address, family) => {
        if(err) return console.error(err);
      });
      */

      const obj = ShortUrl.Add(url);
      return response.send({
        "original_url":url,
        "short_url":obj.id
      });
      console.log("ok");
    }
    
    response.json({"error":"Invalid URL"});
});


//Database
const ShortUrl = new Object();
ShortUrl.DB = new Array();

ShortUrl.FindId = function(id)
{
  if(id>=0 && id<this.DB.length)
    return {id:id, url:this.DB[id]};
};

ShortUrl.FindUrl = function(url)
{
  for(let i=0;i<this.DB.length;i++)
    if(url == this.DB[i])
      return {id:i, url:this.DB[i]};
}

ShortUrl.Add = function(url)
{
  const obj = ShortUrl.FindUrl(url);
  if(obj != undefined)
    return obj;

  const id = this.DB.push(url)-1;
  return {id:id, url:this.DB[id]};
}

app.get(`/api/shorturl/`,(req,res) => res.sendStatus(404));
app.get(`/api/shorturl/:id`, (req,res)=>{
  const {id} = req.params;
  if(/^\d+$/.test(id))
  {
    const obj = ShortUrl.FindId(Number.parseInt(id));
    if(obj != undefined)
      return res.redirect(301, obj.url);

    /*
      return res.json({
        "original_url":obj.url,
        "short_url":obj.id
      });
    */

    return res.json({"error":"No short URL found for the given input"});
  }
  
  res.json({"error":"Wrong format"});
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
