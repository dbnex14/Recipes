import { User } from '../user.model';
import * as fromAuthActions from './auth.actions';

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: fromAuthActions.AuthActions) {
    console.log(state); // all actions reach all reducers
    switch (action.type) {
        case fromAuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email, 
                action.payload.userId, 
                action.payload.token, 
                action.payload.expirationDate
            );
            // return updates state by first copying old state and assigning new user to 
            // the user property of initialState.
            return {
                ...state,
                user: user, // or just user (ts syntax simplification)
                authError: null,
                loading: false
            };
        case fromAuthActions.LOGOUT:
          return {
              ...state,
              user: null
          };
        case fromAuthActions.LOGIN_START:
        case fromAuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case fromAuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                authError: action.payload,
                loading: false
            };
        case fromAuthActions.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
}