import { SHIPMENT_RESET, SHIPMENT_LIST, ASSIGN_SHIPMENT, UPDATE_SHIPMENT, SHIPMENT_DASHBOARD } from 'Actions/types';


/**
 * Initial Asset
 */
const INIT_STATE = {
    shipmentList: {},
    dashboardReports: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SHIPMENT_RESET:
            return { ...INIT_STATE };
        case SHIPMENT_DASHBOARD:
            return { ...state, dashboardReports: action.payload};
        case SHIPMENT_LIST:
            return { ...state, shipmentList: action.payload};
        case ASSIGN_SHIPMENT:
            return { ...state };
        case UPDATE_SHIPMENT:
            return { ...state };
        default:
            return { ...state };
    }
}
