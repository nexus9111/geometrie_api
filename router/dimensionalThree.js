const express = require('express');
const router = express.Router();
const controller = require('../controllers/dimensionalThreeController');

// C
router.post('/create', controller.create);
router.get("/distance", controller.distance);

// R
router.get('/', controller.list);
router.get('/:name', controller.getOne);

// U
router.put('/:name', controller.update);

// D
router.delete('/:name', controller.delete);


module.exports = router;