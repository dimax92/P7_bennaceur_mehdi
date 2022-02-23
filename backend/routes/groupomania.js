const express = require("express");
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const authentification = require('../middleware/authentification');
const authentificationcharge = require('../middleware/authentificationcharge');
//const fs = require('fs');
//const bodyParser = require("body-parser");
//const mysql = require('mysql');
const multer  = require('multer');
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./../frontend/public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine});
const apiCtrl = require("../controllers/groupomania");
const router = express.Router();

router.post('/signup', apiCtrl.inscription);
router.post("/profil", apiCtrl.profil);
router.post("/modifienom", authentification, apiCtrl.modifierNom);
router.post("/modifieemail", authentification, apiCtrl.modifierEmail);
router.post("/modifiemotdepasse", authentification, apiCtrl.modifierMotdepasse);
router.post("/supprimercompte", authentification, apiCtrl.supprimerCompte);
router.get("/participation", apiCtrl.participation);
router.post('/insertiontexte', authentification, apiCtrl.insertionTexte);
router.get("/extractiontexte", apiCtrl.extractionTexte);
router.post("/suppressiontexte", authentification, apiCtrl.suppressionTexte);
router.post('/insertionvideo', authentification, upload.single("image"), apiCtrl.insertionVideo);
router.post("/dernier", apiCtrl.derniereParticipation);
router.get("/extractionvideo", apiCtrl.extractionVideo);
router.post("/suppressionvideo", authentification, apiCtrl.suppressionVideo);
router.post("/logincharge", apiCtrl.loginCharge);
router.post("/suppressiontextecharge", authentificationcharge, apiCtrl.suppressionTexteCharge);
router.post("/suppressionvideocharge", authentificationcharge, apiCtrl.suppressionVideoCharge);
router.get("/authentification", authentification, apiCtrl.authentification);
router.get("/authentificationcharge", authentificationcharge, apiCtrl.authentificationCharge);
router.get("/extractionforum", apiCtrl.extractionForum);
router.post("/extractionforumindividuelle", apiCtrl.extractionForumIndividuelle);
router.post('/insertioncommentaire', authentification, apiCtrl.insertionCommentaire);
router.post("/extractioncommentaire", apiCtrl.extractionCommentaire);

module.exports = router;