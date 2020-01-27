import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';

import { TOP_BAR_HEIGHT_PX } from '../../config/constants';

const useStyles = makeStyles(theme => ({
    appBar: {
        backgroundColor: theme.palette.primary.light,
        height: TOP_BAR_HEIGHT_PX
    },
    toolbar: {
        justifyContent: 'space-between',
        minHeight: TOP_BAR_HEIGHT_PX
    },
    backIcon: {
        color: 'white'
    },
    title: {
        width: '100%',
        textAlign: 'center'
    }
}));

const SlidingPage = ({
    children,
    show,
    hide,
    Title,
    RightSide,
    direction = 'left',
    BackIcon = ArrowBackIcon
}) => {
    const classes = useStyles();

    return (
        <Slide direction={direction} in={show} mountOnEnter unmountOnExit>
            <Paper
                elevation={4}
                style={{
                    backgroundColor: 'rgb(245,245,245)',
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%'
                }}
            >
                <div style={{ height: TOP_BAR_HEIGHT_PX }}></div>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton onClick={hide}>
                            {BackIcon ? (
                                <BackIcon className={classes.backIcon} />
                            ) : (
                                <ArrowBackIcon className={classes.backIcon} />
                            )}
                        </IconButton>
                        {Title && <Title />}
                        {RightSide ? (
                            <RightSide />
                        ) : (
                            <div style={{ width: '48px' }}></div>
                        )}
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
    Title: PropTypes.func,
    RightSide: PropTypes.func,
    direction: PropTypes.string,
    BackIcon: PropTypes.object
};

export default SlidingPage;
