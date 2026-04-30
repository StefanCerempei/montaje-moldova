import { useNavigate } from 'react-router-dom';
import RealMap from '../components/RealMap';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1 className="logo">🏠 Montaje Moldova</h1>
                    <div className="nav-buttons">
                        <button onClick={() => navigate('/register')} className="btn btn-secondary">
                            📝 Înregistrare
                        </button>
                        <button onClick={() => navigate('/login')} className="btn btn-primary">
                            🔑 Logare
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h1>Bine ai venit la<br/>Montaje Moldova!</h1>
                <p>Servicii profesionale de montaj în toată țara</p>
                <button
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn btn-primary btn-hero"
                >
                    Află mai multe →
                </button>
            </section>

            {/* About Section */}
            <section id="about" className="section">
                <h2 className="section-title">Despre noi</h2>
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#4b5563' }}>
                        Suntem o echipă profesionistă de montaj cu 10+ ani de experiență în toată Moldova.
                        Oferim servicii rapide, sigure și la prețuri competitive.
                        Acoperim 100% din teritoriul Republicii Moldova.
                    </p>
                </div>
            </section>

            {/* Map Section */}
            <section className="section" style={{ background: '#f8fafc' }}>
                <h2 className="section-title">Operăm în toată Moldova</h2>
                <RealMap />
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                        📍 Acoperim toate orașele Republicii Moldova
                    </p>
                    <div className="cities-list">
                        <span className="city-badge">📍 Chișinău</span>
                        <span className="city-badge">📍 Bălți</span>
                        <span className="city-badge">📍 Cahul</span>
                        <span className="city-badge">📍 Ungheni</span>
                        <span className="city-badge">📍 Comrat</span>
                        <span className="city-badge">📍 Soroca</span>
                        <span className="city-badge">📍 Orhei</span>
                        <span className="city-badge">📍 Toată țara</span>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="section">
                <h2 className="section-title">Statistici</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <div className="card" style={{ textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '2rem', color: '#10b981' }}>🏠</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>500+</div>
                        <div style={{ color: '#666' }}>Proiecte finalizate</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '2rem', color: '#10b981' }}>👥</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>15+</div>
                        <div style={{ color: '#666' }}>Montatori profesioniști</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '2rem', color: '#10b981' }}>⭐</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4.9</div>
                        <div style={{ color: '#666' }}>Rating clienți</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 Montaje Moldova. Toate drepturile rezervate.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    Service disponibil în toată Republica Moldova
                </p>
            </footer>
        </div>
    );
}

export default Home;