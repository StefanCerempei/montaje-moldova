import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

function Register() {
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    if (!type) {
        return (
            <div>
                <header className="header">
                    <div className="header-content">
                        <h1 className="logo">🏠 Montaje Moldova</h1>
                        <button onClick={() => navigate('/')} className="btn btn-secondary">
                            ← Înapoi
                        </button>
                    </div>
                </header>

                <div className="hero" style={{ paddingTop: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Alege tipul de cont</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setType('client')}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                        >
                            📱 Client
                        </button>
                        <button
                            onClick={() => setType('montator')}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: '#3b82f6' }}
                        >
                            🔧 Montator
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        const result = await register({ ...data, type });
        setLoading(false);

        if (result.success) {
            alert('✅ Înregistrare reușită! Te poți loga.');
            navigate('/login');
        } else {
            setError(result.error || 'Eroare la înregistrare');
        }
    };

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">🏠 Montaje Moldova</h1>
                    <button onClick={() => setType(null)} className="btn btn-secondary">
                        ← Înapoi
                    </button>
                </div>
            </header>

            <div className="form-container">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>
                    {type === 'client' ? '📱 Înregistrare Client' : '🔧 Înregistrare Montator'}
                </h2>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input name="nume" placeholder="Nume" required className="input-field" />
                    </div>

                    <div className="form-group">
                        <input name="prenume" placeholder="Prenume" required className="input-field" />
                    </div>

                    <div className="form-group">
                        <input name="telefon" placeholder="Telefon" required className="input-field" />
                    </div>

                    <div className="form-group">
                        <input name="email" type="email" placeholder="Email" required className="input-field" />
                    </div>

                    <div className="form-group">
                        <input name="parola" type="password" placeholder="Parola" required className="input-field" />
                    </div>

                    {type === 'client' && (
                        <div className="form-group">
                            <textarea name="adresa" placeholder="Adresa completă" rows="3" required className="input-field"></textarea>
                        </div>
                    )}

                    {type === 'montator' && (
                        <div className="form-group">
                            <input name="idnp" placeholder="IDNP (13 cifre)" required className="input-field" />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
                        {loading ? 'Se procesează...' : 'Înregistrează-te'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Ai deja cont? <a href="/login" style={{ color: '#10b981' }}>Loghează-te</a>
                </p>
            </div>
        </div>
    );
}

export default Register;