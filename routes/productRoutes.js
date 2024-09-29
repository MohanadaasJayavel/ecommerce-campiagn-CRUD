const express = require('express');
const multer = require('multer');
const { uploadCSV, reportByCampaign } = require('../controller/productController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = multer({ dest: 'uploads/csv_files' });

router.post('/upload-csv', authenticateJWT, upload.single('file'), uploadCSV);
router.post('/report/campaign', authenticateJWT, reportByCampaign);
router.post('/report/adGroupID', authenticateJWT, reportByCampaign);
router.post('/report/fsnID', authenticateJWT, reportByCampaign);
router.post('/report/productName', authenticateJWT, reportByCampaign);

module.exports = router;
