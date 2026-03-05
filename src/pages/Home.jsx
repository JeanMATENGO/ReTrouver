import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { seedInitialDataIfNeeded } from '../db';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        // Injecte des données de test si la base est vide
        seedInitialDataIfNeeded();
    }, []);

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logo-area">
                    <h1>Trouvé ça</h1>
                    <p>Objets perdus et trouvés à Bukavu</p>
                </div>

                <div className="main-actions">
                    <button
                        onClick={() => navigate('/declarer/perdu')}
                        className="btn btn-lost home-btn"
                    >
                        <AlertCircle />
                        <span>J'AI PERDU</span>
                    </button>

                    <button
                        onClick={() => navigate('/declarer/trouve')}
                        className="btn btn-found home-btn"
                    >
                        <CheckCircle2 />
                        <span>J'AI TROUVÉ</span>
                    </button>
                </div>

                <button
                    onClick={() => navigate('/annonces')}
                    className="btn view-all-btn"
                >
                    <Search size={20} />
                    Voir toutes les annonces
                </button>

                {currentUser ? (
                    <button
                        onClick={() => logout().then(() => alert("Déconnecté"))}
                        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-light)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Se déconnecter ({currentUser.email})
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-light)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        Se connecter
                    </button>
                )}
            </div>
        </div>
    );
}
