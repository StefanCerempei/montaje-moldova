import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import InstallerDashboard from './pages/InstallerDashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/installer-dashboard" element={<InstallerDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;