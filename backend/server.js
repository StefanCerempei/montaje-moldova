const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Conexiune MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'montaj_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Eroare conexiune MySQL:', err.message);
        return;
    }
    console.log('✅ Conectat la MySQL');
});

// ========== ÎNREGISTRARE ==========
app.post('/api/register', async (req, res) => {
    const { type, nume, prenume, telefon, email, parola, adresa, idnp } = req.body;

    try {
        const hashedPass = await bcrypt.hash(parola, 10);

        const sql = `INSERT INTO users (type, nume, prenume, telefon, email, parola, adresa, idnp)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [type, nume, prenume, telefon, email, hashedPass, adresa || null, idnp || null],
            (err, result) => {
                if (err) return res.json({ error: err.message });
                res.json({ success: true, userId: result.insertId, type });
            });
    } catch (error) {
        res.json({ error: 'Eroare la înregistrare' });
    }
});

// ========== LOGIN ==========
app.post('/api/login', (req, res) => {
    const { email, parola } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
        if (err || users.length === 0) return res.json({ error: 'Email sau parola incorecta' });

        const match = await bcrypt.compare(parola, users[0].parola);
        if (!match) return res.json({ error: 'Email sau parola incorecta' });

        res.json({ success: true, user: users[0] });
    });
});

// ========== CLIENT - COMANDA NOUA (CU TOATE CÂMPURILE) ==========
app.post('/api/comanda', (req, res) => {
    const {
        client_id, locatie, oras, nume_client, telefon_client,
        suprafata, btu, bloc, interfon, etaj, data_preferata, ora_preferata, instructiuni
    } = req.body;

    const sql = `INSERT INTO comenzi (
        client_id, locatie, oras, nume_client, telefon_client,
        suprafata, btu, bloc, interfon, etaj, data_preferata, ora_preferata, instructiuni
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        client_id, locatie, oras, nume_client, telefon_client,
        suprafata || null, btu || null, bloc || null, interfon || null,
        etaj || null, data_preferata || null, ora_preferata || null, instructiuni || null
    ], (err, result) => {
        if (err) return res.json({ error: err.message });
        res.json({ success: true, comandaId: result.insertId });
    });
});

// ========== CLIENT - ISTORIC COMENZI ==========
app.get('/api/comenzi/:clientId', (req, res) => {
    db.query(`SELECT 
        c.*, 
        u.nume, u.prenume, u.telefon,
        DATE_FORMAT(c.data_preferata, '%Y-%m-%d') as data_preferata_formatted
        FROM comenzi c 
        LEFT JOIN users u ON c.montator_id = u.id
        WHERE c.client_id = ? 
        ORDER BY c.data_creare DESC`,
        [req.params.clientId], (err, results) => {
            res.json(results);
        });
});

// ========== CLIENT - LISTA MONTATORI ==========
app.get('/api/montatori', (req, res) => {
    db.query('SELECT id, nume, prenume, telefon FROM users WHERE type = "montator"',
        (err, results) => {
            res.json(results);
        });
});

// ========== CLIENT - ASIGNEAZA MONTATOR ==========
app.post('/api/asigneaza-montator', (req, res) => {
    const { comanda_id, montator_id } = req.body;

    db.query('UPDATE comenzi SET montator_id = ?, status = "asignata" WHERE id = ?',
        [montator_id, comanda_id], (err) => {
            if (err) return res.json({ error: err.message });
            res.json({ success: true });
        });
});

// ========== MONTATOR - COMANZILE MELE (CU TOATE DETALIILE) ==========
app.get('/api/comenzile-mele/:montatorId', (req, res) => {
    db.query(`SELECT
                  c.*,
                  u.nume, u.prenume, u.telefon, u.adresa,
                  DATE_FORMAT(c.data_preferata, '%Y-%m-%d') as data_preferata_formatted
              FROM comenzi c
                       JOIN users u ON c.client_id = u.id
              WHERE c.montator_id = ? AND c.status != 'finalizata'
              ORDER BY c.data_preferata ASC, c.data_creare ASC`,
        [req.params.montatorId], (err, results) => {
            res.json(results);
        });
});

// ========== MONTATOR - FINALIZARE COMANDA ==========
// ========== MONTATOR - CONFIRMARE COMANDA ==========
app.post('/api/confirma-comanda', (req, res) => {
    const { comanda_id, montator_id, confirmat, motiv } = req.body;

    if (confirmat === 'confirmat') {
        db.query('UPDATE comenzi SET confirmat_montator = ?, data_confirmare = NOW() WHERE id = ? AND montator_id = ?',
            ['confirmat', comanda_id, montator_id], (err, result) => {
                if (err) return res.json({ error: err.message });
                res.json({ success: true, message: 'Comanda confirmată!' });
            });
    } else if (confirmat === 'respins') {
        db.query('UPDATE comenzi SET confirmat_montator = ?, motiv_respingere = ? WHERE id = ? AND montator_id = ?',
            ['respins', motiv, comanda_id, montator_id], (err, result) => {
                if (err) return res.json({ error: err.message });

                // Eliberează montatorul și pune comanda din nou în așteptare
                db.query('UPDATE comenzi SET montator_id = NULL, status = "asteapta" WHERE id = ?',
                    [comanda_id], (err) => {
                        if (err) return res.json({ error: err.message });
                        res.json({ success: true, message: 'Comanda respinsă!' });
                    });
            });
    }
});

// ========== CLIENT - VEDEAZA CONFIRMAREA ==========
app.get('/api/confirmare-comanda/:comandaId', (req, res) => {
    db.query('SELECT confirmat_montator, data_confirmare, motiv_respingere FROM comenzi WHERE id = ?',
        [req.params.comandaId], (err, results) => {
            res.json(results[0] || {});
        });
});

// ========== MONTATOR - SALARIU ==========
app.get('/api/salariu/:montatorId', (req, res) => {
    db.query('SELECT salariu_total FROM users WHERE id = ?',
        [req.params.montatorId], (err, results) => {
            res.json({ salariu: results[0]?.salariu_total || 0 });
        });
});

// ========== MONTATOR - DETALII COMANDA SPECIFICĂ ==========
app.get('/api/detalii-comanda/:comandaId', (req, res) => {
    db.query(`SELECT 
        c.*, 
        u.nume, u.prenume, u.telefon, u.adresa
        FROM comenzi c 
        JOIN users u ON c.client_id = u.id 
        WHERE c.id = ?`,
        [req.params.comandaId], (err, results) => {
            res.json(results[0] || null);
        });
});

// ========== ADMIN - STATISTICI ==========
app.get('/api/statistici', (req, res) => {
    const queries = {
        totalComenzi: 'SELECT COUNT(*) as total FROM comenzi',
        comenziFinalizate: 'SELECT COUNT(*) as finalizate FROM comenzi WHERE status = "finalizata"',
        comenziInAsteptare: 'SELECT COUNT(*) as asteapta FROM comenzi WHERE status = "asteapta"',
        totalSalarii: 'SELECT SUM(salariu_total) as total FROM users WHERE type = "montator"',
        topMontatori: `SELECT u.nume, u.prenume, u.salariu_total 
                       FROM users u 
                       WHERE u.type = "montator" 
                       ORDER BY u.salariu_total DESC 
                       LIMIT 5`
    };

    Promise.all([
        new Promise((resolve) => db.query(queries.totalComenzi, (err, r) => resolve(r?.[0] || { total: 0 }))),
        new Promise((resolve) => db.query(queries.comenziFinalizate, (err, r) => resolve(r?.[0] || { finalizate: 0 }))),
        new Promise((resolve) => db.query(queries.comenziInAsteptare, (err, r) => resolve(r?.[0] || { asteapta: 0 }))),
        new Promise((resolve) => db.query(queries.totalSalarii, (err, r) => resolve(r?.[0] || { total: 0 }))),
        new Promise((resolve) => db.query(queries.topMontatori, (err, r) => resolve(r || [])))
    ]).then(([total, finalizate, asteapta, salarii, top]) => {
        res.json({
            totalComenzi: total.total,
            comenziFinalizate: finalizate.finalizate,
            comenziInAsteptare: asteapta.asteapta,
            totalSalarii: salarii.total,
            topMontatori: top
        });
    });
});

// ========== ADMIN - TOATE COMENZILE ==========
app.get('/api/toate-comenzile', (req, res) => {
    db.query(`SELECT 
        c.*,
        client.nume as client_nume, client.prenume as client_prenume, client.telefon as client_telefon,
        montator.nume as montator_nume, montator.prenume as montator_prenume
        FROM comenzi c
        LEFT JOIN users client ON c.client_id = client.id
        LEFT JOIN users montator ON c.montator_id = montator.id
        ORDER BY c.data_creare DESC`,
        (err, results) => {
            res.json(results);
        });
});

// ========== PORNEȘTE SERVERUL ==========
app.listen(5000, () => {
    console.log('🚀 Server pe http://localhost:5000');
});