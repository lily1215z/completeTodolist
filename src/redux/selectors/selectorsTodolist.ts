
import {AppRootState} from '../store';
import {TodolistDomainType} from '../../common/types/Types';

export const selectTodolists = ((state: AppRootState): Array<TodolistDomainType> => state.todolists);
