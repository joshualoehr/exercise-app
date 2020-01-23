import React from 'react';
import PropTypes from 'prop-types';

const WorkoutsList = ({ user }) => <div>Welcome, {user.displayName}</div>;

WorkoutsList.propTypes = {
    user: PropTypes.object
};

export default WorkoutsList;
