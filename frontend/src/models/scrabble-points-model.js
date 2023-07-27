
const initialState = {
    tiles: Array(10).fill(''),
    score: 0,
    topScores:[],
    isLoading: false,
};
export default {
    state: initialState,
    reducers: {
        setTile(state, payload) {
            const { index, value } = payload;
            const newTiles = [...state.tiles];
            newTiles[index] = value;
            return { ...state, tiles: newTiles };
        },
        setScore(state, payload) {
            return {
                ...state,
                score: payload
            };
        },
        resetTiles() {
            return {
                ...initialState
            };
        },
        setTopScores(state, payload) {
            return {
                ...state,
                topScores: payload
            };
        },
        setIsLoading(state, payload) {
            return {
                ...state,
                isLoading: payload
            };
        },
    },
    effects: dispatch => ({
        async fetchTopScores(_, rootState) {
            try {
                dispatch.ScrabblePointsModel.setIsLoading(true);
              let url = 'http://localhost:8080/api/top-scores';
              const response = await fetch(url);
              if (response.ok) {
                const data = await response.json();
                dispatch.ScrabblePointsModel.setTopScores(data);
              } else {
               console.error("Failed to fetch top scores");
              }
            } catch (err) {
              if (err && err.response) {
                throw new Error("An error occured[ScrabblePointsModel.fetchTopScores]" + err);
                }
            }
            finally {
                dispatch.ScrabblePointsModel.setIsLoading(false);
            }
          },
    })
}