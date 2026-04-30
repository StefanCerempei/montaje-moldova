import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComenzileMele, finalizeazaComanda, getSalariu, confirmaComanda } from '../api';

function InstallerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [comenzi, setComenzi] = useState([]);
    const [salariu, setSalariu] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

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

    const handleConfirma = async (comandaId) => {
        setLoading(true);
        const result = await confirmaComanda(comandaId, user.id, 'confirmat');
        setLoading(false);
        if (result.success) {
            alert('✅ Comanda confirmată! Vei fi notificat când clientul confirmă.');
            incarcaDate();
        }
        setShowConfirmModal(null);
    };

    const handleRespinge = async (comandaId) => {
        if (!rejectReason.trim()) {
            alert('Te rog să specifici motivul respingerii.');
            return;
        }
        setLoading(true);
        const result = await confirmaComanda(comandaId, user.id, 'respins', rejectReason);
        setLoading(false);
        if (result.success) {
            alert('❌ Comanda respinsă. Clientul va fi notificat.');
            incarcaDate();
        }
        setShowRejectModal(null);
        setRejectReason('');
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ro-RO');
    };

    // Modal confirmare
    const ConfirmModal = ({ comanda, onClose, onConfirm }) => (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>✅ Confirmă comanda</h3>
                <p>Ești sigur că poți efectua această comandă?</p>
                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
                    <p><strong>📍 {comanda.locatie}, {comanda.oras}</strong></p>
                    <p>👤 {comanda.nume} {comanda.prenume}</p>
                    <p>📞 {comanda.telefon}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-secondary">Nu, revin</button>
                    <button onClick={onConfirm} className="btn btn-primary">Da, confirm comanda</button>
                </div>
            </div>
        </div>
    );

    // Modal respingere
    const RejectModal = ({ comanda, onClose, onConfirm, reason, setReason }) => (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>❌ Respinge comanda</h3>
                <p>Te rugăm să specifici motivul pentru care nu poți efectua această comandă:</p>
                <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
                    <p><strong>📍 {comanda.locatie}, {comanda.oras}</strong></p>
                    <p>👤 {comanda.nume} {comanda.prenume}</p>
                </div>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Motiv respingere (distanță mare, program încărcat, etc.)"
                    rows="3"
                    className="input-field"
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} className="btn btn-secondary">Anulează</button>
                    <button onClick={onConfirm} className="btn btn-danger">Respinge comanda</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <header className="dashboard-header">
                <div>
                    <h1 className="logo" style={{ fontSize: '1.5rem', margin: 0 }}>🔧 Montaje Moldova</h1>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Bine ai venit, {user.nume} {user.prenume}!
                    </p>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">🚪 Delogare</button>
            </header>

            {loading && (
                <div className="loader-overlay">
                    <div className="loader-spinner"></div>
                </div>
            )}

            {/* Modals */}
            {showConfirmModal && (
                <ConfirmModal
                    comanda={showConfirmModal}
                    onClose={() => setShowConfirmModal(null)}
                    onConfirm={() => handleConfirma(showConfirmModal.id)}
                />
            )}

            {showRejectModal && (
                <RejectModal
                    comanda={showRejectModal}
                    onClose={() => {
                        setShowRejectModal(null);
                        setRejectReason('');
                    }}
                    onConfirm={() => handleRespinge(showRejectModal.id)}
                    reason={rejectReason}
                    setReason={setRejectReason}
                />
            )}

            {/* Salariu Card */}
            <div className="section" style={{ paddingTop: '2rem' }}>
                <div className="salary-card card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <h3 style={{ opacity: 0.9, marginBottom: '0.5rem' }}>💰 Salariu total</h3>
                    <div className="salary-amount">{salariu.toLocaleString('ro-RO')} lei</div>
                </div>
            </div>

            {/* Comenzi active */}
            <div className="section" style={{ paddingTop: 0 }}>
                <h2 className="section-title">🔧 Comenzi de efectuat</h2>

                {comenzi.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
                        <p style={{ color: '#6b7280' }}>Nu ai comenzi asignate momentan.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comenzi.map((c, index) => (
                            <div key={c.id} className="card">
                                {/* Status badge */}
                                <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                      background: '#dbeafe',
                      color: '#3b82f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                  }}>
                    🔧 Comandă nouă
                  </span>
                                    {c.confirmat_montator === 'confirmat' && (
                                        <span style={{
                                            background: '#d1fae5',
                                            color: '#10b981',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                      ✅ Confirmată de tine
                    </span>
                                    )}
                                    {c.confirmat_montator === 'neconfirmat' && (
                                        <span style={{
                                            background: '#fef3c7',
                                            color: '#f59e0b',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                      ⏳ Așteaptă confirmarea ta
                    </span>
                                    )}
                                </div>

                                {/* Informații client */}
                                <p style={{ marginBottom: '0.5rem', fontWeight: '600' }}>👤 {c.nume} {c.prenume}</p>
                                <p style={{ marginBottom: '0.5rem' }}>📞 {c.telefon}</p>
                                <p style={{ marginBottom: '0.5rem' }}>📍 {c.locatie}, {c.oras}</p>

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

                                {c.data_preferata && (
                                    <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                                        🗓️ Programat: {formatDate(c.data_preferata)} {c.ora_preferata || 'Ora flexibilă'}
                                    </p>
                                )}

                                {c.instructiuni && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}>📝 {c.instructiuni}</p>
                                    </div>
                                )}

                                {/* Butoane acțiune */}
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                    {c.confirmat_montator === 'neconfirmat' && (
                                        <>
                                            <button onClick={() => setShowRejectModal(c)} className="btn btn-danger">
                                                ❌ Respinge
                                            </button>
                                            <button onClick={() => setShowConfirmModal(c)} className="btn btn-primary">
                                                ✅ Confirmă comanda
                                            </button>
                                        </>
                                    )}

                                    {c.confirmat_montator === 'confirmat' && (
                                        <button onClick={() => handleFinalizare(c.id, c.nume, c.prenume)} className="btn btn-primary">
                                            🔧 Finalizează montarea
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="footer">
                <p>&copy; 2024 Montaje Moldova. Servicii profesionale de montaj.</p>
            </footer>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
        }
      `}</style>
        </div>
    );
}

export default InstallerDashboard;