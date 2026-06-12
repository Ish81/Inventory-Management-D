import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';

// Demo Data Initial State
const INITIAL_POS = [
  { id: 1, poNumber: 'PO-2023-001', supplier: 'TechCorp Electronics', date: '2023-10-25', total: 12500.00, status: 'Delivered' },
  { id: 2, poNumber: 'PO-2023-002', supplier: 'OfficeFurnish Inc.', date: '2023-10-26', total: 4300.50, status: 'In Transit' },
  { id: 3, poNumber: 'PO-2023-003', supplier: 'Global Textiles Ltd', date: '2023-10-27', total: 875.00, status: 'Processing' },
  { id: 4, poNumber: 'PO-2023-004', supplier: 'TechCorp Electronics', date: '2023-10-28', total: 5400.00, status: 'Pending Approval' },
  { id: 5, poNumber: 'PO-2023-005', supplier: 'FitGear Supplies', date: '2023-10-29', total: 2100.00, status: 'Delivered' },
];

const PurchaseOrders = () => {
  const [orders, setOrders] = useState(INITIAL_POS);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ supplier: '', total: '', status: 'Processing' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ supplier: '', total: '', status: 'Processing' });
  };

  const handleSave = () => {
    if (!formData.supplier || !formData.total) return;
    
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newPO = {
      id: newId,
      poNumber: `PO-2023-${String(newId).padStart(3, '0')}`,
      supplier: formData.supplier,
      date: new Date().toISOString().split('T')[0],
      total: parseFloat(formData.total),
      status: formData.status
    };
    
    setOrders([newPO, ...orders]);
    handleClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Transit': return 'info';
      case 'Processing': return 'warning';
      case 'Pending Approval': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Purchase Orders
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Create PO
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{order.poNumber}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{order.date}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small" 
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Supplier Name"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              fullWidth
              size="small"
              autoFocus
            />
            <TextField
              label="Total Amount"
              type="number"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              fullWidth
              size="small"
              InputProps={{ startAdornment: '$' }}
            />
            <TextField
              select
              label="Initial Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              fullWidth
              size="small"
            >
              <MenuItem value="Pending Approval">Pending Approval</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.supplier || !formData.total}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrders;
