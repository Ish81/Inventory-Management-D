import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';

const StockDialog = ({ open, mode, warehouseId, onClose, onSave }) => {
  // mode is either 'add' or 'remove'
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Reset form when opened
  React.useEffect(() => {
    if (open) {
      setFormData({
        product_id: '',
        quantity: '',
        notes: ''
      });
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_id) newErrors.product_id = 'Product ID is required';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        warehouse_id: warehouseId,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        notes: formData.notes
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Stock In (Add Stock)' : 'Stock Out (Remove Stock)'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="product_id"
              label="Product ID"
              type="number"
              value={formData.product_id}
              onChange={handleChange}
              error={!!errors.product_id}
              helperText={errors.product_id || "ID of the product (e.g., 1)"}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              size="small"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes / Reason"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color={mode === 'add' ? 'primary' : 'error'}
        >
          {mode === 'add' ? 'Add Stock' : 'Remove Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockDialog;
