var express = require('express');
var app = express();

const bodyParser= require('body-parser');
const fs = require('fs');
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
 app.use(bodyParser.urlencoded({extended: true}))


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
}); 



//set port
var port = process.env.PORT || 8080
app.use(express.static(__dirname));

//routes
app.get("/", function(req, res){
    res.render("index");
})

app.listen(port, function(){
    console.log("app running");
})

app.post('/uploadtwitter', (req, res)=> {
    console.log(req.body.image);
    console.log(req.body.text);
    // res.send({
    //     sucess : true
    // });
   // var b64content = fs.readFileSync(req.body.image, { encoding: 'base64' })
    var b64content = req.body.image.split(',')[1];
    // console.log(b64content);
    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "beequal";
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
    
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: req.body.text, media_ids: [mediaIdStr] }
    
          T.post('statuses/update', params, function (err, data, response) {
            res.send ({
                "success" : "true"
            });
          })
        }
      })
    })
  });