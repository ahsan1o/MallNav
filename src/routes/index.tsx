import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AuthGuard } from '../components/AuthGuard';

// Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { SignUp } from '../pages/auth/SignUp';
import { Profile } from '../pages/Profile';
import { ShopList } from '../pages/ShopList';
import { ShopDetails } from '../pages/ShopDetails';
import { MallMap } from '../pages/MallMap';
import { MallSelection } from '../pages/MallSelection';
import { Deals } from '../pages/Deals';
import { Notifications } from '../pages/Notifications';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { LocationManager } from '../pages/admin/LocationManager';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route path="/admin" element={<AuthGuard adminOnly><AdminDashboard /></AuthGuard>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="location" element={<LocationManager />} />
      </Route>

      {/* Protected user routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mall-selection" element={
          <AuthGuard>
            <MallSelection />
          </AuthGuard>
        } />
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
        <Route path="/notifications" element={
          <AuthGuard>
            <Notifications />
          </AuthGuard>
        } />
        <Route path="/shops" element={
          <AuthGuard>
            <ShopList />
          </AuthGuard>
        } />
        <Route path="/shops/:id" element={
          <AuthGuard>
            <ShopDetails />
          </AuthGuard>
        } />
        <Route path="/mall-map" element={
          <AuthGuard>
            <MallMap />
          </AuthGuard>
        } />
        <Route path="/deals" element={
          <AuthGuard>
            <Deals />
          </AuthGuard>
        } />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}