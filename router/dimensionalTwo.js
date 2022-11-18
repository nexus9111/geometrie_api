const express = require('express');
const router = express.Router();
const controller = require('../controllers/dimensionalTwoController');

// C
router.post('/create', controller.create);

// R
router.get('/', controller.list);
router.get('/:name', controller.getOne);

// U
router.put('/:name', controller.update);

// D
router.delete('/:name', controller.delete);

router.get("/distance/:name1/:name2", controller.distance);

module.exports = router;