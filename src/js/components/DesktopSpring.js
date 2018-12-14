import React from 'react';
import { Spring } from 'react-spring';
import { isMobile } from "../deviceDetect";

const DesktopSpring = (props) => {
    if (isMobile) {
        return (
            <React.Fragment>
                {props.children}
            </React.Fragment>
        );
    } else {
        return (
            <Spring {...props}>
                {props.children}
            </Spring>
        );
    }
};

export default DesktopSpring;