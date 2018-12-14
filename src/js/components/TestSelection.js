import React from 'react';
import shuffle from 'lodash/shuffle';
import sortBy from 'lodash/sortBy';

import DrivingTest from "./Test";
import { ThemeContext } from "../contexts";
import questions from '../questions.js';
import questionsMap from "../questionsMap";

import Bus from "../../img/bus.svg";
import Car from "../../img/transport.svg";
import Minibus from "../../img/buses.svg";
import Tram from "../../img/tram.svg";
import Tractor from "../../img/tractor.svg";
import Motor from "../../img/motorcycle.svg";
import Scooter from "../../img/motorcycle-1.svg";
import Microcar from "../../img/smart-car.svg";
import Truck from "../../img/truck.svg";

const getRandomizedQuestions = (category) => {
    const shuffled = shuffle(questions.filter(q => q[questionsMap.categories].indexOf(category) !== -1));
    const BASIC_QUESTION = 0;
    const basicQuestions = [];
    const specialistQuestions = [];
    let basic3Left = 10;
    let basic2Left = 6;
    let basic1Left = 4;
    let specialist3Left = 6;
    let specialist2Left = 4;
    let specialist1Left = 2;

    for (const question of shuffled) {
        if (basicQuestions.length === 20 && specialistQuestions.length === 12) break;
        else if (question[questionsMap.level] === BASIC_QUESTION) {
            const points = question[questionsMap.points];
            if (points === 3 && basic3Left) {
                basicQuestions.push(question);
                basic3Left--;
            } else if (points === 2 && basic2Left) {
                basicQuestions.push(question);
                basic2Left--;
            } else if (points === 1 && basic1Left) {
                basicQuestions.push(question);
                basic1Left--;
            }
        } else {
            const points = question[questionsMap.points];
            if (points === 3 && specialist3Left) {
                specialistQuestions.push(question);
                specialist3Left--;
            } else if (points === 2 && specialist2Left) {
                specialistQuestions.push(question);
                specialist2Left--;
            } else if (points === 1 && specialist1Left) {
                specialistQuestions.push(question);
                specialist1Left--;
            }
        }
    }

    return {
        basicQuestions: sortBy(basicQuestions, questionsMap.points).reverse(),
        specialistQuestions: sortBy(specialistQuestions, questionsMap.points).reverse()
    };
};

class TestSelection extends React.Component {
    static contextType = ThemeContext;
    state = {
        category: ""
    };
    handleCategory = (category) => () => this.setState({ category });
    render() {
        const { category } = this.state;
        const UIColors = this.context;
        const categoriesArr = [
            { category: "AM", icon: Scooter },
            { category: "A", icon: Motor },
            { category: "A1", icon: Motor },
            { category: "A2", icon: Motor },
            { category: "B", icon: Car },
            { category: "B1", icon: Microcar },
            { category: "C", icon: Truck },
            { category: "C1", icon: Truck },
            { category: "D", icon: Bus },
            { category: "D1", icon: Minibus },
            { category: "T", icon: Tractor },
            { category: "PT", icon: Tram }
        ];

        return (
            <React.Fragment>
                {
                    category ? <DrivingTest {...getRandomizedQuestions(category)} /> : (
                        <section className="test-selection">
                            <h2 className="test-selection__title">Testy na prawo jazdy</h2>
                            <p className="test-selection__description">Wybierz kategorię</p>
                            <ul className="categories">
                                {
                                    categoriesArr.map((item, i) => (
                                        <li key={i} className="categories__category">
                                            <button
                                                onClick={this.handleCategory(item.category)}
                                                className="categories__button"
                                            >
                                                <img
                                                    src={item.icon}
                                                    style={{ transform: item.category === "B1" ? "rotateY(180deg)" : "none" }}
                                                    className="categories__icon" />
                                                {item.category}
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                    )
                }

                <style jsx>{`
                    .test-selection{
                        margin: 0 10px;
                        max-width:1200px;
                        padding:50px;
                        background:${UIColors.dark};
                    }
                    .test-selection__title{
                        font-size: 42px;
                        font-weight:bold;
                    }
                    .test-selection__description{
                        padding: 20px 0;
                        font-size:32px;
                    }             
                    .categories{
                        display:flex;
                        flex-wrap:wrap;
                        justify-content:center;
                    }
                    .categories__category{
                        margin:10px;
                        background: linear-gradient(120deg, ${UIColors.sand}, ${UIColors.darkSand});
                        text-align:center;
                        width:120px;
                        transition:0.2s;
                    }
                    .categories__category:hover{
                        transform:scale(1.1);
                        box-shadow: 0px 0px 50px 0px rgba(0,0,0,0.75);
                    }
                    .categories__button{
                        color:inherit;
                        padding:20px;
                        text-decoration:none;
                        display:block;
                        border:0;
                        background:inherit;
                        font-size: 20px;
                        font-weight: bold;
                        color: ${UIColors.dark};
                    }
                    .categories__icon{
                        width:100%; 
                        display:block;
                        margin-bottom:10px;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default TestSelection;