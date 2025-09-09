const express = require('express');
const router = express.Router();
const { createForm, getForm } = require('../controllers/formController');

// POST /api/forms - Create new form
router.post('/', createForm);

// GET /api/forms/:uniqueId - Get form by unique ID
router.get('/:uniqueId', getForm);

module.exports = router;