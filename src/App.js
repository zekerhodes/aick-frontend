import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AssetsList } from './pages/assets/AssetsList';
import { AddAsset } from './pages/assets/AddAsset';
import { AssetDetail } from './pages/assets/AssetDetail';
import { AssetAction } from './pages/assets/AssetAction';
import { ListsPage } from './pages/lists/ListsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { ToolsPage } from './pages/tools/ToolsPage';
import { AdvancedPage } from './pages/advanced/AdvancedPage';
import { ComingSoonModule } from './pages/future/ComingSoonModule';

function App() {
  useEffect(() => {
    document.title = 'AIC Kapsowar Hospital · Asset Management';
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Assets */}
            <Route path="assets" element={<AssetsList />} />
            <Route path="assets/new" element={<AddAsset />} />
            <Route path="assets/check-out" element={<AssetAction kind="check-out" />} />
            <Route path="assets/check-in" element={<AssetAction kind="check-in" />} />
            <Route path="assets/lease" element={<AssetAction kind="lease" />} />
            <Route path="assets/lease-return" element={<AssetAction kind="lease-return" />} />
            <Route path="assets/dispose" element={<AssetAction kind="dispose" />} />
            <Route path="assets/maintenance" element={<AssetAction kind="maintenance" />} />
            <Route path="assets/move" element={<AssetAction kind="move" />} />
            <Route path="assets/reserve" element={<AssetAction kind="reserve" />} />
            <Route path="assets/:id" element={<AssetDetail />} />

            {/* Lists */}
            <Route path="lists/:kind" element={<ListsPage />} />

            {/* Reports */}
            <Route path="reports/:kind" element={<ReportsPage />} />

            {/* Tools */}
            <Route path="tools/:kind" element={<ToolsPage />} />

            {/* Advanced */}
            <Route path="advanced/:kind" element={<AdvancedPage />} />

            {/* Future modules */}
            <Route path="pharmacy" element={<ComingSoonModule kind="pharmacy" />} />
            <Route path="pharmacy/*" element={<ComingSoonModule kind="pharmacy" />} />
            <Route path="inventory" element={<ComingSoonModule kind="inventory" />} />
            <Route path="inventory/*" element={<ComingSoonModule kind="inventory" />} />
          </Route>

          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
