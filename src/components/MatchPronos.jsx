import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches } from '../data/matches';
import { authService, pronoService } from '../services/api';
import MatchCard from './MatchCard';
import '../styles/MatchPronos.css';

const MatchPronos = () => {
  const [pronos, setPronos] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        navigate('/');
        return;
      }

      setUser(JSON.parse(userStr));

      try {
        // Charger les pronos existants depuis le backend
        const response = await pronoService.getPronos();
        
        if (response.prono && response.prono.matchPronos) {
          // Convertir le Map en objet normal
          const matchPronosObj = {};
          if (response.prono.matchPronos instanceof Map) {
            response.prono.matchPronos.forEach((value, key) => {
              matchPronosObj[key] = value;
            });
          } else {
            Object.assign(matchPronosObj, response.prono.matchPronos);
          }
          setPronos(matchPronosObj);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des pronos:', error);
        // Si erreur d'authentification, rediriger vers login
        if (error.response?.status === 401) {
          authService.logout();
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handlePronoChange = (matchId, field, value) => {
    setPronos(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  };

  const handleValidate = async () => {
    // Vérifier que tous les matchs ont des pronos
    const allPronosComplete = matches.every(match => {
      const prono = pronos[match.id];
      return prono && prono.score1 !== '' && prono.score2 !== '';
    });

    if (!allPronosComplete) {
      alert('Veuillez remplir tous les scores avant de valider');
      return;
    }

    setSaving(true);

    try {
      // Sauvegarder les pronos via l'API
      await pronoService.saveMatchPronos(pronos);
      
      // Sauvegarder aussi en local pour compatibilité
      localStorage.setItem('matchPronos', JSON.stringify(pronos));
      
      // Rediriger vers la page des pronos joueurs
      navigate('/player-pronos');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des pronos. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="match-pronos-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="match-pronos-container">
      <div className="match-pronos-header">
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
        <h1>🏆 Pronos CAN 2025</h1>
        <p className="welcome-text">Bienvenue <strong>{user?.username}</strong> ! Faites vos pronos</p>
      </div>

      <div className="matches-list">
        {matches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            prono={pronos[match.id]}
            onPronoChange={handlePronoChange}
          />
        ))}
      </div>

      <button onClick={handleValidate} className="validate-button" disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Valider mes pronos 🎯'}
      </button>
    </div>
  );
};

export default MatchPronos;
