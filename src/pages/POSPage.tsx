import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, TextField, InputAdornment, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Divider, Card, CardContent, Chip, Alert, Snackbar
} from '@mui/material';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Printer } from 'lucide-react';
import apiClient from '../api/apiClient';
import { Medicine } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CartItem extends Medicine {
  quantity: number;
}

const POSPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [notification, setNotification] = useState<{message: string, severity: 'success' | 'error'} | null>(null);

  useEffect(() => {
    apiClient.get('/medicines').then(res => setMedicines(res.data));
  }, []);

  const addToCart = (med: Medicine) => {
    const existing = cart.find(item => item.id === med.id);
    if (existing) {
      if (existing.quantity >= med.stock) {
        setNotification({ message: 'Insufficient stock', severity: 'error' });
        return;
      }
      setCart(cart.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          setNotification({ message: 'Insufficient stock', severity: 'error' });
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Daniyal Pharmacy Receipt', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Customer: ${customerName}`, 14, 25);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableData = cart.map(item => [
      item.name,
      item.quantity.toString(),
      `$${item.salePrice.toFixed(2)}`,
      `$${(item.salePrice * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Medicine', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: $${calculateTotal().toFixed(2)}`, 140, finalY);
    
    doc.save(`receipt_${Date.now()}.pdf`);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await apiClient.post('/sales', {
        customerName,
        totalAmount: calculateTotal(),
        items: cart.length
      });
      setNotification({ message: 'Sale completed successfully!', severity: 'success' });
      setCart([]);
      setCustomerName("Walk-in Customer");
    } catch (err) {
      setNotification({ message: 'Checkout failed', severity: 'error' });
    }
  };

  const filteredMedicines = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
      {/* Left side: Search and Selection */}
      <Grid size={{ xs: 12, md: 7 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Search medicine by name or scan barcode..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Paper>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Grid container spacing={2}>
            {filteredMedicines.map((med) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={med.id}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.2s' } }} onClick={() => addToCart(med)}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={med.category} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                      <Typography variant="caption" color={med.stock < 10 ? "error.main" : "text.secondary"}>
                        Stock: {med.stock}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{med.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>${med.salePrice.toFixed(2)}</Typography>
                      <IconButton size="small" color="primary" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Plus size={16} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>

      {/* Right side: Cart and Checkout */}
      <Grid size={{ xs: 12, md: 5 }} sx={{ height: '100%' }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ShoppingCart size={24} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Current Orders</Typography>
          </Box>

          <TextField
            fullWidth
            label="Customer Name"
            size="small"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">${item.salePrice.toFixed(2)}/unit</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ p: 0.5 }}>
                            <Minus size={14} />
                          </IconButton>
                          <Typography variant="body2" sx={{ fontWeight: 600, width: 20, textAlign: 'center' }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ p: 0.5 }}>
                            <Plus size={14} />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ${(item.salePrice * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cart.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Typography variant="body2" color="text.secondary">No items in order</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">${calculateTotal().toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Tax (0%)</Typography>
              <Typography variant="body2">$0.00</Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 6 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<Printer size={18} />} 
                disabled={cart.length === 0}
                onClick={generateReceipt}
              >
                Print Receipt
              </Button>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<CreditCard size={18} />} 
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Snackbar 
        open={Boolean(notification)} 
        autoHideDuration={4000} 
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification ? <Alert severity={notification.severity} variant="filled">{notification.message}</Alert> : undefined}
      </Snackbar>
    </Grid>
  );
};

export default POSPage;
