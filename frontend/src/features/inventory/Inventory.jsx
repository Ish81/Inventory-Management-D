import React, { useState, useEffect, useCallback } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
  TextField,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import stockService from '../../services/stockService';
import warehouseService from '../../services/warehouseService';
import movementService from '../../services/movementService';
import StockDialog from './StockDialog';

const Inventory = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);

  // Movement history
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementFilter, setMovementFilter] = useState('');
  const [movementPage, setMovementPage] = useState(0);
  const [movementRowsPerPage, setMovementRowsPerPage] = useState(10);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'remove'

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load warehouses on mount
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await warehouseService.getAll();
        setWarehouses(response.data);
        if (response.data.length > 0) {
          setSelectedWarehouseId(response.data[0].warehouse_id);
        }
      } catch (err) {
        showSnackbar('Failed to load warehouses', 'error');
      }
    };
    fetchWarehouses();
  }, []);

  // Load stock when warehouse changes
  const fetchStock = useCallback(async (warehouseId) => {
    setLoading(true);
    try {
      const response = await stockService.getByWarehouse(warehouseId);
      setStock(response.data);
    } catch (err) {
      showSnackbar('Failed to load stock', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedWarehouseId) {
      fetchStock(selectedWarehouseId);
    }
  }, [selectedWarehouseId, fetchStock]);

  // Load movement history
  const fetchMovements = useCallback(async () => {
    setMovementsLoading(true);
    try {
      const params = {};
      if (selectedWarehouseId) params.warehouse_id = selectedWarehouseId;
      if (movementFilter) params.movement_type = movementFilter;
      const response = await movementService.getAll(params);
      setMovements(response.data);
    } catch (err) {
      showSnackbar('Failed to load inventory logs', 'error');
    } finally {
      setMovementsLoading(false);
    }
  }, [selectedWarehouseId, movementFilter]);

  useEffect(() => {
    if (selectedWarehouseId) {
      fetchMovements();
    }
  }, [selectedWarehouseId, movementFilter, fetchMovements]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (mode) => {
    if (!selectedWarehouseId) {
      showSnackbar('Please select a warehouse first', 'warning');
      return;
    }
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const handleSaveStock = async (formData) => {
    try {
      if (dialogMode === 'add') {
        await stockService.addStock(formData);
        showSnackbar('Stock added successfully');
      } else {
        await stockService.removeStock(formData);
        showSnackbar('Stock removed successfully');
      }
      setDialogOpen(false);
      fetchStock(selectedWarehouseId);
      fetchMovements(); // Refresh logs after stock change
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to process stock', 'error');
    }
  };

  const getMovementChipColor = (type) => {
    if (type.includes('IN') || type === 'TRANSFER_IN') return 'success';
    if (type.includes('OUT') || type === 'TRANSFER_OUT') return 'error';
    return 'warning';
  };

  const handleChangeMovementPage = (event, newPage) => {
    setMovementPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setMovementRowsPerPage(parseInt(event.target.value, 10));
    setMovementPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Stock Movement
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RemoveIcon />}
            onClick={() => handleOpenDialog('remove')}
            disabled={!selectedWarehouseId}
          >
            Stock Out
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            disabled={!selectedWarehouseId}
          >
            Stock In
          </Button>
        </Box>
      </Box>

      {/* Filter / Selector */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)', backgroundImage: 'none' }}>
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <InputLabel>Select Warehouse</InputLabel>
          <Select
            value={selectedWarehouseId}
            label="Select Warehouse"
            onChange={(e) => setSelectedWarehouseId(e.target.value)}
          >
            {warehouses.map((wh) => (
              <MenuItem key={wh.warehouse_id} value={wh.warehouse_id}>
                {wh.warehouse_name} ({wh.warehouse_code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Stock Table */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Current Stock
      </Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.05)', mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell align="right">Available Quantity</TableCell>
                <TableCell align="right">Reserved Quantity</TableCell>
                <TableCell align="right">Reorder Level</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock.map((item) => (
                <TableRow key={item.stock_id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>PROD-{item.product_id}</TableCell>
                  <TableCell align="right">{item.quantity_available.toLocaleString()}</TableCell>
                  <TableCell align="right">{item.quantity_reserved.toLocaleString()}</TableCell>
                  <TableCell align="right">{item.reorder_level}</TableCell>
                  <TableCell>
                    {item.quantity_available <= item.reorder_level ? (
                      <Chip label="Low Stock" size="small" color="error" variant="outlined" />
                    ) : (
                      <Chip label="In Stock" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {stock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {selectedWarehouseId
                      ? "No stock found in this warehouse. Click 'Stock In' to add some."
                      : "Please select a warehouse to view its stock."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* ── Inventory Movement Logs ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" /> Inventory Logs
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={movementFilter}
            label="Filter by Type"
            onChange={(e) => { setMovementFilter(e.target.value); setMovementPage(0); }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="STOCK_IN">Stock In</MenuItem>
            <MenuItem value="STOCK_OUT">Stock Out</MenuItem>
            <MenuItem value="TRANSFER_IN">Transfer In</MenuItem>
            <MenuItem value="TRANSFER_OUT">Transfer Out</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        {movementsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Date & Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements
                  .slice(movementPage * movementRowsPerPage, movementPage * movementRowsPerPage + movementRowsPerPage)
                  .map((row) => (
                  <TableRow key={row.movement_id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{row.movement_id}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.movement_type.replace(/_/g, ' ')}
                        size="small"
                        color={getMovementChipColor(row.movement_type)}
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>PROD-{row.product_id}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{row.quantity}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.notes || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {movements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No inventory movements found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {movements.length > 0 && (
              <TablePagination
                component="div"
                count={movements.length}
                page={movementPage}
                onPageChange={handleChangeMovementPage}
                rowsPerPage={movementRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            )}
          </>
        )}
      </TableContainer>

      {/* Dialog */}
      <StockDialog
        open={dialogOpen}
        mode={dialogMode}
        warehouseId={selectedWarehouseId}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveStock}
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

export default Inventory;
