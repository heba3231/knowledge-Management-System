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
import UpdateWorkshop from './Pages/UpdateWorkshop';
import Updates from './Pages/Updates';
import AddUpdate from './Pages/AddUpdate';
import Categories from './Pages/Categories';
import AddCategory from './Pages/AddCategory';
import Users from './Pages/Users';
import Search from './Pages/Search';
import AnalyticsDashboard from './Pages/AnalyticsDashboard';

// استيراد الصفحات الجديدة للإدارة
import ManageNews from './Pages/ManageNews';
import AddNews from './Pages/AddNews';
import EditNews from './Pages/EditNews';
import ManageEvents from './Pages/ManageEvents';
import AddEvent from './Pages/AddEvent';
import EditEvent from './Pages/EditEvent';
import ManageContributions from './Pages/ManageContributions';
import AddContribution from './Pages/AddContribution';
import EditContribution from './Pages/EditContribution';
import ManageServices from './Pages/ManageServices';
import AddService from './Pages/AddService';
import EditService from './Pages/EditService';

// ✅ استيراد صفحات Policy و Protocol من المسار الصحيح (components/pages)
import ManagePolicy from './Pages/ManagePolicy';
import ManageProtocol from './Pages/ManageProtocol';
import AddPolicy from './Pages/AddPolicy';
import EditPolicy from './Pages/EditPolicy';
import AddProtocol from './Pages/AddProtocol';
import EditProtocol from './Pages/EditProtocol';

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

            {/* صفحات التصفح العامة */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:id" element={<WorkshopDetails />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/search" element={<Search />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />

            {/* صفحات الإدارة العامة */}
            <Route path="/documents/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddDocument /></RoleBasedRoute>} />
            <Route path="/workshops/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddWorkshop /></RoleBasedRoute>} />
            <Route path="/workshops/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><UpdateWorkshop /></RoleBasedRoute>} />
            <Route path="/updates/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddUpdate /></RoleBasedRoute>} />
            <Route path="/categories" element={<RoleBasedRoute allowedRoles={['Admin']}><Categories /></RoleBasedRoute>} />
            <Route path="/categories/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddCategory /></RoleBasedRoute>} />
            <Route path="/users" element={<RoleBasedRoute allowedRoles={['Admin']}><Users /></RoleBasedRoute>} />

            {/* مسارات إدارة الأخبار */}
            <Route path="/admin/news" element={<RoleBasedRoute allowedRoles={['Admin']}><ManageNews /></RoleBasedRoute>} />
            <Route path="/admin/news/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddNews /></RoleBasedRoute>} />
            <Route path="/admin/news/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditNews /></RoleBasedRoute>} />

            {/* مسارات إدارة الفعاليات */}
            <Route path="/admin/events" element={<RoleBasedRoute allowedRoles={['Admin']}><ManageEvents /></RoleBasedRoute>} />
            <Route path="/admin/events/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddEvent /></RoleBasedRoute>} />
            <Route path="/admin/events/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditEvent /></RoleBasedRoute>} />

            {/* مسارات إدارة المبادرات */}
            <Route path="/admin/contributions" element={<RoleBasedRoute allowedRoles={['Admin']}><ManageContributions /></RoleBasedRoute>} />
            <Route path="/admin/contributions/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddContribution /></RoleBasedRoute>} />
            <Route path="/admin/contributions/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditContribution /></RoleBasedRoute>} />

            {/* مسارات إدارة الخدمات */}
            <Route path="/admin/services" element={<RoleBasedRoute allowedRoles={['Admin']}><ManageServices /></RoleBasedRoute>} />
            <Route path="/admin/services/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddService /></RoleBasedRoute>} />
            <Route path="/admin/services/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditService /></RoleBasedRoute>} />

            {/* ✅ مسارات إدارة السياسات */}
            <Route path="/admin/policy" element={<RoleBasedRoute allowedRoles={['Admin']}><ManagePolicy /></RoleBasedRoute>} />
            <Route path="/admin/policy/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddPolicy /></RoleBasedRoute>} />
            <Route path="/admin/policy/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditPolicy /></RoleBasedRoute>} />

            {/* ✅ مسارات إدارة البروتوكولات */}
            <Route path="/admin/protocol" element={<RoleBasedRoute allowedRoles={['Admin']}><ManageProtocol /></RoleBasedRoute>} />
            <Route path="/admin/protocol/add" element={<RoleBasedRoute allowedRoles={['Admin']}><AddProtocol /></RoleBasedRoute>} />
            <Route path="/admin/protocol/edit/:id" element={<RoleBasedRoute allowedRoles={['Admin']}><EditProtocol /></RoleBasedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;