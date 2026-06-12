import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';

const WarehouseDialog = ({ open, warehouse, onClose, onSave }) => {
  const isEdit = !!warehouse;
  
  const [formData, setFormData] = useState({
    warehouse_name: '',
    warehouse_code: '',
    location: '',
    address: '',
    manager_name: '',
    contact_number: '',
    capacity: 0,
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse_name: warehouse.warehouse_name || '',
        warehouse_code: warehouse.warehouse_code || '',
        location: warehouse.location || '',
        address: warehouse.address || '',
        manager_name: warehouse.manager_name || '',
        contact_number: warehouse.contact_number || '',
        capacity: warehouse.capacity || 0,
        status: warehouse.status || 'active'
      });
    } else {
      setFormData({
        warehouse_name: '',
        warehouse_code: '',
        location: '',
        address: '',
        manager_name: '',
        contact_number: '',
        capacity: 0,
        status: 'active'
      });
    }
    setErrors({});
  }, [warehouse, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.warehouse_name) newErrors.warehouse_name = 'Name is required';
    if (!formData.warehouse_code) newErrors.warehouse_code = 'Code is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.capacity < 0) newErrors.capacity = 'Capacity cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="warehouse_name"
              label="Warehouse Name *"
              value={formData.warehouse_name}
              onChange={handleChange}
              error={!!errors.warehouse_name}
              helperText={errors.warehouse_name}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="warehouse_code"
              label="Warehouse Code *"
              value={formData.warehouse_code}
              onChange={handleChange}
              error={!!errors.warehouse_code}
              helperText={errors.warehouse_code || (isEdit ? "Code generally shouldn't change" : "")}
              disabled={isEdit} // Often codes are immutable after creation
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="location"
              label="City / Location *"
              value={formData.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Full Address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="manager_name"
              label="Manager Name"
              value={formData.manager_name}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="contact_number"
              label="Contact Number"
              value={formData.contact_number}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="capacity"
              label="Total Capacity (Items)"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
              fullWidth
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="status"
              label="Status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseDialog;
