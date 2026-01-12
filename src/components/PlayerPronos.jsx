import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teams } from '../data/players';
import '../styles/PlayerPronos.css';

const PlayerPronos = () => {
  const [selectedPlayers, setSelectedPlayers] = useState({
    meilleurJoueur: null,
    meilleurButeur: null,
    meilleurGardien: null
  });
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const allPlayers = teams.flatMap(team => 
    team.players.map(player => ({
      ...player,
      teamName: team.name,
      teamFlag: team.flag
    }))
  );

  const handlePlayerSelect = (category, player) => {
    setSelectedPlayers(prev => ({
      ...prev,
      [category]: player
    }));
  };

  const handleValidate = () => {
    if (!selectedPlayers.meilleurJoueur || !selectedPlayers.meilleurButeur || !selectedPlayers.meilleurGardien) {
      alert('Veuillez sélectionner tous les joueurs avant de valider');
      return;
    }

    // Sauvegarder les pronos des joueurs
    localStorage.setItem('playerPronos', JSON.stringify(selectedPlayers));
    
    // Afficher un récapitulatif
    const matchPronos = JSON.parse(localStorage.getItem('matchPronos'));
    
    alert(`✅ Vos pronos ont été enregistrés avec succès !\n\nRécapitulatif :\n- ${Object.keys(matchPronos).length} matchs pronostiqués\n- Meilleur joueur : ${selectedPlayers.meilleurJoueur.name}\n- Meilleur buteur : ${selectedPlayers.meilleurButeur.name}\n- Meilleur gardien : ${selectedPlayers.meilleurGardien.name}`);
  };

  const PlayerCategory = ({ title, category, players }) => (
    <div className="player-category">
      <h2>{title}</h2>
      <div className="players-grid">
        {players.map(player => (
          <div
            key={player.id}
            className={`player-card ${selectedPlayers[category]?.id === player.id ? 'selected' : ''}`}
            onClick={() => handlePlayerSelect(category, player)}
          >
            <div className="player-team-flag">{player.teamFlag}</div>
            <div className="player-info">
              <div className="player-name">{player.name}</div>
              <div className="player-team">{player.teamName}</div>
              <div className="player-position">{player.position}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="player-pronos-container">
      <div className="player-pronos-header">
        <h1>⚽ Pronos Joueurs</h1>
        <p className="subtitle">Sélectionnez vos joueurs favoris</p>
      </div>

      <div className="categories-container">
        <PlayerCategory
          title="🏆 Meilleur Joueur du Tournoi"
          category="meilleurJoueur"
          players={allPlayers}
        />

        <PlayerCategory
          title="⚽ Meilleur Buteur"
          category="meilleurButeur"
          players={allPlayers.filter(p => p.position === 'Attaquant')}
        />

        <PlayerCategory
          title="🧤 Meilleur Gardien"
          category="meilleurGardien"
          players={allPlayers.filter(p => p.position === 'Gardien')}
        />
      </div>

      <button onClick={handleValidate} className="final-validate-button">
        Valider tous mes pronos 🎉
      </button>
    </div>
  );
};

export default PlayerPronos;