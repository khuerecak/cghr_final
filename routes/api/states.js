const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const funfactsController = require('../../controllers/funfactsController');

router.route('/')
    .get(statesController.getAllStates)

router.route('/:state')
    .get(statesController.getState);

router.route('/:code/capital')
    .get(statesController.getStateCapital);

router.route('/:code/nickname')
    .get(statesController.getNickname);

router.route('/:code/population')
    .get(statesController.getPopulation);

router.route('/:code/admission')
    .get(statesController.getAdmission);

router.route('/:code/funfact')
    .get(funfactsController.getFunFacts)
    .post(funfactsController.createFunFact)
    .delete(funfactsController.deleteFunFact)
    .patch(funfactsController.updateFunFact);


module.exports = router;