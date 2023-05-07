const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
   // .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.createNewEmployee)
   // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), statesController.updateEmployee)
    //.delete(verifyRoles(ROLES_LIST.Admin), statesController.deleteEmployee);

router.route('/:state')
    .get(statesController.getState);

module.exports = router;