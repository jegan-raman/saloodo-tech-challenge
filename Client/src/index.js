import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from './components/App';
import Thunk from 'redux-thunk';

const store = createStore(
    reducers, // reducers
    composeWithDevTools(applyMiddleware(Thunk))
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);