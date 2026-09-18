import { Routes, Route } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { AdminLayout } from "./layouts/AdminLayout";

import Home from "./pages/site/Home";
import Products from "./pages/site/Products";
import ProductDetail from "./pages/site/ProductDetail";
import Collections from "./pages/site/Collections";
import About from "./pages/site/About";
import BulkOrder from "./pages/site/BulkOrder";
import Contact from "./pages/site/Contact";
import NotFound from "./pages/site/NotFound";

import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductForm from "./pages/admin/ProductForm";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import BulkOrdersAdmin from "./pages/admin/BulkOrdersAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/bulk-orders" element={<BulkOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="bulk-orders" element={<BulkOrdersAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
