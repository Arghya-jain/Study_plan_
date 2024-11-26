const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');

router.post('/generate', studyPlanController.generatePlan);
router.get('/:planId', studyPlanController.getStudyPlan);
router.put('/:planId', studyPlanController.updateStudyPlan);

module.exports = router;