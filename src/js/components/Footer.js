import React from 'react';
import { ThemeContext } from "../contexts";

export default class Footer extends React.Component {
    static contextType = ThemeContext;
    render() {
        const UIColors = this.context;

        return (
            <footer>
                <p>Aplikacja stworzona przez <a href="https://ol-web.github.io">Michała Olejniczaka</a></p>

                <p>Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a>, <a href="https://www.flaticon.com/authors/creaticca-creative-agency" title="Creaticca Creative Agency">Creaticca Creative Agency</a>, <a href="https://www.flaticon.com/authors/mavadee" title="mavadee">mavadee</a> and <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></p>

                <style jsx>{`
                    footer{
                        background:${UIColors.sand};
                        padding:10px;
                        width:100%;
                        text-align:center;
                        color: ${UIColors.dark};
                        position: absolute;
                        bottom: 0;
                    }
                    a{
                        color:inherit;
                    }
                    p{
                        font-size:18px;
                        padding:10px;
                    }
                `}</style>
            </footer>
        );
    }
}