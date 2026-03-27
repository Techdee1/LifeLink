import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Onboard from "./pages/Onboard";
import Dashboard from "./pages/Dashboard";
import ActiveCases from "./pages/ActiveCases";
import History from "./pages/History";
import CasePage from "./pages/CasePage";
import Settings from "./pages/Settings";
import ChatWidget from "./components/ChatWidget";
import MobileTabBar from "./components/MobileTabBar";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AuthenticatedChatWidget() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <ChatWidget /> : null;
}

function AuthenticatedMobileTabBar() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <MobileTabBar /> : null;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/onboard" element={<Onboard />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/cases"
                    element={
                        <ProtectedRoute>
                            <ActiveCases />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                <Route path="/case/:caseId" element={<CasePage />} />
            </Routes>
            <AuthenticatedMobileTabBar />
            <AuthenticatedChatWidget />
        </AuthProvider>
    );
}

export default App;
