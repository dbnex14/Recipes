import { User } from '../user.model';
import * as fromAuthActions from './auth.actions';

export interface State {
    user: User;
}

const initialState: State = {
    user: null
};

export function authReducer(state = initialState, action: fromAuthActions.AuthActions) {
    switch (action.type) {
        case fromAuthActions.LOGIN:
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
                user: user // or just user (ts syntax simplification)
            }
        case fromAuthActions.LOGOUT:
          return {
              ...state,
              user: null
          }
        default:
            return state;
    }
}