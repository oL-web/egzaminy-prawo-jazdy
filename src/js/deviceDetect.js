import mobileDetect from "mobile-detect";

const md = new mobileDetect(window.navigator.userAgent);

export const isMobile = md.mobile();