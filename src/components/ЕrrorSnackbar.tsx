import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../hooks/hooks';
import {selectErrorMessage} from '../redux/selectors/selectorsApp';
import {setAppErrorAC} from '../redux/actions/actionApp';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
    const errorMessage = useAppSelector(selectErrorMessage)
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC(null)) //при клике хотим закрыть поэтому передаем null
    };

    return (
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={errorMessage !== null} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Stack>
    );
}

