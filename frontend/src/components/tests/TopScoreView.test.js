import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import TopScoreView from '../TopScoreView/TopScoreView';
import store from '../../store/store';
import Modal from 'react-modal';

Modal.setAppElement(document.createElement('div'));

describe('TopScoreView', () => {
    const renderComponent = () => render(
    <Provider store={store}>
        <TopScoreView isOpen={true} topScores={[]} isLoading={false} fetchTopScores={() => {}} />
    </Provider>
      );
    
    test('should render the Top 10 Score table', () => {
    renderComponent();
    const headingElement = screen.getByText('Top 10 Scores');
    expect(headingElement).toBeInTheDocument();
    console.log("[Top Score Component Header",headingElement.textContent)
    });
  
    test('should fetch top 10 scores from API and update the Redux store', async () => {
        const topScoresData = [
            {
                "id": 17,
                "score": 12,
                "scrabble_word": "DRIVING"
            },
            {
                "id": 21,
                "score": 12,
                "scrabble_word": "SINGAPORE"
            },
        ];
        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(topScoresData),
        })
      );
  
        renderComponent();
        await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/top-scores');
        const firstScoreItem = screen.getByText('EXUISTIBFQ');
        expect(firstScoreItem).toBeInTheDocument();
        console.log("[Top Score Component API response]",firstScoreItem.textContent)
        });
        expect(screen.getByText('Top 10 Scores')).toBeInTheDocument();
        const mockScoreItem = screen.getByText('SINGAPORE');
        expect(mockScoreItem).toBeInTheDocument();
        console.log("[Top Score Component Item Value]",mockScoreItem.textContent)
    });
});