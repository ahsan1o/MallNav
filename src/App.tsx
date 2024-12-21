import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ShopList } from './pages/ShopList';
import { ShopDetails } from './pages/ShopDetails';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { MallSelection } from './pages/MallSelection';
import { MallMap } from './pages/MallMap';
import { Deals } from './pages/Deals';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LocationManager } from './pages/admin/LocationManager';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <AuthGuard adminOnly>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="location" element={<LocationManager />} />
                </Routes>
              </AuthGuard>
            }
          />

          {/* User routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mall-selection" element={<MallSelection />} />
            <Route path="mall-map" element={<MallMap />} />
            <Route path="deals" element={<Deals />} />
            <Route path="shops" element={<ShopList />} />
            <Route path="shops/:id" element={<ShopDetails />} />
            <Route
              path="profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="notifications"
              element={
                <AuthGuard>
                  <Notifications />
                </AuthGuard>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}