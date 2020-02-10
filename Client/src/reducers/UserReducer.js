import { USER_RESET, USER_LIST } from 'Actions/types';


/**
 * Initial Asset
 */
const INIT_STATE = {
    userList: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case USER_RESET:
            return { ...INIT_STATE };
        case USER_LIST:
            return { ...state, userList: action.payload};
        default:
            return { ...state };
    }
}
