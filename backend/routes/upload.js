const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const auth = require('../middleware/auth');
const File = require('../models/File');
const pdfProcessor = require('../services/pdfProcessor');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for Excel and PDF files
const fileFilter = (req, file, cb) => {
  const filetypes = /xlsx|xls|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.mimetype === 'application/vnd.ms-excel' ||
                  file.mimetype === 'application/pdf';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Excel files only!');
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST api/upload
// @desc    Upload Excel or PDF file
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let processedData = {};
    let columns = [];
    let data = [];
    let fileType = 'unknown';

    if (fileExtension === '.pdf') {
      // Process PDF file
      fileType = 'pdf';
      const pdfResult = await pdfProcessor.processPDF(req.file.path);
      
      if (!pdfResult.success) {
        throw new Error(`PDF processing failed: ${pdfResult.error}`);
      }

      processedData = pdfResult;
      
      // Convert PDF data to tabular format for database storage
      if (pdfResult.extractedData.tables && pdfResult.extractedData.tables.length > 0) {
        const mainTable = pdfResult.extractedData.tables[0];
        columns = mainTable.headers.map(header => ({
          name: header,
          type: 'string'
        }));
        data = mainTable.data;
      } else {
        // If no tables found, create a simple structure with extracted text
        columns = [{ name: 'Content', type: 'string' }];
        data = [{ Content: pdfResult.extractedData.text.substring(0, 1000) + '...' }];
      }
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      // Process Excel file
      fileType = 'excel';
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      data = xlsx.utils.sheet_to_json(worksheet);
      
      // Extract column headers
      const firstRow = data[0] || {};
      
      Object.keys(firstRow).forEach(key => {
        columns.push({
          name: key,
          type: typeof firstRow[key]
        });
      });

      processedData = {
        success: true,
        fileType: 'excel',
        extractedData: { data, columns }
      };
    } else {
      throw new Error('Unsupported file type');
    }

    // Create file record in database
    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      user: req.user.id,
      fileType,
      columns,
      data,
      processedData // Store the full processed data for PDF files
    });

    await file.save();

    // Prepare response based on file type
    const response = {
      id: file._id,
      filename: file.originalname,
      fileType,
      columns: file.columns,
      data: file.data.slice(0, 10), // Return first 10 rows for preview
      totalRows: file.data.length
    };

    // Add PDF-specific data to response
    if (fileType === 'pdf' && processedData.success) {
      response.pdfData = {
        pages: processedData.metadata.pages,
        tables: processedData.extractedData.tables.length,
        hasStructuredData: processedData.extractedData.tables.length > 0,
        extractedNumbers: processedData.extractedData.numbers.length,
        extractedDates: processedData.extractedData.dates.length,
        visualizationSuggestions: pdfProcessor.convertToVisualizationData(processedData.extractedData)
      };
    }

    res.json(response);

  } catch (err) {
    console.error(err.message);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).send('Server error');
  }
});

// @route   GET api/upload/files
// @desc    Get user's uploaded files
// @access  Private
router.get('/files', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id })
      .select('filename originalname createdAt columns')
      .sort({ createdAt: -1 });
    
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/upload/files/:id
// @desc    Get file data by ID
// @access  Private
router.get('/files/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    res.json({
      id: file._id,
      filename: file.originalname,
      columns: file.columns,
      data: file.data,
      totalRows: file.data.length
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'File not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
