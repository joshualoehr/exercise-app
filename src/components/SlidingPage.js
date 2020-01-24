import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { TOP_BAR_HEIGHT } from '../config/constants';

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: theme.palette.primary.light
    },
    backIcon: {
        color: 'white'
    },
    title: {
        width: '100%',
        textAlign: 'center'
    }
}));

const SlidingPage = ({ children, show, hide, title, direction = 'left' }) => {
    const classes = useStyles();

    return (
        <Slide direction={direction} in={show} mountOnEnter unmountOnExit>
            <Paper
                elevation={4}
                style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%'
                }}
            >
                <div style={{ height: TOP_BAR_HEIGHT }}></div>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton onClick={hide}>
                            <ArrowBackIcon className={classes.backIcon} />
                        </IconButton>
                        <Typography variant="h5" className={classes.title}>
                            {title}
                        </Typography>
                        <div style={{ width: '48px' }}></div>
                    </Toolbar>
                </AppBar>
                {children}
            </Paper>
        </Slide>
    );
};

SlidingPage.propTypes = {
    children: PropTypes.object,
    show: PropTypes.bool,
    hide: PropTypes.func,
    title: PropTypes.string,
    direction: PropTypes.string
};

export default SlidingPage;
