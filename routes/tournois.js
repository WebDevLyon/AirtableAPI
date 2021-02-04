const express = require('express')
const router = express.Router()

//Controlers
const tournoisCtrl = require('../controllers/tournois.js')

//Routage
router.get('/allrecord', tournoisCtrl.getTournois)
router.get('/onerecord', tournoisCtrl.getOneTournoi)
router.put('/tournoi', tournoisCtrl.modifTournoi) 
router.delete('/tournoi', tournoisCtrl.delTournoi)


module.exports = router