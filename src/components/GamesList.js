import React from 'react';
import PropTypes from 'prop-types';
import GameCard from './GameCard';


const GamesList = ({games,deleteGame}) => {
    const emptyMessage=(
        <p>There are no games in your collection</p>
    )
    const gameList = (
        <div className="ui four cards">
            { games.map(game => <GameCard deleteGame={ deleteGame } game={ game } key={ game._id } />) }
      </div>
    )
    return (
        <div>
            {games.length===0?emptyMessage:gameList}
        </div>
    );
};

GamesList.propTypes ={
    games:PropTypes.array.isRequired,
    deleteGame: PropTypes.func.isRequired
}

export default GamesList;
