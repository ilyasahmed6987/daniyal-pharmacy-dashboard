import React, { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Divider, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { 
  TrendingUp, Pill, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import apiClient from '../api/apiClient';
import { DashboardSummary, Sale } from '../types';

const DashboardHome: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, salesRes] = await Promise.all([
          apiClient.get('/analytics/summary'),
          apiClient.get('/sales')
        ]);
        setData(summaryRes.data);
        setRecentSales(salesRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Today's Revenue", value: data?.todayRevenue ? `$${data.todayRevenue.toFixed(2)}` : "$0.00", icon: <DollarSign size={18} />, trend: "+12.5%", color: "#0d9488" },
    { title: "Medicines", value: data?.totalMedicines || 0, icon: <Pill size={18} />, trend: "+24 today", color: "#3b82f6" },
    { title: "Low Stock", value: `${data?.lowStock || 0} Items`, icon: <AlertTriangle size={18} />, trend: "Requires Action", color: "#f59e0b" },
    { title: "Total Sales", value: data?.totalSales ? `$${(data.totalSales / 1000).toFixed(1)}k` : "$0", icon: <TrendingUp size={18} />, trend: "+5.4%", color: "#6366f1" },
  ];

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1.5 }} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 1.5 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 1.5 }} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>Dashboard Overview</Typography>
        <Typography variant="body2" color="text.secondary">Real-time pharmacy analytics and performance tracking.</Typography>
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                  <Box sx={{ p: 1, borderRadius: 1.25, bgcolor: `${stat.color}10`, color: stat.color, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{stat.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: stat.trend.includes('Requires') ? '#ef4444' : stat.color, fontWeight: 700 }}>{stat.trend}</Typography>
                  <Typography variant="caption" color="text.secondary">from last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2.5, height: '350px', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Sales Analytics</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Weekly" size="small" sx={{ height: 24, fontSize: '10px', fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} />
                <Chip label="Monthly" size="small" variant="outlined" sx={{ height: 24, fontSize: '10px', fontWeight: 700 }} />
              </Box>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data?.chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2.5, height: '350px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Sales</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', cursor: 'pointer' }}>View All</Typography>
            </Box>
            <TableContainer sx={{ height: '260px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Customer</TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Amount</TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id} sx={{ '& td': { py: 1.5 } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{sale.customerName}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>{new Date(sale.date).toLocaleDateString()}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>${sale.totalAmount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ 
                          display: 'inline-flex', 
                          px: 1, 
                          py: 0.25, 
                          borderRadius: 10, 
                          bgcolor: 'success.main', 
                          color: 'white', 
                          fontSize: '9px', 
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {sale.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
