import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches } from '../data/matches';
import MatchCard from './MatchCard';
import '../styles/MatchPronos.css';

const MatchPronos = () => {
  const [pronos, setPronos] = useState({});
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handlePronoChange = (matchId, field, value) => {
    setPronos(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }));
  };

  const handleValidate = () => {
    // Vérifier que tous les matchs ont des pronos
    const allPronosComplete = matches.every(match => {
      const prono = pronos[match.id];
      return prono && prono.score1 !== '' && prono.score2 !== '';
    });

    if (!allPronosComplete) {
      alert('Veuillez remplir tous les scores avant de valider');
      return;
    }

    // Sauvegarder les pronos dans le localStorage
    localStorage.setItem('matchPronos', JSON.stringify(pronos));
    
    // Rediriger vers la page des pronos joueurs
    navigate('/player-pronos');
  };

  return (
    <div className="match-pronos-container">
      <div className="match-pronos-header">
        <h1>🏆 Pronos CAN 2025</h1>
        <p className="welcome-text">Bienvenue <strong>{user}</strong> ! Faites vos pronos</p>
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

      <button onClick={handleValidate} className="validate-button">
        Valider mes pronos 🎯
      </button>
    </div>
  );
};

export default MatchPronos;