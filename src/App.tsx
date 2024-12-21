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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
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