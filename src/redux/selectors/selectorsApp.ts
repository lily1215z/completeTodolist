import {AppRootState} from '../store';
import {RequestStatusType} from '../../common/types/Types';

export const selectErrorMessage = ((state: AppRootState): null | string => state.app.error);
export const selectIsInitial = ((state: AppRootState): boolean => state.app.isInitialized);
export const selectLogin = ((state: AppRootState): string => state.app.login);
export const selectStatus = ((state: AppRootState): RequestStatusType => state.app.status);

