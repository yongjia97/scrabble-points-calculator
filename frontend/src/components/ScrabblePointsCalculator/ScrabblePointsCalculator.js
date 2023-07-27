import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import './ScrabblePointsCalculator.css'; 
import TopScoreView from '../TopScoreView/TopScoreView';
import tileScoringRules from '../../constants/tileScoringRules';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ScrabblePointsCalculator = props => {

const backendUrl ='http://localhost:8080';
const {tiles,setTile,score,setScore,resetTiles} = props;
const inputRefs = useRef([]);
const [showTopScores, setShowTopScores] = useState(false);
  useEffect(() => {
    //update the inputrefs when there is any tiles change
    inputRefs.current = inputRefs.current.slice(0, tiles.length);
  }, [tiles]);

  const calculateTotalScore = useCallback(newTiles => {
    let newScore = 0;
    newTiles.forEach((tile) => {
      if (tileScoringRules.hasOwnProperty(tile)) {
        newScore += tileScoringRules[tile];
      }
    });
    setScore(newScore);
  }, [setScore]);
  
  
  // const calculateTotalScore = (newTiles) => {
  //   let newScore = 0;
  //   newTiles.forEach((tile) => {
  //     switch (tile) {
  //       case 'A':
  //       case 'E':
  //       case 'I':
  //       case 'O':
  //       case 'U':
  //       case 'L':
  //       case 'N':
  //       case 'S':
  //       case 'T':
  //       case 'R':
  //         newScore += 1;
  //         break;
  //       case 'D':
  //       case 'G':
  //         newScore += 2;
  //         break;
  //       case 'B':
  //       case 'C':
  //       case 'M':
  //       case 'P':
  //         newScore += 3;
  //         break;
  //       case 'F':
  //       case 'H':
  //       case 'V':
  //       case 'W':
  //       case 'Y':
  //         newScore += 4;
  //         break;
  //       case 'K':
  //         newScore += 5;
  //         break;
  //       case 'J':
  //       case 'X':
  //         newScore += 8;
  //         break;
  //       case 'Q':
  //       case 'Z':
  //         newScore += 10;
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  //   setScore(newScore);
  // };

  const handleTileChange = useCallback((index, value) => {
    if (value === '') {
      return;
    }
    const newTiles = [...tiles];
    newTiles[index] = value;
    setTile({index, value});
    calculateTotalScore(newTiles);

//set focus on the next input 
    if (value !== '' && index + 1 < tiles.length) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [tiles, setTile, calculateTotalScore]);

  const handleKeyPress = useCallback((e) => {
    const validLettersRegex = /^[a-zA-Z]$/;
    if(!validLettersRegex.test(e.key)){
      e.preventDefault();
    }
  }, []);


  const handleResetTiles = () => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    resetTiles();
  };

  const toggleTopScores = () => {
    setShowTopScores((prevShowTopScores) => !prevShowTopScores);
  };

  const handleSaveScore = () => {
    if (score > 0) {
    const scrabbleWordToSave = tiles.join('');

    fetch(`${backendUrl}/api/save-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score: score,
        scrabble_word: scrabbleWordToSave,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Score and scrabble words saved successfully!')
        } else if (response.status === 409) {
          toast.warning('This scrabble word already exists. Please enter a different word.')
        } 
        else {
          toast.error('Failed to save score and scrabble words, please check with admin')
        }
      })
      .catch((error) => {
        toast.error('Failed to save score and scrabble words, please check with admin');
        console.error('Error saving score and scrabble words:', error);
      });
    }
  };

  return (
    <div className="scrabble-container">
      <h1>Scrabble Points Calculator</h1>
      <div className="tiles-container">
      {tiles.map((tile, index) => (
          <div key={index} className="tile">
            <input
              id={`tile-input-${index}`}
              type="text"
              maxLength={1}
              value={tile}
              onChange={(event) => handleTileChange(index, event.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              title="Only alphabetical characters (A-Z) are allowed."
              className="tile-input"
              ref={(input) => (inputRefs.current[index] = input)}
              readOnly={tile !== ''}
              autoFocus={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="score-container">
        <div className="score-label">Score: {score}</div>
      </div>
      <div className="button-container">
        <button className="reset-button" onClick={handleResetTiles}>
          Reset Tiles
        </button>
        <button className="save-button" onClick={handleSaveScore}>Save Score</button>
        <button className="view-button" onClick={toggleTopScores}>View Top Scores</button>
      </div>
      {showTopScores && <TopScoreView isOpen={showTopScores} onClose={toggleTopScores} />}
      <ToastContainer  position='top-right'/>
    </div>
    
  );
}
const mapState = state => {
    return {
    tiles: state.ScrabblePointsModel.tiles,
    score: state.ScrabblePointsModel.score
    }
};

const mapDispatch = dispatch => ({
    resetTiles: dispatch.ScrabblePointsModel.resetTiles,
    setTile: dispatch.ScrabblePointsModel.setTile,
    setScore: dispatch.ScrabblePointsModel.setScore
  });
export default connect(mapState,mapDispatch)(ScrabblePointsCalculator);

ScrabblePointsCalculator.propTypes= {
    tiles: propTypes.array,
    score: propTypes.number,
    resetTiles: propTypes.func,
    setTile: propTypes.func,
    setScore: propTypes.func
};