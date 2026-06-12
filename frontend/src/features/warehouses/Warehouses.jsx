import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import warehouseService from '../../services/warehouseService';
import WarehouseDialog from './WarehouseDialog';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchWarehouses = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await warehouseService.getAll();
      setWarehouses(response.data);
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to fetch warehouses', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (warehouse = null) => {
    setSelectedWarehouse(warehouse);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWarehouse(null);
  };

  const handleSaveWarehouse = async (formData) => {
    try {
      if (selectedWarehouse) {
        // Edit
        await warehouseService.update(selectedWarehouse.warehouse_id, formData);
        showSnackbar('Warehouse updated successfully');
      } else {
        // Create
        await warehouseService.create(formData);
        showSnackbar('Warehouse created successfully');
      }
      handleCloseDialog();
      fetchWarehouses();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred';
      showSnackbar(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse? All associated stock and movements will also be deleted.')) {
      try {
        await warehouseService.delete(id);
        showSnackbar('Warehouse deleted successfully');
        fetchWarehouses();
      } catch (err) {
        showSnackbar(err.response?.data?.message || 'Failed to delete warehouse', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Warehouses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Warehouse
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses.map((wh) => (
                <TableRow key={wh.warehouse_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{wh.warehouse_code}</TableCell>
                  <TableCell>{wh.warehouse_name}</TableCell>
                  <TableCell>{wh.location}</TableCell>
                  <TableCell>{wh.manager_name || '-'}</TableCell>
                  <TableCell>{wh.capacity ? wh.capacity.toLocaleString() : 'Unlimited'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={wh.status} 
                      size="small" 
                      color={
                        wh.status === 'active' ? 'success' : 
                        wh.status === 'maintenance' ? 'warning' : 'error'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(wh)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(wh.warehouse_id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {warehouses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No warehouses found. Click "Add Warehouse" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <WarehouseDialog
        open={dialogOpen}
        warehouse={selectedWarehouse}
        onClose={handleCloseDialog}
        onSave={handleSaveWarehouse}
      />

      {/* Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Warehouses;
