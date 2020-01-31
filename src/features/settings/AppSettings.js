import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { setShowAppSettings, setUser } from './settingsSlice';

const useStyles = makeStyles(theme => ({
    drawer: {
        backgroundColor: 'rgb(240,240,240)'
    },
    list: {
        width: 250,
        display: 'flex',
        flexDirection: 'column'
    },
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(230,230,230)'
        }
    },
    onlineStatusContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: `${theme.spacing(1)}px auto`,
        paddingLeft: theme.spacing(1),
        width: '100%'
    },
    onlineStatusText: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '80%'
    },
    onlineStatus: {
        marginLeft: theme.spacing(1),
        borderRadius: '30px',
        width: '10px',
        height: '10px'
    },
    on: {
        backgroundColor: theme.palette.primary.main
    },
    off: {
        backgroundColor: theme.palette.secondary.main
    }
}));

const OnlineStatus = () => {
    const classes = useStyles();
    const user = useSelector(state => state.settings.user);

    return (
        <div className={classes.onlineStatusContainer}>
            <Typography className={classes.onlineStatusText}>
                {user ? user.displayName : 'Offline'}
            </Typography>
            <div
                className={`${classes.onlineStatus} ${
                    user ? classes.on : classes.off
                }`}
            ></div>
        </div>
    );
};

const AppSettingsContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.settings.user);

    return (
        <div className={classes.list} role="presentation">
            <OnlineStatus />
            <Divider />
            <List>
                <ListItem
                    className={classes.listItem}
                    onClick={() => {
                        if (user) {
                            dispatch(setUser(null));
                        } else {
                            dispatch(setUser(null));
                        }
                        dispatch(setShowAppSettings(false));
                    }}
                >
                    <ListItemIcon>
                        {user ? <ExitToAppIcon /> : <AccountBoxIcon />}
                    </ListItemIcon>
                    <ListItemText primary={user ? 'Sign Out' : 'Sign In'} />
                </ListItem>
            </List>
        </div>
    );
};

const AppSettings = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const showAppSettings = useSelector(
        state => state.settings.showAppSettings
    );

    return (
        <Drawer
            PaperProps={{ className: classes.drawer }}
            open={!!showAppSettings}
            onClose={() => dispatch(setShowAppSettings(false))}
        >
            <AppSettingsContent />
        </Drawer>
    );
};

export default AppSettings;
