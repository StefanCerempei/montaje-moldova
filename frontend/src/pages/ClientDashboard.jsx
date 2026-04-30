import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { creazaComanda, getComenziClient, getMontatori, asigneazaMontator } from '../api';

function ClientDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [comenzi, setComenzi] = useState([]);
    const [montatori, setMontatori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        locatie: '',
        oras: '',
        suprafata: '',
        btu: '',
        bloc: '',
        interfon: '',
        etaj: '',
        data_preferata: '',
        ora_preferata: '',
        instructiuni: ''
    });

    // Calculează BTU aproximativ pe baza suprafeței
    const calculateBTU = (suprafata) => {
        if (!suprafata) return '';
        const sup = parseFloat(suprafata);
        if (sup <= 15) return '9.000 BTU';
        if (sup <= 20) return '12.000 BTU';
        if (sup <= 30) return '18.000 BTU';
        if (sup <= 40) return '24.000 BTU';
        return '30.000+ BTU';
    };

    const handleSuprafataChange = (e) => {
        const suprafata = e.target.value;
        const btuSugerat = calculateBTU(suprafata);
        setFormData({
            ...formData,
            suprafata: suprafata,
            btu: btuSugerat
        });
    };

    useEffect(() => {
        if (!user || user.type !== 'client') {
            navigate('/login');
            return;
        }
        incarcaDate();
    }, []);

    const incarcaDate = async () => {
        setLoading(true);
        const [comenziData, montatoriData] = await Promise.all([
            getComenziClient(user.id),
            getMontatori()
        ]);
        setComenzi(comenziData);
        setMontatori(montatoriData);
        setLoading(false);
    };

    const handleComandaNoua = async (e) => {
        e.preventDefault();
        setLoading(true);
        await creazaComanda({
            client_id: user.id,
            locatie: formData.locatie,
            oras: formData.oras,
            nume_client: user.nume + ' ' + user.prenume,
            telefon_client: user.telefon,
            suprafata: formData.suprafata,
            btu: formData.btu,
            bloc: formData.bloc,
            interfon: formData.interfon,
            etaj: formData.etaj,
            data_preferata: formData.data_preferata,
            ora_preferata: formData.ora_preferata,
            instructiuni: formData.instructiuni
        });
        setShowForm(false);
        setFormData({
            locatie: '',
            oras: '',
            suprafata: '',
            btu: '',
            bloc: '',
            interfon: '',
            etaj: '',
            data_preferata: '',
            ora_preferata: '',
            instructiuni: ''
        });
        await incarcaDate();
        alert('✅ Comanda a fost plasată!');
    };

    const handleAsigneaza = async (comandaId, montatorId) => {
        if (!montatorId) return;
        setLoading(true);
        await asigneazaMontator(comandaId, montatorId);
        await incarcaDate();
        alert('✅ Montatorul a fost asignat!');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const statusConfig = {
        'asteapta': { text: '⏳ În așteptare', color: '#f59e0b', bg: '#fef3c7' },
        'asignata': { text: '🔧 Montator asignat', color: '#3b82f6', bg: '#dbeafe' },
        'finalizata': { text: '✅ Finalizată', color: '#10b981', bg: '#d1fae5' }
    };

    // Obține data minimă (mâine)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div>
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1 className="logo" style={{ fontSize: '1.5rem', margin: 0 }}>🏠 Montaje Moldova</h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Bine ai venit, {user.nume} {user.prenume}!
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        📦 Comandă nouă
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">
                        🚪 Delogare
                    </button>
                </div>
            </header>

            {/* Formular comandă nouă */}
            {showForm && (
                <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>📝 Comandă nouă</h3>
                        <form onSubmit={handleComandaNoua}>
                            {/* Locație */}
                            <div className="form-group">
                                <label>🏠 Strada și numărul *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Str. Ștefan cel Mare 25"
                                    value={formData.locatie}
                                    onChange={(e) => setFormData({ ...formData, locatie: e.target.value })}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label>🏙️ Oraș *</label>
                                <select
                                    value={formData.oras}
                                    onChange={(e) => setFormData({ ...formData, oras: e.target.value })}
                                    required
                                    className="input-field"
                                >
                                    <option value="">Selectează orașul</option>
                                    <option>Chișinău</option>
                                    <option>Bălți</option>
                                    <option>Cahul</option>
                                    <option>Ungheni</option>
                                    <option>Comrat</option>
                                    <option>Soroca</option>
                                    <option>Orhei</option>
                                    <option>Altele</option>
                                </select>
                            </div>

                            {/* Bloc și detalii acces */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>🏢 Bloc</label>
                                    <input
                                        type="text"
                                        placeholder="Nr. blocului"
                                        value={formData.bloc}
                                        onChange={(e) => setFormData({ ...formData, bloc: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>📞 Interfon</label>
                                    <input
                                        type="text"
                                        placeholder="Cod interfon / Apartament"
                                        value={formData.interfon}
                                        onChange={(e) => setFormData({ ...formData, interfon: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>📶 Etaj</label>
                                    <input
                                        type="text"
                                        placeholder="Etajul"
                                        value={formData.etaj}
                                        onChange={(e) => setFormData({ ...formData, etaj: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Specificații aparat AC */}
                            <div style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0', paddingTop: '1rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>❄️ Specificații aparat de aer condiționat</h4>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>📐 Suprafață cameră (m²)</label>
                                        <input
                                            type="number"
                                            step="1"
                                            placeholder="Ex: 20"
                                            value={formData.suprafata}
                                            onChange={handleSuprafataChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>🔥 BTU recomandat</label>
                                        <input
                                            type="text"
                                            value={formData.btu}
                                            onChange={(e) => setFormData({ ...formData, btu: e.target.value })}
                                            placeholder="Se calculează automat"
                                            className="input-field"
                                            readOnly={formData.suprafata}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Programare */}
                            <div style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0', paddingTop: '1rem' }}>
                                <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>📅 Programare montaj</h4>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>📅 Data preferată</label>
                                        <input
                                            type="date"
                                            value={formData.data_preferata}
                                            min={minDate}
                                            onChange={(e) => setFormData({ ...formData, data_preferata: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>⏰ Ora preferată</label>
                                        <select
                                            value={formData.ora_preferata}
                                            onChange={(e) => setFormData({ ...formData, ora_preferata: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">Selectează ora</option>
                                            <option>09:00 - 11:00</option>
                                            <option>11:00 - 13:00</option>
                                            <option>13:00 - 15:00</option>
                                            <option>15:00 - 17:00</option>
                                            <option>17:00 - 19:00</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>📝 Instrucțiuni suplimentare</label>
                                <textarea
                                    placeholder="Alte detalii: parcare, acces, etc."
                                    value={formData.instructiuni}
                                    onChange={(e) => setFormData({ ...formData, instructiuni: e.target.value })}
                                    rows="3"
                                    className="input-field"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                                    Anulează
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    ✅ Plasează comanda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-spinner"></div>
                </div>
            )}

            {/* Istoric comenzi */}
            <div className="section">
                <h2 className="section-title">📋 Istoricul comenzilor tale</h2>

                {comenzi.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                        <p style={{ color: '#6b7280' }}>Nu ai nicio comandă plasată încă.</p>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Plasează prima comandă
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comenzi.map((c, index) => (
                            <div key={c.id} className="card" style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s backwards` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                          background: statusConfig[c.status].bg,
                          color: statusConfig[c.status].color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '2rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                      }}>
                        {statusConfig[c.status].text}
                      </span>
                                            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        📅 {new Date(c.data_creare).toLocaleDateString('ro-RO')}
                      </span>
                                            {c.data_preferata && (
                                                <span style={{ color: '#10b981', fontSize: '0.75rem' }}>
                          🗓️ Programat: {new Date(c.data_preferata).toLocaleDateString('ro-RO')} {c.ora_preferata}
                        </span>
                                            )}
                                        </div>

                                        <p style={{ marginBottom: '0.5rem' }}>
                                            <strong>📍 Locație:</strong> {c.locatie}, {c.oras}
                                        </p>

                                        {c.bloc && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                🏢 Bloc: {c.bloc} | 📞 Interfon: {c.interfon || '-'} | 📶 Etaj: {c.etaj || '-'}
                                            </p>
                                        )}

                                        {c.suprafata && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                ❄️ Suprafață: {c.suprafata} m² | BTU: {c.btu || '-'}
                                            </p>
                                        )}

                                        {c.instructiuni && (
                                            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                                                📝 {c.instructiuni}
                                            </p>
                                        )}
                                    </div>

                                    {c.status === 'asteapta' && (
                                        <div style={{ minWidth: '200px' }}>
                                            <select
                                                onChange={(e) => handleAsigneaza(c.id, e.target.value)}
                                                defaultValue=""
                                                className="input-field"
                                                style={{ fontSize: '0.875rem' }}
                                            >
                                                <option value="" disabled>Alege un montator</option>
                                                {montatori.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.nume} {m.prenume} - {m.telefon}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {c.status === 'asignata' && (
                                        <div style={{
                                            background: '#dbeafe',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.75rem',
                                            fontSize: '0.875rem',
                                            color: '#1e40af'
                                        }}>
                                            🔧 Un montator a fost asignat și te va contacta
                                        </div>
                                    )}
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

export default ClientDashboard;