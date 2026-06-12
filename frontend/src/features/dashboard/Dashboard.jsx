import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Collapse,
  Tooltip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  Warning as WarningIcon,
  CompareArrows as TransferIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import warehouseService from '../../services/warehouseService';
import stockService from '../../services/stockService';
import WarehouseDialog from '../warehouses/WarehouseDialog';

/* ────────── KPI Card Component ────────── */
const KPICard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography color="text.secondary" variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            color: 'white',
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h3" fontWeight={700}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

/* ────────── Stock Sub-Row Component ────────── */
const WarehouseStockRow = ({ warehouseId, open }) => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (open && !fetched) {
      setLoading(true);
      stockService.getByWarehouse(warehouseId)
        .then(res => setStock(res.data))
        .catch(() => setStock([]))
        .finally(() => { setLoading(false); setFetched(true); });
    }
  }, [open, warehouseId, fetched]);

  return (
    <TableRow>
      <TableCell colSpan={8} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1, my: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1976d2' }}>
              Stock in this Warehouse
            </Typography>
            {loading ? (
              <CircularProgress size={20} />
            ) : stock.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No stock found.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell align="right">Reserved</TableCell>
                    <TableCell align="right">Reorder Level</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stock.map(item => (
                    <TableRow key={item.stock_id}>
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
                </TableBody>
              </Table>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

/* ────────── Main Dashboard ────────── */
const Dashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expanded row tracking
  const [expandedRow, setExpandedRow] = useState(null);

  // Dialog state for warehouse Create/Edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, whRes] = await Promise.all([
        dashboardService.getSummary(),
        warehouseService.getAll(),
      ]);
      setDashData(dashRes.data);
      setWarehouses(whRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* Warehouse CRUD handlers */
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
        await warehouseService.update(selectedWarehouse.warehouse_id, formData);
        showSnackbar('Warehouse updated successfully');
      } else {
        await warehouseService.create(formData);
        showSnackbar('Warehouse created successfully');
      }
      handleCloseDialog();
      fetchAll();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'An error occurred', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse? All associated stock and movements will also be deleted.')) {
      try {
        await warehouseService.delete(id);
        showSnackbar('Warehouse deleted successfully');
        fetchAll();
      } catch (err) {
        showSnackbar(err.response?.data?.message || 'Failed to delete warehouse', 'error');
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  /* ────────── RENDER ────────── */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" variant="h6">{error}</Typography>;
  }

  if (!dashData) return null;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Warehouse Dashboard
      </Typography>

      {/* ── KPI Cards ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Warehouses" value={dashData.warehouses?.total || 0} icon={<WarehouseIcon />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Products" value={dashData.stock_overview?.total_products || 0} icon={<InventoryIcon />} color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard title="Total Stock" value={dashData.stock_overview?.total_quantity || 0} icon={<TransferIcon />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Low Stock Alerts"
            value={dashData.low_stock_alerts?.count || 0}
            icon={<WarningIcon />}
            color={dashData.low_stock_alerts?.count > 0 ? 'error' : 'success'}
          />
        </Grid>
      </Grid>

      {/* ── Stock by Warehouse Chart + Recent Movements ── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', minHeight: 500 }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Stock by Warehouse
              </Typography>
              <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashData.stock_by_warehouse || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="warehouse_code" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="total_quantity" name="Total Quantity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Movements
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(dashData.recent_movements || []).slice(0, 7).map((row) => (
                      <TableRow key={row.movement_id}>
                        <TableCell>
                          <Chip
                            label={row.movement_type.replace('_', ' ')}
                            size="small"
                            color={row.movement_type.includes('IN') ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!dashData.recent_movements || dashData.recent_movements.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          No recent movements
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

      {/* ── Warehouse Management Table (CRUD) ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Warehouses
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Warehouse
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.05)', p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50} />
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
              <React.Fragment key={wh.warehouse_id}>
                <TableRow hover>
                  <TableCell>
                    <Tooltip title={expandedRow === wh.warehouse_id ? 'Hide stock' : 'View stock'}>
                      <IconButton size="small" onClick={() => toggleExpand(wh.warehouse_id)}>
                        {expandedRow === wh.warehouse_id ? <CollapseIcon /> : <ExpandIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(wh)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(wh.warehouse_id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <WarehouseStockRow warehouseId={wh.warehouse_id} open={expandedRow === wh.warehouse_id} />
              </React.Fragment>
            ))}
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No warehouses found. Click "Add Warehouse" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Warehouse Dialog */}
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

export default Dashboard;
