const express = require('express');
const router = express.Router();
const { getPlantCareAdvice } = require('../controllers/plantCareController');

// Route to get plant care advice from Gemini API
router.post('/gemini', getPlantCareAdvice);

module.exports = router;
