const express = require('express');
const multer = require('multer');
const exceljs = require('exceljs');
const path = require('path');

const app = express();
const port = 5000;

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoint for file upload and conversion
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Assuming the uploaded file is a CSV
  const csvData = req.file.buffer.toString();
  const rows = csvData.split('\n').map(row => row.split(','));

  rows.forEach(row => {
    worksheet.addRow(row);
  });

  const excelBuffer = workbook.xlsx.writeBuffer().then(buffer => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.xlsx');
    res.send(buffer);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
