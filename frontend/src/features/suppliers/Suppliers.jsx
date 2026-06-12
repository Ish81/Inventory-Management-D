import React from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';

// Demo Data
const DEMO_SUPPLIERS = [
  { id: 1, name: 'TechCorp Electronics', contact: 'Alice Smith', email: 'alice@techcorp.com', phone: '+1 555-0101', status: 'Active' },
  { id: 2, name: 'OfficeFurnish Inc.', contact: 'Bob Johnson', email: 'bjohnson@officefurnish.com', phone: '+1 555-0102', status: 'Active' },
  { id: 3, name: 'Global Textiles Ltd', contact: 'Charlie Brown', email: 'charlie.b@globaltextiles.com', phone: '+1 555-0103', status: 'Inactive' },
  { id: 4, name: 'FitGear Supplies', contact: 'Diana Prince', email: 'diana@fitgear.com', phone: '+1 555-0104', status: 'Active' },
];

const Suppliers = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Suppliers
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Supplier
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DEMO_SUPPLIERS.map((supplier) => (
              <TableRow key={supplier.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.9rem' }}>
                      {supplier.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {supplier.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{supplier.email}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{supplier.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={supplier.status} 
                    size="small" 
                    color={supplier.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Suppliers;
