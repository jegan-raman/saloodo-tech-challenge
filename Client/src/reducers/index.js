import { combineReducers } from 'redux';
import shipmentReducer from './ShipmentReducer';
import userReducer from './UserReducer';
import authUserReducer from './AuthUserReducer';

const reducers = combineReducers({
    shipmentReducer: shipmentReducer,
    authUser: authUserReducer,
    userReducer: userReducer
});

export default reducers;
