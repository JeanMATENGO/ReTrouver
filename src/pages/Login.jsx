import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate(-1); // Retour d'où on vient (ou accueil)
        } catch (err) {
            console.error(err);
            setError("Erreur d'authentification. Vérifiez vos identifiants ou la configuration Firebase.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-container" style={{ padding: 0 }}>
            <div className="header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </button>
                <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
            </div>

            <div style={{ padding: '32px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <User size={64} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-light)' }}>
                        Vous devez être connecté pour publier une annonce.
                    </p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        color: 'var(--primary-red)',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="search-container" style={{ marginBottom: 0 }}>
                            <Mail className="search-icon" size={20} />
                            <input
                                type="email"
                                required
                                className="search-input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <div className="search-container" style={{ marginBottom: 0 }}>
                            <Lock className="search-icon" size={20} />
                            <input
                                type="password"
                                required
                                className="search-input"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '24px' }}
                    >
                        {loading ? 'Patientez...' : (isLogin ? 'SE CONNECTER' : "S'INSCRIRE")}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-light)',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                    </button>
                </div>
            </div>
        </div>
    );
}
