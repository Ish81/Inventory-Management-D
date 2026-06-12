import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CompareArrows as TransferIcon } from '@mui/icons-material';
import warehouseService from '../../services/warehouseService';
import stockService from '../../services/stockService';
import movementService from '../../services/movementService';

const Transfers = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    from_warehouse_id: '',
    to_warehouse_id: '',
    product_id: '',
    quantity: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const whResponse = await warehouseService.getAll();
      setWarehouses(whResponse.data);

      // Fetch recent transfers
      const movResponse = await movementService.getAll({ movement_type: 'TRANSFER_OUT' });
      setRecentTransfers(movResponse.data);
    } catch (err) {
      showSnackbar('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

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
    if (!formData.from_warehouse_id) newErrors.from_warehouse_id = 'Source is required';
    if (!formData.to_warehouse_id) newErrors.to_warehouse_id = 'Destination is required';
    if (formData.from_warehouse_id && formData.from_warehouse_id === formData.to_warehouse_id) {
      newErrors.to_warehouse_id = 'Destination must be different from source';
    }
    if (!formData.product_id) newErrors.product_id = 'Product ID is required';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be > 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      await stockService.transferStock({
        from_warehouse_id: formData.from_warehouse_id,
        to_warehouse_id: formData.to_warehouse_id,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        notes: formData.notes
      });
      showSnackbar('Transfer completed successfully');
      setFormData({
        from_warehouse_id: '',
        to_warehouse_id: '',
        product_id: '',
        quantity: '',
        notes: ''
      });
      fetchData(); // Refresh history
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Transfer failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Stock Transfers
      </Typography>

      <Grid container spacing={4}>
        {/* Transfer Form */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TransferIcon color="primary" /> New Transfer
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    name="from_warehouse_id"
                    label="From Warehouse (Source) *"
                    value={formData.from_warehouse_id}
                    onChange={handleChange}
                    error={!!errors.from_warehouse_id}
                    helperText={errors.from_warehouse_id}
                    fullWidth
                    size="small"
                  >
                    {warehouses.map(wh => (
                      <MenuItem key={`from-${wh.warehouse_id}`} value={wh.warehouse_id}>
                        {wh.warehouse_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    select
                    name="to_warehouse_id"
                    label="To Warehouse (Destination) *"
                    value={formData.to_warehouse_id}
                    onChange={handleChange}
                    error={!!errors.to_warehouse_id}
                    helperText={errors.to_warehouse_id}
                    fullWidth
                    size="small"
                  >
                    {warehouses.map(wh => (
                      <MenuItem key={`to-${wh.warehouse_id}`} value={wh.warehouse_id}>
                        {wh.warehouse_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="product_id"
                    label="Product ID *"
                    type="number"
                    value={formData.product_id}
                    onChange={handleChange}
                    error={!!errors.product_id}
                    helperText={errors.product_id}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="quantity"
                    label="Quantity *"
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
                    label="Transfer Notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleTransfer}
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Execute Transfer'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Transfer History */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Transfers
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Source WH</TableCell>
                      <TableCell>Product ID</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransfers.slice(0, 10).map((row) => (
                      <TableRow key={row.movement_id} hover>
                        <TableCell>WH-{row.warehouse_id}</TableCell>
                        <TableCell>PROD-{row.product_id}</TableCell>
                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          -{row.quantity}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(row.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentTransfers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No recent transfers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transfers;
