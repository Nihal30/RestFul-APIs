//jshint esversion:6

const express =require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

//SET EJS
app.set('view engine',ejs);

app.use(bodyParser.urlencoded({
    extended:true
}));
//public folder
app.use(express.static("public"));

//mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true ,useUnifiedTopology: true})
.then(() => {
    console.log('Connected to MongoDB');
    // Continue with the code below
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
  });

const articalSchema={
    title:String,
    content:String
};

const Article = mongoose.model("Article",articalSchema)

// app.get("/articles",function(req,res){
//     // Article.find(function(err,foundArticles){
//     //     console.log(foundArticles);
//     // })
//     Article.find({}, (foundArticles) => {
//         console.log(foundArticles);
        
//       });
// })


/////////////////////////////////////////////////////////////////Request targating all articles
//get Request 
app.get('/articles', (req, res) => {
    Article.find({})
      .then(docs => {
        // console.log("All docs",docs)
        // res.send(docs)
        // res.json(docs); // Send the retrieved documents as a JSON response
      })
      .catch(error => {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ error: 'Failed to retrieve documents' }); // Send an error response
      });
  });

  //POST REquest

  app.post('/articles',(req,res)=>{
    console.log(req.body.title)
    console.log(req.body.content)
    const newArticle =new Article({
        title :req.body.title,
        content:req.body.content
    })

    newArticle.save((err)=>{
        if(!err){
            res.send("Successfull")
        }else{
            res.send(err)
        }
    });
  })

  //DELETE request

//   app.delete("/articles",(req,res)=>{
//     Article.deleteMany((err)=>{
//         if(!err){
//             res.send("Successfull Deleted!!!")
//         }else{
//             res.send(err)
//         }
//     })
//   })


//chained Route Handler
// app.route("/").get().post().delete()

/////////////////////////////////////////////////////////Request targating a specific artical///////////////////////////////////////////////////////////////////


// app.route("/atricles/:articleTitle")
// .get((req,rea)=>{
//     Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
//         if(foundArticle){
//             console.log(foundArticle)
//             res.send(foundArticle);
//         }else{
//             res.send("NO Artical is present")
//         }
//     })
// });

  app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});


//server start
app.listen(3000,()=>{
    console.log("server started on port 3000")
})