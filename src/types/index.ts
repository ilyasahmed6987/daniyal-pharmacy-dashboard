export interface User {
  id: number;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EMPLOYEE';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Medicine {
  id: number;
  name: string;
  category: string;
  batch: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  expiry: string;
  image?: string;
}

export interface Sale {
  id: number;
  customerName: string;
  totalAmount: number;
  items: number;
  date: string;
  status: string;
}

export interface DashboardSummary {
  totalSales: number;
  totalMedicines: number;
  lowStock: number;
  todayRevenue: number;
  chartData: { name: string; revenue: number; profit: number }[];
}
