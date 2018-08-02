import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json());
const dbUrl = "mongodb://localhost";

const validate = (data) => {
  let error = {};
  if (data.title === '') error.title = "Can't be empty";
  if (data.cover === '') error.cover = "Can't be empty";

  const isValid = Object.keys(error).length === 0

  return { error, isValid };
}

mongodb.MongoClient.connect(dbUrl, (err, client) => {
  if (err) throw err;

  const db = client.db('crud');

  app.get('/api/games', (req, res) => {
    db.collection('games').find({}).toArray((err, games) => {
      res.json({ games });
    });
  });

  app.get('/api/games/:_id', (req, res) => {
    db.collection('games').findOne({_id: new mongodb.ObjectId(req.params._id)},(err, game)=>{
      res.json({ game });
    }) 
  });

  app.delete('/api/games/:_id', (req, res) => {
    db.collection('games').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, game) => {
      if (err) { res.status(500).json({ error: { global: err } }); return; }

      res.json({ });
    });
  })


  app.put('/api/games/:_id',(req, res) => {
    const { error, isValid } = validate(req.body);
    if (isValid) {
      const { title, cover } = req.body;
      db.collection('games').findOneAndUpdate(
        {_id: new mongodb.ObjectId(req.params._id)},
        {$set: {title,cover}},
        {returnOriginal: false},
        (err,result) => {
          if(err){
            res.status(500).json({error:{global:err}});
            return;
          }
          res.json({game: result.value})
        }
      )
    }else{
      res.status(400).json({ error });
    }
  })


  app.post('/api/games', (req, res) => {
    const { error, isValid } = validate(req.body);

    if (isValid) {
      const { title, cover } = req.body;
      db.collection('games').insert({ title, cover }, (err, result) => {
        if (err) {
          res.status(500).json({ error: { global: "Something went wrong" } });
        } else {
          res.json({ game: result.ops[0] });
        }
      });
    } else {
      res.status(400).json({ error });
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      error: {
        global: "Still working on it. Please try again later than when we implement it"
      }
    })
  })

  app.listen(8080, () => console.log('Server is running on localhost:8080'));
});