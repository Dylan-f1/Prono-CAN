import React from 'react';
import '../styles/MatchCard.css';

const MatchCard = ({ match, prono, onPronoChange }) => {
  return (
    <div className="match-card">
      <div className="match-header">
        <span className="match-date">{match.date}</span>
        <span className="match-time">{match.time}</span>
      </div>

      <div className="match-teams">
        <div className="team">
          <span className="team-flag">{match.flag1}</span>
          <span className="team-name">{match.team1}</span>
          <input
            type="number"
            min="0"
            max="20"
            value={prono?.score1 ?? ''}
            onChange={(e) => onPronoChange(match.id, 'score1', e.target.value)}
            className="score-input"
            placeholder="0"
          />
        </div>

        <div className="vs">VS</div>

        <div className="team">
          <input
            type="number"
            min="0"
            max="20"
            value={prono?.score2 ?? ''}
            onChange={(e) => onPronoChange(match.id, 'score2', e.target.value)}
            className="score-input"
            placeholder="0"
          />
          <span className="team-name">{match.team2}</span>
          <span className="team-flag">{match.flag2}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;