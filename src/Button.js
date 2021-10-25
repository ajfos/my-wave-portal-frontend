import React from 'react';
import classnames from 'classnames';
import LoadingSpinner from './LoadingSpinner';

export default function Button ({ onClick, children, type="button", disabled, isLoading }) {

    // if(link) {
    //     const classes = classnames("button", "button__link", disabled && "button__disabled")
    //     return (
    //         <Link href={link}>
    //             {newTab ? 
    //                 (<a target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>)
    //                 : 
    //                 (<a className={classes}>{children}</a>)
    //             }
                
    //         </Link>
    //     )
    // }

    const classes = classnames("button", disabled && "button__disabled")

    return (
        <button onClick={onClick} type={type} className={classes}>
            <div className="button__text">
                {children} 
            </div>
            {isLoading && (
                <div className="button__loadingSpinner">
                    <LoadingSpinner size="small" />
                </div>
            )}
        </button>
    )
}