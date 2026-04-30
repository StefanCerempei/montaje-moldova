import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, parola);
        setLoading(false);

        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            if (result.user.type === 'client') {
                navigate('/client-dashboard');
            } else {
                navigate('/installer-dashboard');
            }
        } else {
            setError('Email sau parolă incorectă');
        }
    };

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">🏠 Montaje Moldova</h1>
                    <button onClick={() => navigate('/')} className="btn btn-secondary">
                        ← Acasă
                    </button>
                </div>
            </header>

            <div className="form-container">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>
                    🔑 Autentificare
                </h2>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Parola"
                            value={parola}
                            onChange={(e) => setParola(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
                        {loading ? 'Se verifică...' : 'Intră în cont'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Nu ai cont? <a href="/register" style={{ color: '#10b981' }}>Înregistrează-te</a>
                </p>
            </div>
        </div>
    );
}

export default Login;