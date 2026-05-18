import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import { Box } from '@mui/material';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardHome from './pages/DashboardHome';
import MedicinesPage from './pages/MedicinesPage';
import POSPage from './pages/POSPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/medicines" element={<MedicinesPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/inventory" element={<MedicinesPage />} /> {/* Reusing for demo */}
              <Route path="/purchases" element={<Box sx={{ p: 4 }}>Purchases Module - Coming Soon</Box>} />
              <Route path="/suppliers" element={<Box sx={{ p: 4 }}>Suppliers Module - Coming Soon</Box>} />
              <Route path="/customers" element={<Box sx={{ p: 4 }}>Customers Module - Coming Soon</Box>} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/employees" element={<ProtectedRoute requiredRole="SUPER_ADMIN"><Box sx={{ p: 4 }}>Employees Module - Coming Soon</Box></ProtectedRoute>} />
              <Route path="/settings" element={<Box sx={{ p: 4 }}>Settings Module - Coming Soon</Box>} />
              <Route path="/profile" element={<Box sx={{ p: 4 }}>User Profile - Coming Soon</Box>} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
              <p>Page Not Found</p>
              <button onClick={() => window.location.href = '/'}>Go Home</button>
            </Box>} />
          </Routes>
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  );
}
