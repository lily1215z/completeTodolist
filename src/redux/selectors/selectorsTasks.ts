
import {AppRootState} from '../store';
import {TasksType} from '../../common/types/Types';

export const selectTasks = ((state: AppRootState): TasksType => state.tasks);