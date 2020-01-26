import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import { TOP_BAR_HEIGHT_PX } from '../config/constants';

const AppContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const useStyles = makeStyles(() => ({
    topBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: TOP_BAR_HEIGHT_PX
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: TOP_BAR_HEIGHT_PX
    }
}));

const Frame = ({ children, showSignOut, signOut }) => {
    const classes = useStyles();

    return (
        <>
            <AppBar className={classes.topBar}>
                <Toolbar className={classes.toolbar}>
                    <div style={{ width: '48px' }}></div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: '4px'
                        }}
                    >
                        <SvgIcon
                            viewBox="0 0 512 512.00007"
                            style={{
                                color: 'white'
                            }}
                        >
                            <path d="m503.464844 93.867188h-8.53125v-42.667969c-.015625-14.132813-11.46875-25.582031-25.601563-25.597657-2.914062.027344-5.800781.558594-8.53125 1.570313v-1.570313c0-14.140624-11.460937-25.601562-25.601562-25.601562-14.136719 0-25.597657 11.460938-25.597657 25.601562v68.265626h-86.210937c-4.054687-19.863282-21.523437-34.132813-41.796875-34.132813s-37.746094 14.269531-41.796875 34.132813h-137.398437v-68.265626c0-14.140624-11.460938-25.601562-25.597657-25.601562-14.140625 0-25.601562 11.460938-25.601562 25.601562v1.570313c-2.730469-1.011719-5.617188-1.542969-8.53125-1.570313-14.132813.015626-25.585938 11.464844-25.601563 25.597657v42.667969h-8.53125c-4.714844 0-8.535156 3.820312-8.535156 8.53125 0 4.714843 3.820312 8.535156 8.535156 8.535156h8.53125v42.667968c.015625 14.128907 11.46875 25.582032 25.601563 25.597657 2.914062-.027344 5.800781-.558594 8.53125-1.570313v1.570313c0 14.140625 11.460937 25.601562 25.601562 25.601562 14.136719 0 25.597657-11.460937 25.597657-25.601562v-68.265625h136.535156v51.464844c-19.738282-16.925782-47.039063-21.960938-71.519532-13.191407-24.480468 8.765625-42.375 29.988281-46.878906 55.597657-4.507812 25.609374 5.070313 51.664062 25.085938 68.261718h-9.085938c-10.484375-.03125-20.71875 3.1875-29.292968 9.214844-12.726563 9.390625-26.507813 17.261719-41.058594 23.457031l-13.765625 5.386719c-16.230469 6.503906-26.902344 22.195312-26.984375 39.679688-.023438 14.117187 6.9375 27.332031 18.59375 35.292968 11.65625 7.960938 26.5 9.640625 39.640625 4.480469l3.199219-1.25 13.640624 100.492187c1.722657 12.691407 12.550782 22.164063 25.359376 22.179688h157.523437c13.0625.03125 24.046875-9.792969 25.46875-22.777344l15.359375-138.414062c.019531-.167969-.050781-.3125-.042969-.480469.007813-.164063.089844-.296875.089844-.460937v-238.933594h85.335937v68.265625c0 14.140625 11.460938 25.601562 25.597657 25.601562 14.140625 0 25.601562-11.460937 25.601562-25.601562v-1.570313c2.730469 1.011719 5.617188 1.542969 8.53125 1.570313 14.132813-.015625 25.585938-11.46875 25.601563-25.597657v-42.667968h8.53125c4.714844 0 8.535156-3.820313 8.535156-8.535156 0-4.710938-3.820312-8.53125-8.535156-8.53125zm-460.796875 68.265624c-4.710938-.003906-8.53125-3.820312-8.535157-8.53125v-102.402343c0-4.710938 3.820313-8.53125 8.535157-8.53125 4.710937 0 8.53125 3.820312 8.53125 8.53125v102.402343c-.003907 4.710938-3.820313 8.527344-8.53125 8.53125zm42.664062 17.066407c0 4.714843-3.820312 8.535156-8.53125 8.535156-4.714843 0-8.535156-3.820313-8.535156-8.535156v-153.597657c0-4.714843 3.820313-8.535156 8.535156-8.535156 4.710938 0 8.53125 3.820313 8.53125 8.535156zm51.203125 38.402343c0-30.636718 24.832032-55.46875 55.464844-55.46875s55.464844 24.832032 55.464844 55.46875c-.007813 1.25-.085938 2.5-.238282 3.746094-1.886718 29.105469-26.058593 51.742188-55.226562 51.71875-1.253906-.007812-2.507812-.085937-3.753906-.242187-10.742188-.621094-21.046875-4.472657-29.558594-11.050781-13.933594-10.410157-22.144531-26.78125-22.152344-44.171876zm155.355469 269.753907c-.480469 4.324219-4.144531 7.59375-8.5 7.578125h-157.523437c-4.261719 0-7.871094-3.152344-8.441407-7.375l-15.105469-111.273438c-.351562-2.59375-1.875-4.882812-4.132812-6.210937-2.257812-1.324219-4.996094-1.542969-7.433594-.589844l-13.324218 5.203125c-7.886719 3.078125-16.78125 2.058594-23.769532-2.71875-6.988281-4.777344-11.164062-12.699219-11.160156-21.164062.046875-10.480469 6.433594-19.886719 16.15625-23.796876l13.769531-5.386718c15.8125-6.671875 30.785157-15.183594 44.605469-25.363282 5.710938-4.007812 12.523438-6.148437 19.503906-6.125h110.929688c4.714844 0 8.535156-3.820312 8.535156-8.53125 0-4.714843-3.820312-8.535156-8.535156-8.535156h-8.824219c15.0625-12.496094 24.3125-30.644531 25.574219-50.175781.214844-1.753906.320312-3.523437.320312-5.289063.007813-11.886718-2.925781-23.585937-8.535156-34.0625v-81.140624c0-14.136719 11.460938-25.597657 25.601562-25.597657 14.136719 0 25.597657 11.460938 25.597657 25.597657v246.976562zm151.84375-308.15625c0 4.714843-3.820313 8.535156-8.535156 8.535156-4.710938 0-8.53125-3.820313-8.53125-8.535156v-153.597657c0-4.714843 3.820312-8.535156 8.53125-8.535156 4.714843 0 8.535156 3.820313 8.535156 8.535156zm34.132813-25.597657c0 4.710938-3.820313 8.53125-8.535157 8.53125-4.710937 0-8.53125-3.820312-8.53125-8.53125v-102.402343c0-4.710938 3.820313-8.53125 8.53125-8.53125 4.714844 0 8.535157 3.820312 8.535157 8.53125zm0 0" />
                        </SvgIcon>
                        <Typography variant="h6">LiftJL</Typography>
                    </div>
                    {showSignOut && (
                        <IconButton
                            edge="end"
                            aria-label="sign out"
                            onClick={signOut}
                        >
                            <ExitToAppIcon style={{ color: 'white' }} />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <div style={{ height: TOP_BAR_HEIGHT_PX }}></div>
            <AppContent>{children}</AppContent>
        </>
    );
};

Frame.propTypes = {
    children: PropTypes.object,
    showSignOut: PropTypes.bool,
    signOut: PropTypes.func
};

export default Frame;
