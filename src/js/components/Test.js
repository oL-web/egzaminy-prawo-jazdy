import React from 'react';
import isVideo from 'is-video';
import isImage from 'is-image';
import Timer from "react-human-timer";

import TestResults from "./TestResults";
import questionsMap from "../questionsMap";
import { ThemeContext } from "../contexts";
import cameraIcon from "../../img/video-camera.svg";

const TEST_TIMER_DURATION = 1500;
const BASIC_QUESTION_FIRST_TIMER_DURATION = 20;
const BASIC_QUESTION_SECOND_TIMER_DURATION = 15;
const SPECIALIST_QUESTION_TIMER_DURATION = 50;

const BASIC_QUESTIONS_AMOUNT = 20;
const SPECIALIST_QUESTIONS_AMOUNT = 12;

const BASIC_QUESTION = 0;
const SPECIALIST_QUESTION = 1;

class Test extends React.Component {
    static contextType = ThemeContext;
    constructor(props) {
        super(props);

        this.state = {
            questionTimer: {},
            questionTimerTitle: "",
            basicQuestionCounter: 1,
            specialistQuestionCounter: 0,
            isVideoPlaying: false,
        };
        this.videoRef = React.createRef();
        this.points = 0;
        this.answeredQuestions = [];
    }
    componentDidMount() {
        this.prepareNewQuestion();
    }
    finishTest() {
        this.setState({ isFinished: true });
    }
    playVideoHandler = () => {
        this.setState({ isVideoPlaying: true });
    };
    videoEndHandler = () => {
        this.setState({
            questionTimerTitle: "Czas na udzielenie odpowiedzi",
            questionTimer: {
                seconds: BASIC_QUESTION_SECOND_TIMER_DURATION,
                onEnd: () => this.moveNext()
            }
        });
    };
    handleQuestionAnswer(questionIndex) {
        return () => {
            if (!this.currentQuestion) return;
            if (this.currentQuestion[questionsMap.correctAnswer] === questionIndex) {
                this.points += this.currentQuestion[questionsMap.points];
            }
            this.answeredQuestions.push(questionIndex);
            this.moveNext();
        };
    }
    moveNext() {
        const { specialistQuestionCounter } = this.state;
        if (specialistQuestionCounter === SPECIALIST_QUESTIONS_AMOUNT) {
            return this.finishTest();
        }

        this.setState(prevState => {
            const isQuestionSpecialist = this.currentQuestion[questionsMap.level] === SPECIALIST_QUESTION;
            const isQuestionLastBasic = prevState.basicQuestionCounter === BASIC_QUESTIONS_AMOUNT;

            return ((isQuestionSpecialist || isQuestionLastBasic) ?
                { isVideoPlaying: false, specialistQuestionCounter: prevState.specialistQuestionCounter + 1 } :
                { isVideoPlaying: false, basicQuestionCounter: prevState.basicQuestionCounter + 1 }
            );
        }, this.prepareNewQuestion);
    }
    prepareNewQuestion() {
        const { basicQuestionCounter, specialistQuestionCounter } = this.state;
        const { basicQuestions, specialistQuestions } = this.props;
        const currentQuestion = this.currentQuestion = (specialistQuestionCounter === 0) ?
            basicQuestions[basicQuestionCounter - 1] :
            specialistQuestions[specialistQuestionCounter - 1];

        if (!currentQuestion) return;

        const questionMedia = currentQuestion[questionsMap.media];
        if (questionMedia) {
            this.isImageInQuestion = isImage(questionMedia);
            this.isVideoInQuestion = isVideo(questionMedia);
        } else {
            this.isImageInQuestion = false;
            this.isVideoInQuestion = false
        }

        if (this.isVideoInQuestion) {
            this.setState({
                questionTimerTitle: "Czas na zapoznanie się z pytaniem",
                questionTimer: {
                    seconds: BASIC_QUESTION_FIRST_TIMER_DURATION,
                    onEnd: () => this.videoRef.current.play()
                }
            });
        } else if (currentQuestion[questionsMap.level] === SPECIALIST_QUESTION) {
            this.setState({
                questionTimerTitle: "Czas na udzielenie odpowiedzi",
                questionTimer: {
                    seconds: SPECIALIST_QUESTION_TIMER_DURATION,
                    onEnd: () => this.moveNext()
                }
            });
        }
        else {
            this.setState({
                questionTimerTitle: "Czas na zapoznanie się z pytaniem",
                questionTimer: {
                    seconds: BASIC_QUESTION_FIRST_TIMER_DURATION,
                    onEnd: () => {
                        this.setState({
                            questionTimerTitle: "Czas na udzielenie odpowiedzi",
                            questionTimer: {
                                seconds: BASIC_QUESTION_SECOND_TIMER_DURATION,
                                onEnd: () => this.moveNext()
                            }
                        });
                    }
                }
            });
        }
    }
    render() {
        const { questionTimer, basicQuestionCounter, specialistQuestionCounter, questionTimerTitle, isFinished, isVideoPlaying } = this.state;
        const { basicQuestions, specialistQuestions } = this.props;
        const question = this.currentQuestion;


        if (isFinished) return <TestResults
            basicQuestions={basicQuestions}
            specialistQuestions={specialistQuestions}
            answeredQuestions={this.answeredQuestions}
        />
        else if (!question) return null;
        const questionMedia = question[questionsMap.media];
        const UIColors = this.context;

        return (
            <React.Fragment>
                <div className="test">
                    <div className="test__info-bar">
                        <div className="info-card">
                            <h3 className="info-card__header">Pozostały czas</h3>
                            <p className="info-card__content">
                                <Timer onEnd={() => this.finishTest()} seconds={TEST_TIMER_DURATION}>
                                    {(timer) => (<span>{timer.minutes}:{timer.seconds}</span>)}
                                </Timer>
                            </p>
                        </div>
                        <div className="info-card">
                            <h3 className="info-card__header">Wartość punktowa</h3>
                            <p className="info-card__content">{question[questionsMap.points]}</p>
                        </div>
                        <div className="info-card">
                            <h3 className="info-card__header">Pytania podstawowe</h3>
                            <p className="info-card__content">{basicQuestionCounter}/{BASIC_QUESTIONS_AMOUNT}</p>
                        </div>
                        <div className="info-card">
                            <h3 className="info-card__header">Pytania specjalistyczne</h3>
                            <p className="info-card__content">{specialistQuestionCounter}/{SPECIALIST_QUESTIONS_AMOUNT}</p>
                        </div>
                    </div>

                    <div className="test__body">
                        <div className="media-panel">
                            {
                                questionMedia ?
                                    (this.isImageInQuestion ?
                                        <img
                                            className="media"
                                            src={"media/" + questionMedia}
                                        /> :
                                        <div className="media-panel__video">
                                            <video
                                                muted
                                                className="media"
                                                ref={this.videoRef}
                                                onPlay={this.playVideoHandler}
                                                onEnded={this.videoEndHandler}
                                                src={"media/" + questionMedia}
                                            >
                                            </video>
                                            {
                                                !isVideoPlaying && <img className="media-panel__camera" src={cameraIcon} title="Icon made by Freepik from www.flaticon.com" />
                                            }
                                        </div>

                                    ) : (
                                        <div className="media"></div>
                                    )
                            }
                            <div>
                                <p className="media-panel__source"><b>Źródło:</b> {question[questionsMap.source]}</p>
                                <p className="media-panel__subject"><b>Podmiot:</b> {question[questionsMap.subject]}</p>
                            </div>
                        </div>
                        <div className="question-panel">
                            <p>{questionTimerTitle}</p>
                            <div className="timer-bar">
                                <Timer
                                    {...questionTimer}
                                    key={basicQuestionCounter + questionTimerTitle + specialistQuestionCounter}
                                    zeroes={false}
                                >
                                    {
                                        (timer) => (
                                            <React.Fragment>
                                                <div style={{ transform: `scaleX(${timer.durationLeft / timer.duration})` }} className="timer-bar__fill"></div>
                                                {timer.seconds}
                                            </React.Fragment>
                                        )
                                    }
                                </Timer>
                            </div>
                            <p className="question">{question[questionsMap.question]}</p>
                            <div className="btn-group">
                                {
                                    question[questionsMap.answers].map((answer, i) => (
                                        <button key={i} onClick={this.handleQuestionAnswer(i)} className="btn">
                                            {answer}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .test{
                        max-width:1400px;
                        padding: 50px;
                        margin:0 10px;
                        background:${UIColors.dark};
                    }
                    .test__body{
                        display:flex;
                    }
                    .test__info-bar{
                        display:flex;
                        justify-content: space-around;
                        padding-bottom:15px;
                        border-width: 5px;
                        border-style: solid;
                        border-image: linear-gradient(to right,transparent,${UIColors.sand},transparent) 1 0;
                        border-bottom: 0;
                    }
                    .info-card{
                        text-align: center;
                        margin-top: -15px;
                        background: ${UIColors.darkSand};
                        color:${UIColors.dark};
                        user-select:none;
                        font-weight:bold;
                    }
                    .info-card__header{
                        font-weight:bold;
                        padding: 5px;
                    }
                    .info-card__content{
                        background:${UIColors.sand};
                        padding: 5px;
                    }
                    .question-panel{
                        text-align:center;
                        width:40%;
                        padding:10px;
                    }
                    .media-panel{
                        width:60%;
                        padding:10px;
                        position:relative;
                    }
                    .media{
                        width:100%;
                        pointer-events: none;
                        min-height:400px;
                        background: #000;
                    }
                    .media-panel__video{
                        position:relative;
                    }
                    .media-panel__source,.media-panel__subject{
                        margin:10px 0;
                    }
                    .media-panel__camera{
                        left: 0;
                        position: absolute;
                        top: 50%;
                        transform:translateY(-50%);
                        height: 50%;
                        width:100%;
                    }
                    .timer-bar{
                        background: ${UIColors.sand};
                        border: 5px solid ${UIColors.darkSand};
                        border-radius: 5px;
                        text-align: center;
                        padding: 10px;
                        position: relative;
                        z-index: 1;
                        margin-bottom:15px;
                        margin-top:5px;
                        user-select:none;
                        font-weight: bold;
                        color: ${UIColors.dark};
                    }
                    .timer-bar__fill{
                        background: ${UIColors.darkSand};
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                        top: 0;
                        left: 0;
                        transform-origin: left;
                    }
                    .btn-group{
                        display:flex;
                        flex-wrap:wrap;
                        justify-content:center;
                        align-items:center;
                        margin-top:10px;
                    }
                    .btn{
                        margin:5px;
                        padding:10px 30px;
                        border:0;
                        transition:0.2s;
                        width:100%;
                        user-select:none;
                        color:${UIColors.dark};
                        font-size:18px;
                        background: linear-gradient(120deg, ${UIColors.sand}, ${UIColors.darkSand});
                    }
                    .btn:hover{
                        transform:scale(1.1);
                        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
                    }
                    .btn:active{
                        background:${UIColors.darkSand};
                    }
                    .btn:focus{
                        outline-color:${UIColors.dark};
                    }
                    @media only screen and (max-width: 865px) {
                        .test{
                            padding:10px;
                        }
                        .test__info-bar{
                            flex-direction:column;
                        }
                        .test__body{
                            flex-direction:column;
                        }
                        .media-panel,.question-panel{
                            width:100%;
                        }
                        .info-card{
                            margin-top:0;
                        }
                        .info-card__content{
                            padding: 5px;
                            width: 50%;
                            margin: 0 auto;
                            margin-bottom: 10px;
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default Test;