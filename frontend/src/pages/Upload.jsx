import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import dataService from '../services/dataService';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setMessage({ type: '', text: '' });
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setUploading(true);
    setMessage({ type: 'info', text: 'Uploading file...' });

    try {
      const file = files[0];
      const response = await dataService.uploadFile(file);
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: `File "${file.name}" uploaded successfully! You can now create charts with this data.` 
        });
        setFiles([]);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.message || 'Failed to upload file' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload file. Please try again.' 
      });
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Upload Data File
        </Typography>
        
        <Paper
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 8,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'primary.main',
            },
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.primary" gutterBottom>
            {isDragActive ? 'Drop the file here...' : 'Drag & drop a data file here, or click to select'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: .xls, .xlsx, .csv, .json
          </Typography>
        </Paper>

        {files.length > 0 && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected file:
            </Typography>
            <List dense>
              {files.map(file => (
                <ListItem key={file.name} sx={{ px: 0 }}>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(1)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {message.text && (
          <Alert 
            severity={message.type === 'error' ? 'error' : message.type === 'success' ? 'success' : 'info'}
            sx={{ mb: 3 }}
          >
            {message.text}
          </Alert>
        )}

        <Box>
          <Button
            variant="contained"
            size="large"
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            sx={{ minWidth: 150 }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Upload;