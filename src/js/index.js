import 'reset-css';
import React from 'react';
import { render } from 'react-dom';
import { ThemeContext } from "./contexts";
import { mainTheme } from "./themes";

import Footer from "./components/Footer";
import TestSelection from "./components/TestSelection";

class App extends React.Component {
    render() {
        const UIColors = mainTheme;

        return (
            <ThemeContext.Provider value={mainTheme}>
                <TestSelection />
                <Footer />

                <style jsx global>{`
                        ::selection {
                            background: #d6d6d6;
                            color: inherit;
                        }
                        *,*::after,*::before {
                            box-sizing: border-box;
                        }
                        html, body, #app {
                            margin: 0;
                            padding: 0;
                            color: ${UIColors.smoke};   
                            font-family: 'Open Sans Condensed', sans-serif;
                            min-height:100vh;
                            font-size:21px;
                        }
                        #app{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            margin-bottom: 150px;
                        }
                        html{
                          position:relative;
                          background-color:${UIColors.lightSand};
                        }
                        b{
                            font-weight:bold;
                        }
                    `}</style>
            </ThemeContext.Provider>
        );
    }
}

render(<App />, document.querySelector("#app"));