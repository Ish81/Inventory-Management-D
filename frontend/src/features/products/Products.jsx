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
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Demo Data
const DEMO_PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', sku: 'AUDIO-HP-001', category: 'Electronics', price: 299.99, status: 'Active' },
  { id: 2, name: 'Ergonomic Office Chair', sku: 'FURN-CHR-002', category: 'Furniture', price: 199.50, status: 'Active' },
  { id: 3, name: 'Mechanical Gaming Keyboard', sku: 'ELEC-KB-003', category: 'Electronics', price: 129.99, status: 'Active' },
  { id: 4, name: 'Organic Cotton T-Shirt', sku: 'APP-TSH-004', category: 'Apparel', price: 24.99, status: 'Inactive' },
  { id: 5, name: 'Stainless Steel Water Bottle', sku: 'HOME-WB-005', category: 'Home Goods', price: 34.00, status: 'Active' },
  { id: 6, name: '4K Ultra HD Smart TV', sku: 'ELEC-TV-006', category: 'Electronics', price: 799.00, status: 'Active' },
  { id: 7, name: 'Standing Desk Converter', sku: 'FURN-DSK-007', category: 'Furniture', price: 149.00, status: 'Active' },
  { id: 8, name: 'Yoga Mat with Alignment Lines', sku: 'FIT-YOG-008', category: 'Fitness', price: 45.00, status: 'Active' },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = DEMO_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products Catalog
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }} elevation={0}>
        <TextField
          size="small"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                      {product.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{product.sku}</TableCell>
                <TableCell>
                  <Chip label={product.category} size="small" sx={{ bgcolor: 'background.default' }} />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.status} 
                    size="small" 
                    color={product.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;
