const API = 'http://localhost:5000/api';

export const register = async (data) => {
    const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const login = async (email, parola) => {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, parola })
    });
    return res.json();
};

export const creazaComanda = async (data) => {
    const res = await fetch(`${API}/comanda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const getComenziClient = async (clientId) => {
    const res = await fetch(`${API}/comenzi/${clientId}`);
    return res.json();
};

export const getMontatori = async () => {
    const res = await fetch(`${API}/montatori`);
    return res.json();
};

export const asigneazaMontator = async (comanda_id, montator_id) => {
    const res = await fetch(`${API}/asigneaza-montator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comanda_id, montator_id })
    });
    return res.json();
};

export const getComenzileMele = async (montatorId) => {
    const res = await fetch(`${API}/comenzile-mele/${montatorId}`);
    return res.json();
};

export const finalizeazaComanda = async (comanda_id, montator_id, semnatura, suma) => {
    const res = await fetch(`${API}/finalizeaza-comanda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comanda_id, montator_id, semnatura, suma })
    });
    return res.json();
};

export const getSalariu = async (montatorId) => {
    const res = await fetch(`${API}/salariu/${montatorId}`);
    return res.json();
};
// ========== MONTATOR - CONFIRMARE COMANDA ==========
export const confirmaComanda = async (comanda_id, montator_id, confirmat, motiv = null) => {
    const res = await fetch(`${API}/confirma-comanda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comanda_id, montator_id, confirmat, motiv })
    });
    return res.json();
};

// ========== CLIENT - VERIFICARE CONFIRMARE ==========
export const getConfirmareComanda = async (comandaId) => {
    const res = await fetch(`${API}/confirmare-comanda/${comandaId}`);
    return res.json();
};
