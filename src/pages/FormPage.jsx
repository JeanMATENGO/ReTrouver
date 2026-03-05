import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { addAd } from '../db';
import { useAuth } from '../context/AuthContext';

const QUARTIERS = [
    'Ndendere', 'Nguba', 'Ibanda', 'Kadutu',
    'Panzi', 'Bagira', 'Cimpunda', 'Nyawera', 'Muhumba'
];

export default function FormPage() {
    const { type } = useParams(); // 'perdu' or 'trouve'
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const isPerdu = type === 'perdu';
    const title = isPerdu ? "J'ai Perdu" : "J'ai Trouvé";
    const adType = isPerdu ? "PERDU" : "TROUVÉ";

    const [formData, setFormData] = useState({
        item: '',
        location: '',
        neighborhood: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        whatsapp: '',
        photo: null // Pour l'instant on garde juste la réf si besoin plus tard
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.whatsapp) {
            alert("Le numéro WhatsApp est obligatoire.");
            return;
        }

        setSubmitting(true);
        try {
            await addAd({
                type: adType,
                ...formData
            }, currentUser?.uid);

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/annonces');
            }, 2000);

        } catch (error) {
            console.error("Erreur d'enregistrement", error);
            alert("Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ padding: 0 }}>
            <div className="header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>{title}</h1>
            </div>

            <div style={{ padding: '24px' }}>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Objet {isPerdu ? 'perdu' : 'trouvé'} *</label>
                        <input
                            type="text"
                            name="item"
                            placeholder="Ex: Téléphone Samsung"
                            required
                            value={formData.item}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Quartier *</label>
                        <select
                            name="neighborhood"
                            required
                            value={formData.neighborhood}
                            onChange={handleChange}
                        >
                            <option value="">Choisir un quartier</option>
                            {QUARTIERS.map(q => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Lieu précis *</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ex: Marché central"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date *</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description simple *</label>
                        <textarea
                            name="description"
                            placeholder="Ex: Téléphone bleu avec coque noire..."
                            required
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Numéro WhatsApp *</label>
                        <input
                            type="tel"
                            name="whatsapp"
                            placeholder="Ex: 099XXXXXXX"
                            required
                            value={formData.whatsapp}
                            onChange={handleChange}
                        />
                        <span className="helper-text">Ce numéro sera visible pour qu'on vous contacte.</span>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{ marginTop: '32px' }}
                    >
                        {submitting ? 'Publication...' : 'PUBLIER'}
                    </button>
                </form>
            </div>

            {/* Toast de confirmation */}
            <div className={`toast ${showToast ? 'show' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 color="#34c759" size={24} />
                    Annonce publiée !
                </div>
            </div>
        </div>
    );
}
