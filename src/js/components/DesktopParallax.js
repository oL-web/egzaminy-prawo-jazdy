import React from 'react';
import Plx from 'react-plx';
import { isMobile } from "../deviceDetect";

const DesktopParallax = (props) => {
    if (isMobile) {
        return (
            <React.Fragment>
                {props.children}
            </React.Fragment>
        );
    } else {
        return (
            <Plx {...props}>
                {props.children}
            </Plx>
        );
    }
};

export default DesktopParallax;