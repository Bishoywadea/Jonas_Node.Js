const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();
 
router.get('/',viewsController.getOverView);

router.get('/login',viewsController.getLoginPage);

router.get('/tour/:name',viewsController.getTour);
  

module.exports = router;