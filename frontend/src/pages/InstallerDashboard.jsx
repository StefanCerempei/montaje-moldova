import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComenzileMele, finalizeazaComanda, getSalariu } from '../api';

function InstallerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [comenzi, setComenzi] = useState([]);
    const [salariu, setSalariu] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.type !== 'montator') {
            navigate('/login');
            return;
        }
        incarcaDate();
    }, []);

    const incarcaDate = async () => {
        setLoading(true);
        const [comenziData, salariuData] = await Promise.all([
            getComenzileMele(user.id),
            getSalariu(user.id)
        ]);
        setComenzi(comenziData);
        setSalariu(salariuData.salariu);
        setLoading(false);
    };

    const handleFinalizare = async (comandaId, numeClient, prenumeClient) => {
        const suma = prompt(`💰 Suma pentru montare (lei):\nClient: ${numeClient} ${prenumeClient}`, "500");
        if (!suma) return;

        const semnatura = prompt(`✍️ Confirmare finalizare:\nClient: ${numeClient} ${prenumeClient}\nData: ${new Date().toLocaleDateString('ro-RO')}`,
            `${numeClient} ${prenumeClient}, ${new Date().toLocaleDateString('ro-RO')}`);
        if (!semnatura) return;

        setLoading(true);
        const result = await finalizeazaComanda(comandaId, user.id, semnatura, parseInt(suma));
        setLoading(false);

        if (result.success) {
            alert(`✅ Montare finalizată! Ai câștigat ${suma} lei`);
            incarcaDate();
        } else {
            alert('❌ Eroare la finalizare');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Funcție pentru a formata data
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ro-RO');
    };

    return (
        <div>
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1 className="logo" style={{ fontSize: '1.5rem', margin: 0 }}>🔧 Montaje Moldova</h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Bine ai venit, {user.nume} {user.prenume}!
                    </p>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                    🚪 Delogare
                </button>
            </header>

            {/* Loading */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-spinner"></div>
                </div>
            )}

            {/* Salariu Card */}
            <div className="section" style={{ paddingTop: '2rem' }}>
                <div className="salary-card card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <h3 style={{ opacity: 0.9, marginBottom: '0.5rem' }}>💰 Salariu total</h3>
                    <div className="salary-amount">{salariu.toLocaleString('ro-RO')} lei</div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        Acumulat din comenzile finalizate
                    </p>
                </div>
            </div>

            {/* Comenzi active */}
            <div className="section" style={{ paddingTop: 0 }}>
                <h2 className="section-title">🔧 Comenzi de efectuat</h2>

                {comenzi.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                        <p style={{ color: '#6b7280' }}>Nu ai comenzi asignate momentan.</p>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                            Vei primi notificări când clienții plasează comenzi.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comenzi.map((c, index) => (
                            <div key={c.id} className="card" style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s backwards` }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        {/* Status badge */}
                                        <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{
                          background: '#dbeafe',
                          color: '#3b82f6',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '2rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                      }}>
                        🔧 În progres
                      </span>
                                            {c.data_preferata && (
                                                <span style={{
                                                    marginLeft: '0.5rem',
                                                    background: '#d1fae5',
                                                    color: '#10b981',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '2rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600'
                                                }}>
                          🗓️ Programat
                        </span>
                                            )}
                                        </div>

                                        {/* Informații client */}
                                        <p style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                                            👤 {c.nume} {c.prenume}
                                        </p>

                                        <p style={{ marginBottom: '0.5rem' }}>
                                            📞 Telefon: <a href={`tel:${c.telefon}`} style={{ color: '#10b981', textDecoration: 'none' }}>{c.telefon}</a>
                                        </p>

                                        {/* Adresă completă */}
                                        <p style={{ marginBottom: '0.5rem' }}>
                                            📍 Adresă: {c.locatie}, {c.oras}
                                        </p>

                                        {/* Bloc, interfon, etaj */}
                                        {c.bloc && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                🏢 Bloc: {c.bloc} | 📞 Interfon: {c.interfon || '-'} | 📶 Etaj: {c.etaj || '-'}
                                            </p>
                                        )}

                                        {/* Specificații AC */}
                                        {c.suprafata && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                ❄️ Suprafață: {c.suprafata} m² | BTU: {c.btu || 'Necunoscut'}
                                            </p>
                                        )}

                                        {/* Data și ora programată */}
                                        {c.data_preferata && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                                                🗓️ Programat: {formatDate(c.data_preferata)} {c.ora_preferata || 'Ora flexibilă'}
                                            </p>
                                        )}

                                        {/* Instrucțiuni suplimentare */}
                                        {c.instructiuni && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                padding: '0.75rem',
                                                background: '#fef3c7',
                                                borderRadius: '0.5rem',
                                                borderLeft: '4px solid #f59e0b'
                                            }}>
                                                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                                                    <strong>📝 Instrucțiuni client:</strong><br/>
                                                    {c.instructiuni}
                                                </p>
                                            </div>
                                        )}

                                        {/* Data comenzii */}
                                        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                                            📅 Comandă plasată: {formatDate(c.data_creare)}
                                        </p>
                                    </div>

                                    {/* Buton finalizare */}
                                    <button
                                        onClick={() => handleFinalizare(c.id, c.nume, c.prenume)}
                                        className="btn btn-primary"
                                        style={{ whiteSpace: 'nowrap', alignSelf: 'center' }}
                                    >
                                        ✅ Finalizează montarea
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 Montaje Moldova. Servicii profesionale de montaj.</p>
            </footer>
        </div>
    );
}

export default InstallerDashboard;