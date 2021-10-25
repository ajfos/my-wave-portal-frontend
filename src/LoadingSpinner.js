import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './loadingSpinner.scss';

function LoadingSpinner({ size }) {
    let classes = classNames('loadingSpinner', `loadingSpinner--${size}`);

    return (
        <div className={classes}>
            <div className="loadingSpinner__track" />
            <div className="loadingSpinner__handle" />
        </div>
    );
};

LoadingSpinner.defaultProps = {
    size: 'normal'
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['xlarge', 'large', 'normal', 'small'])
};

export default LoadingSpinner;
