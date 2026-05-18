import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, TextField, 
  InputAdornment, Chip, Avatar, Dialog, DialogTitle, DialogContent, 
  DialogActions, Grid, MenuItem, Skeleton, Alert, Snackbar, Tooltip 
} from '@mui/material';
import { 
  Plus, Search, Edit2, Trash2, MoreVertical, Filter, 
  Download, Image as ImageIcon, AlertCircle 
} from 'lucide-react';
import apiClient from '../api/apiClient';
import { Medicine } from '../types';
import { useForm } from 'react-hook-form';

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{message: string, severity: 'success' | 'error'} | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Partial<Medicine>>();

  const fetchMedicines = async () => {
    try {
      const res = await apiClient.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleOpen = (medicine?: Medicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      Object.keys(medicine).forEach(key => {
        setValue(key as any, (medicine as any)[key]);
      });
    } else {
      setEditingMedicine(null);
      reset({});
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: any) => {
    try {
      if (editingMedicine) {
        await apiClient.put(`/medicines/${editingMedicine.id}`, data);
        setNotification({ message: 'Medicine updated successfully', severity: 'success' });
      } else {
        await apiClient.post('/medicines', data);
        setNotification({ message: 'Medicine added successfully', severity: 'success' });
      }
      fetchMedicines();
      handleClose();
    } catch (err) {
      setNotification({ message: 'Action failed', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await apiClient.delete(`/medicines/${id}`);
        setNotification({ message: 'Medicine deleted successfully', severity: 'success' });
        fetchMedicines();
      } catch (err) {
        setNotification({ message: 'Delete failed', severity: 'error' });
      }
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Medicine Management</Typography>
          <Typography variant="body2" color="text.secondary">Add, edit, or remove medicines from inventory</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download size={18} />}>Export</Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpen()}>
            Add Medicine
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 2 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          size="small" 
          placeholder="Search by name or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 400 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="outlined" startIcon={<Filter size={18} />} size="small">Filters</Button>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Medicine Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sale Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Expiry</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton height={40}/></TableCell></TableRow>
              ))
            ) : filteredMedicines.map((medicine) => (
              <TableRow key={medicine.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar variant="rounded" src={medicine.image} sx={{ bgcolor: 'primary.light' }}>
                      <ImageIcon size={20} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{medicine.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Batch: {medicine.batch}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell><Chip label={medicine.category} size="small" variant="outlined" /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{medicine.stock}</Typography>
                    {medicine.stock < 100 && (
                      <Tooltip title="Low Stock">
                        <AlertCircle size={16} color="#ef4444" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>${medicine.salePrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{new Date(medicine.expiry).toLocaleDateString()}</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(medicine)} color="primary">
                    <Edit2 size={18} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(medicine.id)} color="error">
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Medicine Name" {...register('name')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Category" {...register('category')} select defaultValue="Analgesics">
                  <MenuItem value="Analgesics">Analgesics</MenuItem>
                  <MenuItem value="Antibiotics">Antibiotics</MenuItem>
                  <MenuItem value="Antipyretics">Antipyretics</MenuItem>
                  <MenuItem value="Antiseptics">Antiseptics</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Batch Number" {...register('batch')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Stock Quantity" type="number" {...register('stock')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  fullWidth 
                  label="Purchase Price" 
                  type="number" 
                  {...register('purchasePrice')} 
                  slotProps={{ htmlInput: { step: "0.01" } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField 
                  fullWidth 
                  label="Sale Price" 
                  type="number" 
                  {...register('salePrice')} 
                  slotProps={{ htmlInput: { step: "0.01" } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField 
                  fullWidth 
                  label="Expiry Date" 
                  type="date" 
                  slotProps={{ inputLabel: { shrink: true } }} 
                  {...register('expiry')} 
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={Boolean(notification)} 
        autoHideDuration={4000} 
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification ? <Alert severity={notification.severity} variant="filled">{notification.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default MedicinesPage;
