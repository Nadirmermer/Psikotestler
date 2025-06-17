// src/App.tsx

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ClientsPage } from "./pages/ClientsPage";
import { ClientDetailPage } from "./pages/ClientDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Scid5CvPage } from "./pages/Scid5CvPage";
import { TestReportPage } from "./pages/TestReportPage"; 

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Test sayfasının AppLayout dışında, tam ekran olması için ayrı bir rotaya koyuyoruz */}
        <Route 
          path="/clients/:clientId/scid/cv/:sessionId"
          element={
            <ProtectedRoute>
              <Scid5CvPage />
            </ProtectedRoute>
          }
        />
        
        {/* Test raporu sayfası */}
        <Route 
          path="/clients/:clientId/scid/cv/:sessionId/report"
          element={
            <ProtectedRoute>
              <TestReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;