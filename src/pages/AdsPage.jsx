import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { getAds } from '../db';

export default function AdsPage() {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAds() {
            try {
                const data = await getAds();
                setAds(data);
            } catch (error) {
                console.error("Erreur de chargement", error);
            } finally {
                setLoading(false);
            }
        }
        loadAds();
    }, []);

    const filteredAds = useMemo(() => {
        if (!searchQuery.trim()) return ads;

        const query = searchQuery.toLowerCase();
        return ads.filter(ad =>
            ad.item.toLowerCase().includes(query) ||
            ad.description.toLowerCase().includes(query) ||
            ad.neighborhood.toLowerCase().includes(query)
        );
    }, [ads, searchQuery]);

    const handleContact = (whatsappNumber) => {
        // Si le numéro commence par 0, on le remplace par l'indicatif de la RDC 243
        // Sinon on l'utilise tel quel (en supposant qu'il a déjà l'indicatif)
        let cleanNumber = whatsappNumber.replace(/\s+/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '243' + cleanNumber.substring(1);
        } else if (!cleanNumber.startsWith('+') && !cleanNumber.startsWith('243')) {
            cleanNumber = '243' + cleanNumber;
        }

        // Nettoyer le '+' s'il existe pour l'URL
        cleanNumber = cleanNumber.replace('+', '');

        window.open(`https://wa.me/${cleanNumber}`, '_blank');
    };

    return (
        <div className="page-container" style={{ padding: 0 }}>
            <div className="header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Annonces</h1>
            </div>

            <div style={{ padding: '24px' }}>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher un objet, un quartier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="empty-state">Chargement...</div>
                ) : filteredAds.length === 0 ? (
                    <div className="empty-state">
                        <Search size={48} />
                        <p>Aucune annonce trouvée.</p>
                    </div>
                ) : (
                    <div>
                        {filteredAds.map(ad => {
                            const isLost = ad.type === 'PERDU';
                            return (
                                <div key={ad.id} className="ad-card">
                                    <div className="ad-header">
                                        <span className={`ad-badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                                            {ad.type}
                                        </span>
                                        <span className="ad-date">
                                            {new Date(ad.date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>

                                    <h3 className="ad-title">{ad.item}</h3>

                                    <div className="ad-location">
                                        <MapPin size={16} />
                                        <span>{ad.location}, {ad.neighborhood}</span>
                                    </div>

                                    <p className="ad-desc">{ad.description}</p>

                                    <button
                                        className="btn btn-whatsapp"
                                        onClick={() => handleContact(ad.whatsapp)}
                                    >
                                        <MessageCircle size={20} />
                                        CONTACTER
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
