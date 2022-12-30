
import {AppRootState} from '../store';

export const selectIsLoggedIn = ((state: AppRootState): boolean => state.auth.isLoggedIn);