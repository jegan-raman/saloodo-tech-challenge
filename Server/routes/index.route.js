const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/login', controller.login);
router.get('/shipments', controller.getShipments)
router.get('/shipments/dashboard', controller.getDashboardReports)
router.post('/shipments/assign', controller.assignShipments)
router.put('/shipments/update', controller.updateShipments)
router.get('/users', controller.getUsers)

module.exports = router;