import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuIcon from '@material-ui/icons/Menu';

import { TOP_BAR_HEIGHT_PX } from '../../config/constants';
import { setShowAppSettings } from '../settings/settingsSlice';

const useStyles = makeStyles(() => ({
    appContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    },
    topBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: TOP_BAR_HEIGHT_PX
    },
    toolbar: {
        width: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: TOP_BAR_HEIGHT_PX
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: '4px auto 0 auto'
    }
}));

const LogoIcon = props => (
    <SvgIcon {...props}>
        <path d="M174.2 9c-4.1 2.5-6.8 7-7.7 12.6-.3 2.4-.8 4.4-.9 4.4-.2 0-1.7-.7-3.5-1.6-2.4-1.2-5.3-1.5-11.5-1.3-7.2.4-8.7.8-11.9 3.2-5.3 4-6.1 6.1-6.7 17.2l-.5 10-4.7.5c-3.1.4-5.6 1.4-7.3 3-2.3 2.1-2.5 3.1-2.5 10 0 9.5 1.7 11.7 9.5 12.2l5 .3.5 10.7c.6 12.3 1.8 14.9 9 18.5 5.2 2.7 14.5 3.1 20.7.9l4-1.4 1.2 5.4c2.4 10.4 9.5 15.1 21.9 14.2 8.1-.6 12.4-2.8 15.5-7.8 2-3.2 2.2-5.2 2.7-22l.5-18.5L227 79l19.5-.5v-5L227 73l-19.5-.5v-11L227 61l19.5-.5v-6l-19.7-.3L207 54V36.3c0-17.1-.1-17.8-2.5-22-3.6-6.1-6.6-7.3-17.7-7.3-7.5 0-9.9.4-12.6 2zm20.2 4.4c6.8 2.9 6.6.8 6.6 53.9v47.9l-2.8 2.8c-5.1 5.1-17.7 5.3-22.6.3l-2.6-2.6V18.4l2.8-2.6c1.5-1.4 3.4-2.8 4.2-3.1 2.9-1.1 11.1-.7 14.4.7zM163 32.5l3 2.9v30.7c0 20.9-.4 31.6-1.1 33.3-3.4 7.5-22.4 7.5-25.8 0-.7-1.7-1.1-12.4-1.1-33.3V35.4l2.8-2.6c3.7-3.5 4.7-3.8 12.4-3.5 5.9.2 7.1.6 9.8 3.2zM131.5 67v5.5h-8l-.3-4.4c-.5-6.3.2-7.3 4.5-6.9l3.8.3V67zM500 9.3c-6.7 4.4-7.5 7.1-7.8 26.9l-.4 17.8-19.1.2-19.2.3v6l19.3.3 19.2.2v12l-19.2.2-19.3.3v5l19 .5 19 .5.6 18c.4 14.1.9 18.7 2.2 21.2 3.6 6.7 10.9 9.9 21.4 9 10.1-.8 15.1-5 17.1-14.4.7-3.3 1.2-3.8 3.3-3.5 14.1 1.5 17.5 1.4 22.1-.8 7.1-3.3 8.9-7 9.7-19.3l.6-10.2 5.2-.3c7.1-.4 9.3-3.4 9.3-12.4-.1-8.8-3.6-12.8-11.3-12.8h-3.4l-.5-9.8c-.5-11.1-1.9-14.3-7.6-18.2-4.6-3.2-16.7-4.1-22.5-1.7l-3.7 1.6-.6-2.7c-1.5-7.1-3.7-11.3-7.2-13.7-3.3-2.2-4.7-2.5-13.3-2.5-8.3 0-10.1.3-12.9 2.3zm20.5 4.1c6.6 2.8 6.5 2.4 6.5 53.8 0 44.1-.1 46.5-2 49.5-3.8 6.3-17.8 7.3-23.5 1.5l-2.5-2.5V67.1c.1-46 .2-48.7 1.9-50.8 1.1-1.3 3-2.7 4.3-3.2 3.5-1.5 11.4-1.3 15.3.3zm35.6 17.2c5.5 2.8 5.9 5.4 5.9 36.6 0 24.9-.2 28.7-1.8 31.8-2.2 4.5-5.3 6-12.7 6-7.4 0-10.5-1.5-12.8-6-1.6-3.2-1.7-6.4-1.5-33.6.3-28.6.4-30.3 2.3-32.4 1.1-1.2 2.9-2.6 4-3.1 3.5-1.4 13.4-1 16.6.7zM576.5 67v5.5h-8l-.3-4.4c-.5-6.3.2-7.3 4.5-6.9l3.8.3V67zM298.7 38.6c-.4.4-.7 2.9-.7 5.5 0 5.5 1.5 6.9 7.2 6.9 5.4 0 7-1.8 6.6-7.5l-.3-5-6-.3c-3.4-.2-6.4 0-6.8.4zM328.2 39.5c-3.5 1.5-6.2 6.3-6.2 11 0 1.8-.7 2.8-2.5 3.5-2.1.8-2.5 1.6-2.5 5s.4 4.2 2.5 5c2.4.9 2.4 1.1 2.7 14.7l.3 13.8 5.3.3c8 .5 8.2.1 8.2-14.9 0-12.1.1-12.9 1.9-12.9 1.1 0 2.7-1 3.5-2.2 1.4-1.9 1.6-2 2.2-.4.4 1 1.8 2.2 3.1 2.7 2.4.9 2.4.9 2.2 14.2l-.2 13.2h13.8l.3-13.8.3-13.7h2.4c3 0 3.2-.4 3.6-6 .4-4.5.4-4.5-3.1-5-3.1-.4-3.6-.9-4-4l-.5-3.5h-12l-.3 3.3c-.2 2.4-1 3.5-2.7 4.2-1.3.5-2.6 1.4-3 2-.5.8-1 .7-1.8-.4-.7-.8-2.3-1.6-3.7-1.8-1.7-.2-2.5-.9-2.5-2.3 0-1.6.8-2.1 4.1-2.3 3.3-.2 4.4-.8 5.3-2.8 2-4.5 1.4-6.2-2.6-7.3-5.2-1.5-10.2-1.3-14.1.4zM264.7 39.6c-.4.4-.7 11.6-.7 24.8 0 20.2.3 24.5 1.6 26.4 1.4 2.1 2.2 2.2 13.8 2.2 8.1 0 12.6-.4 13.4-1.2 1.6-1.6 1.6-11.3-.1-12.6-.7-.6-3.7-1.2-6.7-1.4l-5.5-.3-.5-19-.5-19-7-.3c-3.9-.1-7.4 0-7.8.4zM379.7 39.6c-1 1.1-.8 7.9.3 10.9.8 2 1.6 2.5 3.7 2.3l2.8-.3.3 10.9c.3 13.5-.6 15.1-8 14.3-4.2-.5-4.8-.3-6.3 1.9-.9 1.5-1.5 4-1.3 6.1.4 5 4.9 7.3 13.9 7.3 7.3 0 11.3-1.9 15.3-7.3 2-2.7 2.1-4.1 2.1-24.5V39.5l-11.1-.3c-6-.1-11.3.1-11.7.4zM409 39.7c-.1.4-.1 12 0 25.8.1 16.2.5 25.4 1.2 26.2 1.4 1.8 24.9 1.8 26.6.1 1.6-1.6 1.5-10 0-12.1-.9-1.1-3.1-1.7-6.8-1.9l-5.5-.3-.5-19-.5-19-7.2-.3c-4-.2-7.3.1-7.3.5zM298.5 55.2c-.3.8-.4 9.5-.3 19.3l.3 18 6.8.3 6.7.3-.2-19.3-.3-19.3-6.3-.3c-4.5-.2-6.4.1-6.7 1z" />
    </SvgIcon>
);

const Logo = () => {
    const classes = useStyles();
    return (
        <div className={classes.logoContainer}>
            <LogoIcon
                viewBox="0 0 700 137"
                style={{ color: 'white', width: '12rem', height: '3rem' }}
            />
        </div>
    );
};

const Frame = ({ children }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <>
            <AppBar className={classes.topBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => dispatch(setShowAppSettings(true))}
                        style={{ margin: 0 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Logo />
                    <div style={{ width: '48px' }}></div>
                </Toolbar>
            </AppBar>
            <div style={{ height: TOP_BAR_HEIGHT_PX }}></div>
            <div className={classes.appContent}>{children}</div>
        </>
    );
};

Frame.propTypes = {
    children: PropTypes.object
};

export default Frame;
