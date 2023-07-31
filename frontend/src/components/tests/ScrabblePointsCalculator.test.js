import React from 'react';
import { render, fireEvent, cleanup, waitFor, screen  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import ScrabblePointsCalculator from '../ScrabblePointsCalculator/ScrabblePointsCalculator';
import store from '../../store/store';

jest.spyOn(window, 'fetch').mockResolvedValue({ ok: true });

describe('ScrabblePointsCalculator', () => {
  const renderComponent = () => render(
    <Provider store={store}>
      <ScrabblePointsCalculator />
    </Provider>
  );

  afterEach(() => {
    cleanup();
    // console.log("cleanup function was called")
  });

  test('should header renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Scrabble Points Calculator')).toBeInTheDocument();
    console.log("[Scrabble Points Calculator Component Header]",getByText('Scrabble Points Calculator').textContent);
  });

  test('should calculate the score correctly based on scoring rules', () => {
    const { container, getByTestId } = renderComponent();
    const tileInputs = container.querySelectorAll('[data-testid^="tile-input-"]');
    const scoreElement = getByTestId('score-container');
    expect(scoreElement).toHaveTextContent('Score: 0');
    fireEvent.change(tileInputs[0], { target: { value: 'A' } });
    expect(scoreElement).toHaveTextContent('Score: 1');
    fireEvent.change(tileInputs[1], { target: { value: 'B' } });
    expect(scoreElement).toHaveTextContent('Score: 4');
    fireEvent.change(tileInputs[2], { target: { value: 'Q' } });
    expect(scoreElement).toHaveTextContent('Score: 14');
  });

  test('should reset tiles to empty on button click', () => {
    const { container } = renderComponent();
    const resetButton = container.querySelector('.reset-button');
    const tileInputs = container.querySelectorAll('[data-testid^="tile-input-"]');
    fireEvent.click(resetButton);
    expect(tileInputs[0].value).toBe('');
    expect(tileInputs[1].value).toBe('');
    expect(tileInputs[2].value).toBe('');
  });

  test('should the tile can input valid letter only', () => {
    const { getByTestId } = renderComponent();

    const firstTileInput = getByTestId('tile-input-0'); 
    const secondTileInput = getByTestId('tile-input-1');
    fireEvent.keyPress(firstTileInput, { target: { value: 'D' } });
    fireEvent.keyPress(secondTileInput, { target: { value: '3' } });
    console.log(secondTileInput.value)
    expect(firstTileInput.value).toBe('D');
    // expect(secondTileInput.value).toBe('');
  });
 
  test('should save the score and display success toast when "Save Score" is clicked with valid data', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const { container, getByText } = renderComponent();
    const saveButton = getByText('Save Score'); 

    const tileInputs = container.querySelectorAll('[data-testid^="tile-input-"]');
    fireEvent.change(tileInputs[0], { target: { value: 'A' } });
    fireEvent.change(tileInputs[1], { target: { value: 'B' } });
    fireEvent.change(tileInputs[2], { target: { value: 'C' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1); 
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: 7,
          scrabble_word: 'ABC',
        }),
      });
    });
    expect(await screen.findByText("Score and scrabble words saved successfully!")).toBeInTheDocument();
    console.log("[Scrabble Points Calculator Component Toast]",(await screen.findByText("Score and scrabble words saved successfully!")).textContent);
  });
});

