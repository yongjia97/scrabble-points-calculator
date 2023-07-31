import React, { useEffect } from 'react';
import Modal from 'react-modal';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import './TopScoreView.css';

const TopScoreView = props => {
    const {isOpen, onClose,topScores,isLoading,fetchTopScores} = props;
    const customModalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px', 
            width: '90%', 
            // padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'white', 
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        },
        header: {
          display: 'flex',
          justifyContent: 'space-between', // Align items horizontally with space between them
          alignItems: 'center', 
          padding: '10px 20px', 
          borderBottom: '1px solid #ccc', 
        },
        closeButton: {
          fontSize: '16px',
          background: 'red',
          border: 'none',
          padding: '6px',
          cursor: 'pointer',
        },
      };
    
    useEffect(() => {
        fetchTopScores();
      }, [fetchTopScores]);
    
return (
  <Modal style={customModalStyle} isOpen={isOpen} onRequestClose={onClose}>
      <div className="modal-content">
        <div style={customModalStyle.header}>
          <h2>Top 10 Scores</h2>
          <button style={customModalStyle.closeButton} onClick={onClose}>
          &times;
          </button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="top-scores-list">
          <li className="top-score-item top-score-header">
            <span className="name-text">Letters</span>
            <span className="score-text">Score</span>
          </li>
          {topScores.map((score, index) => (
            <li key={index} className="top-score-item">
                <span>{index + 1}</span>
              <span className="name-text">{score.scrabble_word}</span>
              <span className="score-text">{score.score}</span>
            </li>
          ))}
        </ul>
        )}
      </div>
    </Modal>
  );
};

const mapState = state => {
    return {
      topScores: state.ScrabblePointsModel.topScores,
      isLoading: state.ScrabblePointsModel.isLoading
    };
  };
  
const mapDispatch = dispatch => {
    return {
        fetchTopScores: dispatch.ScrabblePointsModel.fetchTopScores
    };
  };
  
export default connect(mapState,mapDispatch)(TopScoreView);

TopScoreView.propTypes = {
    topScores:propTypes.array,
    isLoading:propTypes.bool,
    fetchTopScores:propTypes.func
};
