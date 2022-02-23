const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mysql = require('mysql');
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'groupomania'
  });
connection.connect();

exports.inscription = (req, res, next) => {
  const schemaPassword = new passwordValidator();

  schemaPassword
  .is().min(8)                                    
  .is().max(100)                                  
  .has().uppercase()                              
  .has().lowercase()                              
  .has().digits(1)   
  .has().symbols(1)                             

  if(schemaPassword.validate(req.body.motdepasse) && emailValidator.validate(req.body.email)){
    bcrypt.hash(req.body.motdepasse, 10)
    .then(hash=>{
      connection.query("INSERT INTO inscription (nom, email, motdepasse, derniereparticipation) VALUES (?,?,?,?)",[req.body.nom, req.body.email, hash, req.body.date]
      );
      res.status(200).json({message: "tout est ok"});
    })
    .catch(error=>res.status(500).json({error}))
  }else{
    res.status(501).json({ message: "mot de passe ou email incorrect"});
  }
};

  exports.profil = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM inscription WHERE email = ?",[req.body.email], function (error, results, fields) {
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
  };

  exports.modifierNom = (req, res, next) => {                           
        connection.query("UPDATE inscription SET nom=?, derniereparticipation=? WHERE id=?",[req.body.donnees, req.body.date, req.body.utilisateur]
        );
        res.status(200).json({message: "tout est ok"});
  };

  exports.modifierEmail = (req, res, next) => {                            
    if(emailValidator.validate(req.body.donnees)){
        connection.query("UPDATE inscription SET email=?, derniereparticipation=? WHERE id=?",[req.body.donnees, req.body.date, req.body.utilisateur]
        );
        res.status(200).json({message: "tout est ok"});
    }else{
      res.status(501).json({ message: "email incorrect"});
    }
  };
  
exports.modifierMotdepasse = (req, res, next) => {
    const schemaPassword = new passwordValidator();
  
    schemaPassword
    .is().min(8)                                    
    .is().max(100)                                  
    .has().uppercase()                              
    .has().lowercase()                              
    .has().digits(1)   
    .has().symbols(1)                             
  
    if(schemaPassword.validate(req.body.donnees)){
      bcrypt.hash(req.body.donnees, 10)
      .then(hash=>{
        connection.query("UPDATE inscription SET motdepasse=?, derniereparticipation=? WHERE id=?",[hash, req.body.date, req.body.utilisateur]
        );
        res.status(200).json({message: "tout est ok"});
      })
      .catch(error=>res.status(500).json({error}))
    }else{
      res.status(501).json({ message: "mot de passe incorrect"});
    }
  };

  exports.supprimerCompte = (req, res, next)=>{
    connection.query("DELETE FROM commentaires WHERE utilisateur=?",[req.body.utilisateur],(error, results, flelds)=>{
      connection.query("SELECT id FROM forum WHERE utilisateur=?",[req.body.utilisateur],(error, results, flelds)=>{
        for(i=0; i<=results.length-1; i++){
          connection.query("DELETE FROM commentaires WHERE idproduit=?",[results[i].id]
          );
        };
        connection.query("DELETE FROM forum WHERE utilisateur=?",[req.body.utilisateur],(error, results, flelds)=>{
          connection.query("DELETE FROM inscription WHERE id=?",[req.body.utilisateur],(error, results, flelds)=>{
            res.status(200).json({message: "tout est ok"});
          }
          );
        }
        );
      }
      );
    }
    );
  };

  exports.participation = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM inscription", function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  };

  exports.insertionTexte = (req, res, next) => {
    connection.query("SELECT nom FROM inscription WHERE id = ?",[req.body.utilisateur], function (error, results, fields) {
      connection.query("INSERT INTO forum (utilisateur, contenu, type, date, nom) VALUES (?,?,?,?,?)",[req.body.utilisateur, req.body.texte, "texte", req.body.date, results[0].nom]
      );
    });
    connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, req.body.utilisateur]
      );
    res.status(200).json({message: "tout est ok"});
  };

  exports.extractionTexte = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM forumtexte", function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  };

  exports.suppressionTexte = (req, res, next)=>{
    connection.query("DELETE FROM commentaires WHERE idproduit=?",[req.body.id],(error, results, fields)=>{
      connection.query("DELETE FROM forum WHERE id=?", [req.body.id], function (error, results, fields) {
        if (error) throw error;
        if(results.affectedRows===1){
          res.status(200).json({message: "texte supprimer"});
        }else{
          res.status(400).json({message: "texte non supprimer"});
        };
      });
    }
    );
  };

  exports.insertionVideo = (req, res, next) => {
    connection.query("SELECT nom FROM inscription WHERE id = ?",[req.query.utilisateur], function (error, results, fields) {
      connection.query("INSERT INTO forum (utilisateur, contenu, type, date, nom) VALUES (?, ?, ?, ?, ?)",[req.query.utilisateur, req.file.filename, "image", req.query.date, results[0].nom]);
    });
    res.status(200).json({message: "tout est ok"});
  };

  exports.derniereParticipation = (req, res, next)=>{
    connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, req.body.utilisateur]
      );
    res.status(200).json({message: "tout est ok"});
  };

  exports.extractionVideo = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM forummultimedia", function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  };

  exports.suppressionVideo = (req, res, next)=>{
    connection.query("DELETE FROM commentaires WHERE idproduit=?",[req.body.id],(error, results, fields)=>{
      connection.query("DELETE FROM forum WHERE id=?", [req.body.id], function (error, results, fields) {
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
    });
  };

  exports.loginCharge = (req, res, next) => {
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
  };

  exports.suppressionTexteCharge = (req, res, next)=>{
    connection.query("DELETE FROM commentaires WHERE idproduit=?",[req.body.id],(error, results, fields)=>{
      connection.query("DELETE FROM forum WHERE id=?", [req.body.id], function (error, results, fields) {
        if (error) throw error;
        if(results.affectedRows===1){
          res.status(200).json({message: "texte supprimer"});
        }else{
          res.status(400).json({message: "texte non supprimer"});
        };
      });
    }
    );
  };

  exports.suppressionVideoCharge = (req, res, next)=>{
    connection.query("DELETE FROM commentaires WHERE idproduit=?",[req.body.id],(error, results, fields)=>{
      connection.query("DELETE FROM forum WHERE id=?", [req.body.id], function (error, results, fields) {
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
    });
  };

  exports.authentification = (req, res, next)=>{
    res.status(200).json({message: "OK"});
  };

  exports.authentificationCharge = (req, res, next)=>{
    res.status(200).json({message: "OK"});
  };


///////////////////////////TEST

  exports.extractionForum = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM forum ORDER BY id DESC", function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  };

  exports.extractionForumIndividuelle = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM forum WHERE id = ?",[req.body.id], function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  };

  exports.insertionCommentaire = (req, res, next) => {
    connection.query("SELECT nom FROM inscription WHERE id = ?",[req.body.utilisateur], function (error, results, fields) {
      connection.query("INSERT INTO commentaires (nom, idproduit, date, commentaire, utilisateur) VALUES (?,?,?,?,?)",[results[0].nom, req.body.idproduit, req.body.date, req.body.commentaire, req.body.utilisateur]
      );
    });
    connection.query("UPDATE inscription SET derniereparticipation=? WHERE id=?",[req.body.date, req.body.utilisateur]
      );
    res.status(200).json({message: "tout est ok"});
  };

  exports.extractionCommentaire = (req, res, next) => {
    let resultat="";
    connection.query("SELECT * FROM commentaires WHERE idproduit = ?",[req.body.id], function (error, results, fields) {
      if (error) throw error;
      resultat=results;
      res.json(resultat);
    });
  }