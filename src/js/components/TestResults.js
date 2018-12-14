import React from 'react';
import isImage from 'is-image';

import { ThemeContext } from "../contexts";
import questionsMap from "../questionsMap";

const MAX_POINTS = 74;

class TestResults extends React.Component {
    static contextType = ThemeContext;
    calculatePoints() {
        const { basicQuestions, specialistQuestions, answeredQuestions } = this.props;
        const allQuestions = basicQuestions.concat(specialistQuestions);
        let points = 0;

        allQuestions.forEach((question, i) => {
            if (question[questionsMap.correctAnswer] === answeredQuestions[i]) {
                points++;
            }
        });

        return points;
    }
    render() {
        const { basicQuestions, specialistQuestions, answeredQuestions } = this.props;
        const UIColors = this.context;
        const foo = [
            { title: "Pytania podstawowe", arr: basicQuestions, num: 0 },
            { title: "Pytania specjalistyczne", arr: specialistQuestions, num: basicQuestions.length },
        ];

        return (
            <React.Fragment>
                <section className="test-results">
                    <header className="test-results__header">
                        <h2 className="test-results__title">Twój wynik testu</h2>
                        <p className="test-results__points">
                            Uzyskałeś {this.calculatePoints()}/{MAX_POINTS} punktów
                        </p>
                    </header>
                    {
                        foo.map((level, i) => (
                            <article key={i} className="questions">
                                <h3 className="questions__title">{level.title}</h3>
                                <ul className="questions__list">
                                    {
                                        level.arr.map((question, j) => (
                                            <li key={j} className="question">
                                                <div className="question__main">
                                                    <div className="question__index">{j + 1}</div>
                                                    <p className="question__content">{question[questionsMap.question]}</p>
                                                </div>
                                                {question[questionsMap.media] ?
                                                    (isImage(question[questionsMap.media]) ?
                                                        <img
                                                            className="question__media"
                                                            src={"media/" + question[questionsMap.media]}
                                                        /> :

                                                        <video
                                                            controls
                                                            className="question__media"
                                                            src={"media/" + question[questionsMap.media]}
                                                        >
                                                        </video>
                                                    ) : (
                                                        <div className="question__media">
                                                        </div>
                                                    )}
                                                <ul className="question__answers">
                                                    {
                                                        question[questionsMap.answers].map((answer, k) => {
                                                            const isAnswerCorrect = question[questionsMap.correctAnswer] === k;
                                                            const isAnswerSelected = answeredQuestions[j + level.num] === k;
                                                            let className = "";
                                                            if (isAnswerCorrect) className = "question__answer_correct";
                                                            else if (!isAnswerCorrect && isAnswerSelected) className = "question__answer_incorrect";

                                                            return (
                                                                <li className={`question__answer ${className}`} key={k}
                                                                >{answer}</li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </article>
                        ))
                    }
                </section>

                <style jsx>{`
                    .test-results{
                        max-width:1200px;
                        margin:0 auto;
                        margin-top: 50px;
                        color: ${UIColors.dark};
                    }
                    .test-results__header{
                        background:${UIColors.sand};
                        padding: 20px 10px;
                        text-align: center;
                    }
                    .test-results__title{
                        font-size:48px;
                        font-weight: bold;
                    }
                    .test-results__points{
                        font-size:42px;
                    }
                    .questions{
                        margin: 0 10px;
                        margin-top: 10px;
                        padding:20px 0;
                    }
                    .questions__title{
                        font-size: 32px;
                        text-align: center;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .questions__list{
                        display: flex;
                        flex-wrap: wrap;
                    }
                    .question{
                        padding: 15px;
                        border-radius: 5px;
                        background: ${UIColors.sand};
                        width: calc(50% - 20px);
                        margin: 10px;
                        margin-bottom: 20px;
                    }
                    .question__media{
                        width: 100%;
                        margin: 10px 0;
                    }
                    .question__main{
                        display:flex;
                        align-items: center;
                    }
                    .question__index{
                        padding: 20px;
                        background: ${UIColors.dark};
                        font-weight: bold;
                        font-size: 28px;
                        color: ${UIColors.smoke};
                    }
                    .question__content{
                        padding: 10px;
                    }
                    .question__answers{
                        padding: 10px 0;
                    }
                    .question__answer{
                        padding: 15px;
                        margin-bottom: 20px;
                        border-radius: 5px;
                        background: ${UIColors.darkSand};
                        min-height: 60px;
                        align-items: center;
                        display: flex;
                    }
                    .question__answer:last-child{
                        margin-bottom: 0;
                    }
                    .question__answer_incorrect{
                        background: #bd4848;
                    }
                    .question__answer_correct{
                        background: #59a03b;
                    }
                    .question__answer::before{
                        font-weight: bold;
                        background: rgba(0, 0, 0, 0.16);
                        padding: 5px;
                        margin-right: 10px;
                        display: inline-block;
                        border-radius: 100%;
                        color: ${UIColors.smoke};
                    }
                    .question__answer_correct::before{
                        content:"✓";
                    }
                    .question__answer_incorrect::before{
                        content:"✗";
                    }
                    @media only screen and (max-width: 800px) {
                        .question{
                            width:100%;
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default TestResults;