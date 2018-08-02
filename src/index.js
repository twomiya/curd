import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import GamesPage from './components/GamesPage';
import GameForm from './components/GameForm';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers'
import {composeWithDevTools} from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk'
import {BrowserRouter as Router, Route,Link} from 'react-router-dom'
const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(logger,thunk)
    )
)

export default store
const New =( 
    <Provider store={store}>
        <Router>
            <div className="ui container">
            <div className="ui three item menu">
                <Link className="item" to="/">Home</Link>
                <Link className="item" to="/games">Games</Link>
                <Link className="item" to="/new">Add New Game</Link>
            </div>
            <Route path='/' exact component={App}/>
            <Route path='/games' exact component={GamesPage}/>
            <Route path='/games/new' exact component={GameForm}/>
            <Route path='/game/:_id' exact component={GameForm}/>
            </div>
        </Router>
    </Provider>)
ReactDOM.render(New, document.getElementById('root'));
