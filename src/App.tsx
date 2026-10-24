import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { SiteLayout } from "./layouts/SiteLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Loader2 } from "lucide-react";

// Critical landing page kept eager for instant LCP
import Home from "./pages/site/Home";

// Customer-facing secondary pages code-split
const Products = lazy(() => import("./pages/site/Products"));
const ProductDetail = lazy(() => import("./pages/site/ProductDetail"));
const Collections = lazy(() => import("./pages/site/Collections"));
const About = lazy(() => import("./pages/site/About"));
const BulkOrder = lazy(() => import("./pages/site/BulkOrder"));
const Contact = lazy(() => import("./pages/site/Contact"));
import NotFound from "./pages/site/NotFound";

// Admin pages and heavy admin dependencies (Recharts, etc.) code-split
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsAdmin = lazy(() => import("./pages/admin/ProductsAdmin"));
const ProductForm = lazy(() => import("./pages/admin/ProductForm"));
const CategoriesAdmin = lazy(() => import("./pages/admin/CategoriesAdmin"));
const BulkOrdersAdmin = lazy(() => import("./pages/admin/BulkOrdersAdmin"));
const MessagesAdmin = lazy(() => import("./pages/admin/MessagesAdmin"));
const NewlyAddedAdmin = lazy(() => import("./pages/admin/NewlyAddedAdmin"));
const HeroBannersAdmin = lazy(() => import("./pages/admin/HeroBannersAdmin"));

function PageLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-copper-600">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-xs font-medium uppercase tracking-widest text-stone-500">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Custom Secured Admin Routes */}
          <Route path="/admin/:mobileNumber/login" element={<AdminLogin />} />
          <Route path="/admin/:mobileNumber" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="hero-banners" element={<HeroBannersAdmin />} />
            <Route path="newlyadded" element={<NewlyAddedAdmin />} />
            <Route path="bulk-orders" element={<BulkOrdersAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>

          {/* Site Layout Pages */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/bulk-orders" element={<BulkOrder />} />
            <Route path="/contact" element={<Contact />} />
            {/* Generic /admin routes and unmatched paths return 404 Page Not Found */}
            <Route path="/admin" element={<NotFound />} />
            <Route path="/admin/*" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
