const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentification = require('./middleware/authentification');
const authentificationcharge = require('./middleware/authentificationcharge');
const fs = require('fs');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const multer  = require('multer');
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine});
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'groupomania'
  });
connection.connect();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
//Routes inscription
app.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.motdepasse, 10)
  .then(hash=>{
    connection.query("INSERT INTO inscription (nom, email, motdepasse, derniereparticipation) VALUES (?,?,?,?)",[req.body.nom, req.body.email, hash, req.body.date]
    );
    res.status(200).json({message: "tout est ok"});
  })
  .catch(error=>res.status(500).json({error}))
});
app.post("/profil", (req, res, next) => {
  let resultat="";
  connection.query("SELECT * FROM inscription WHERE nom = ? AND email = ?",[req.body.nom, req.body.email], function (error, results, fields) {
    if (error) throw error;
    resultat=results;
    if(resultat.length===1){
      bcrypt.compare(req.body.motdepasse, resultat[0].motdepasse)
    .then((valid)=>{
      if(!valid){
        return res.status(400).json({error:"Mot de passe incorrect"});
      }
      connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, resultat[0].id]
      );
      res.status(200).json({
        userId: resultat[0].id,
        token: jwt.sign(
          { userId: resultat[0].id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' }
        )
      });
    })
    }else{
      if(resultat.length===0){
        res.status(410).json({message: "nom ou email incorrect"});
      }
    }
  });
});
app.post("/supprimercompte", authentification, (req, res, next)=>{
  connection.query("DELETE FROM inscription WHERE id=?",[req.body.utilisateur],(error, results, flelds)=>{
    console.log(req.body);
    res.status(200).json({message: "tout est ok"});
  }
  );
})
//Route profil
app.get("/participation", (req, res, next) => {
  let resultat="";
  connection.query("SELECT * FROM inscription", function (error, results, fields) {
    if (error) throw error;
    resultat=results;
    res.json(resultat);
  });
});
//Routes forum texte
app.post('/insertiontexte', authentification, (req, res, next) => {
  connection.query("INSERT INTO forumtexte (utilisateur, texte) VALUES (?,?)",[req.body.utilisateur, req.body.texte]
  );
  connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, req.body.utilisateur]
    );
  res.status(200).json({message: "tout est ok"});
  console.log(req.headers);
});
app.get("/extractiontexte", (req, res, next) => {
  let resultat="";
  connection.query("SELECT * FROM forumtexte", function (error, results, fields) {
    if (error) throw error;
    resultat=results;
    res.json(resultat);
  });
});
app.post("/suppressiontexte", authentification, (req, res, next)=>{
  connection.query("DELETE FROM forumtexte WHERE utilisateur=? AND texte=?", [req.body.utilisateur, req.body.textesupprime], function (error, results, fields) {
    if (error) throw error;
    if(results.affectedRows===1){
      res.status(200).json({message: "texte supprimer"});
    }else{
      res.status(400).json({message: "texte non supprimer"});
    };
  });
})
//Routes forum multimedia
app.post('/insertionvideo', authentification, upload.single("image"), (req, res, next) => {
  connection.query("INSERT INTO forummultimedia (utilisateur, video) VALUES (?, ?)",[req.query.utilisateur, req.file.filename],
  function (error, results, fields){
    console.log(error)
  }
  );
  console.log(req.query);
  res.status(200).json({message: "tout est ok"});
});
app.post("/dernier", (req, res, next)=>{
  connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, req.body.utilisateur]
    );
  console.log(req.body);
  res.status(200).json({message: "tout est ok"});
})
app.get("/extractionvideo", (req, res, next) => {
  let resultat="";
  connection.query("SELECT * FROM forummultimedia", function (error, results, fields) {
    if (error) throw error;
    resultat=results;
    res.json(resultat);
  });
});
app.post("/suppressionvideo", authentification, (req, res, next)=>{
  connection.query("DELETE FROM forummultimedia WHERE utilisateur=? AND video=?", [req.query.utilisateur, req.body.liensqlvideo], function (error, results, fields) {
    if (error) throw error;
    if(results.affectedRows===1){
      fs.unlink(req.body.videosupprime, (err) => {
        if (err) throw err;
        res.status(200).json({message: "video supprimer"});
      });
    }else{
      res.status(400).json({message: "video non supprimer"});
    };
  });
})
//Routes Charge de communication
app.post("/logincharge", (req, res, next) => {
  console.log(req.body);
  if(req.body.motdepasse==="aaaa"){
    res.status(200).json({
      userId: req.body.userId,
      token: jwt.sign(
        { userId: req.body.userId },
        'TOKEN',
        { expiresIn: '24h' }
      )
    });
  }else{
    res.status(400).json({message:"mot de passe incorrect"});
  }
});
app.post("/suppressiontextecharge", authentificationcharge, (req, res, next)=>{
  console.log(req.body);
  connection.query("DELETE FROM forumtexte WHERE texte=?", [req.body.textesupprime], function (error, results, fields) {
    if (error) throw error;
    if(results.affectedRows===1){
      res.status(200).json({message: "texte supprimer"});
    }else{
      res.status(400).json({message: "texte non supprimer"});
    };
  });
})
app.post("/suppressionvideocharge", authentificationcharge, (req, res, next)=>{
  connection.query("DELETE FROM forummultimedia WHERE video=?", [req.body.liensqlvideo], function (error, results, fields) {
    if (error) throw error;
    if(results.affectedRows===1){
      fs.unlink(req.body.videosupprime, (err) => {
        if (err) throw err;
        res.status(200).json({message: "video supprimer"});
      });
    }else{
      res.status(400).json({message: "video non supprimer"});
    };
  });
})
//require("./routes/inscription.route")(app);
app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});

