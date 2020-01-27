import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { updateRecordedWeight } from './workoutInstanceSlice';

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        display: 'flex',
        alignItems: 'center'
    },
    weightInput: {
        width: theme.spacing(8)
    }
}));

const BodyWeightCard = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const recordedWeight = useSelector(
        state => state.workoutInstance.recordedWeight
    );

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <Typography className={classes.label}>Body Weight</Typography>
                <TextField
                    className={classes.weightInput}
                    value={recordedWeight}
                    onChange={e =>
                        dispatch(updateRecordedWeight(parseInt(e.target.value)))
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">lbs</InputAdornment>
                        )
                    }}
                    inputProps={{ style: { textAlign: 'right' } }}
                ></TextField>
            </CardContent>
        </Card>
    );
};

export default BodyWeightCard;
