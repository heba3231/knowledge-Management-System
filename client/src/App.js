// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import AdminLogin from './auth/AdminLogin';
import Dashboard from './Pages/Dashboard';
import DocumentLibrary from './Pages/DocumentLibrary';
import DocumentDetails from './Pages/DocumentDetails';
import AddDocument from './Pages/AddDocument';
import Workshops from './Pages/Workshops';
import AddWorkshop from './Pages/AddWorkshop';
import WorkshopDetails from './Pages/WorkshopDetails';
import UpdateWorkshop from './Pages/UpdateWorkshop'; // ✅ استيراد مكون التعديل
import Updates from './Pages/Updates';
import AddUpdate from './Pages/AddUpdate';
import Categories from './Pages/Categories';
import AddCategory from './Pages/AddCategory';
import Users from './Pages/Users';
import Search from './Pages/Search';
import AnalyticsDashboard from './Pages/AnalyticsDashboard';

import RoleBasedRoute from './protection/RoleBasedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* الصفحات العامة */}
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* صفحات التصفح العامة (لا تحتاج تسجيل دخول) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:id" element={<WorkshopDetails />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/search" element={<Search />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />

            {/* صفحات الإدارة (للأدمن فقط) */}
            <Route path="/documents/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddDocument /></RoleBasedRoute>} />
            <Route path="/workshops/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddWorkshop /></RoleBasedRoute>} />
            {/* ✅ مسار تعديل الورشة */}
            <Route path="/workshops/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><UpdateWorkshop /></RoleBasedRoute>} />
            <Route path="/updates/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddUpdate /></RoleBasedRoute>} />
            <Route path="/categories" element={<RoleBasedRoute allowedRoles={['Admin']}><Categories /></RoleBasedRoute>} />
            <Route path="/categories/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddCategory /></RoleBasedRoute>} />
            <Route path="/users" element={<RoleBasedRoute allowedRoles={['Admin']}><Users /></RoleBasedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;