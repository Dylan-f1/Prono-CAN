import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, pronoService, teamService } from '../services/api';
import '../styles/PlayerPronos.css';

const PlayerPronos = () => {
  const [selectedPlayers, setSelectedPlayers] = useState({
    meilleurJoueur: null,
    meilleurButeur: null,
    meilleurGardien: null
  });
  const [teams, setTeams] = useState([]);
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
        // Charger les équipes depuis l'API
        const teamsResponse = await teamService.getTeams();
        setTeams(teamsResponse.teams);

        // Charger les pronos existants depuis le backend
        const response = await pronoService.getPronos();
        
        if (response.prono && response.prono.playerPronos) {
          setSelectedPlayers(response.prono.playerPronos);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des pronos joueurs:', error);
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

  const handleValidate = async () => {
    if (!selectedPlayers.meilleurJoueur || !selectedPlayers.meilleurButeur || !selectedPlayers.meilleurGardien) {
      alert('Veuillez sélectionner tous les joueurs avant de valider');
      return;
    }

    setSaving(true);

    try {
      // Sauvegarder les pronos des joueurs via l'API
      await pronoService.savePlayerPronos(selectedPlayers);
      
      // Sauvegarder aussi en local pour compatibilité
      localStorage.setItem('playerPronos', JSON.stringify(selectedPlayers));
      
      // Récupérer les pronos matchs
      const matchPronos = JSON.parse(localStorage.getItem('matchPronos') || '{}');
      
      alert(`✅ Vos pronos ont été enregistrés avec succès !\n\nRécapitulatif :\n- ${Object.keys(matchPronos).length} matchs pronostiqués\n- Meilleur joueur : ${selectedPlayers.meilleurJoueur.name}\n- Meilleur buteur : ${selectedPlayers.meilleurButeur.name}\n- Meilleur gardien : ${selectedPlayers.meilleurGardien.name}`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des pronos. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/match-pronos');
  };

  if (loading) {
    return (
      <div className="player-pronos-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

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
        <button onClick={handleBack} className="back-button">
          ← Retour
        </button>
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

      <button onClick={handleValidate} className="final-validate-button" disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Valider tous mes pronos 🎉'}
      </button>
    </div>
  );
};

export default PlayerPronos;
