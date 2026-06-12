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
const INITIAL_SOS = [
  { id: 1, soNumber: 'SO-2023-1001', customer: 'Acme Corp', date: '2023-10-28', total: 4500.00, status: 'Shipped' },
  { id: 2, soNumber: 'SO-2023-1002', customer: 'Globex Inc', date: '2023-10-29', total: 1200.50, status: 'Processing' },
  { id: 3, soNumber: 'SO-2023-1003', customer: 'Stark Industries', date: '2023-10-29', total: 8900.00, status: 'Pending' },
  { id: 4, soNumber: 'SO-2023-1004', customer: 'Wayne Enterprises', date: '2023-10-30', total: 320.00, status: 'Delivered' },
];

const SalesOrders = () => {
  const [orders, setOrders] = useState(INITIAL_SOS);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ customer: '', total: '', status: 'Pending' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ customer: '', total: '', status: 'Pending' });
  };

  const handleSave = () => {
    if (!formData.customer || !formData.total) return;
    
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newSO = {
      id: newId,
      soNumber: `SO-2023-${String(1000 + newId)}`,
      customer: formData.customer,
      date: new Date().toISOString().split('T')[0],
      total: parseFloat(formData.total),
      status: formData.status
    };
    
    setOrders([newSO, ...orders]);
    handleClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Processing': return 'warning';
      case 'Pending': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Sales Orders
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Create SO
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SO Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{order.soNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
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
        <DialogTitle>Create Sales Order</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Customer Name"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
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
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.customer || !formData.total}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrders;
