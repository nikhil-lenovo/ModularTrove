import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import { PhotoLibrary, Close } from '@mui/icons-material';
import axios from 'axios';

const Gallery = () => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/designs');
      setDesigns(response.data);
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredDesigns = designs.filter(
    (design) =>
      (!selectedCategory || design.category === selectedCategory) &&
      (design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpen = (design) => {
    setSelectedDesign(design);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{ minWidth: 120 }}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredDesigns.map((design) => (
          <Grid item xs={12} sm={6} md={4} key={design.id}>
            <Paper
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 8,
                  cursor: 'pointer',
                },
              }}
              onClick={() => handleOpen(design)}
            >
              <img
                src={`http://localhost:8000${design.image_path.replace(/\\/g, '/')}`}
                alt={design.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {design.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {design.category}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{selectedDesign?.title}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img
              src={`http://localhost:8000${selectedDesign?.image_path.replace(/\\/g, '/')}`}
              alt={selectedDesign?.title}
              style={{
                width: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
            <Typography variant="body1">
              {selectedDesign?.description}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;
