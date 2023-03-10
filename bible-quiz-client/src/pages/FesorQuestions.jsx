import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import style from "../styles/ThousandQuestions.module.css";
import Sidebar from "../components/Sidebar";
import Timer from "../components/Timer";
import Question from "../components/Question";
import Button from "../components/Button";
import { useNavigate, Link } from "react-router-dom";
import {
  useFetchFesorQuestions,
  useAddRevisionQuestion,
} from "../api/ApiClient";
import { useSelector, useDispatch } from "react-redux";
import * as Action from "../redux/fesorQuestionsSlice";

function FesorQuestions() {
  // const [correctAnswers, setCorrectAnswers] = useState(0);
  // const [wrongAnswers, setWrongAsnwers] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);

  const [fesorQuestions, setFesorQuestions] = useState();

  const [questionsFinished, setQuestionsFinished] = useState(false);

  const questions = useSelector((state) => state.fesorQuestions.queue);

  const { opacity, disabledButtons } = useSelector(
    (state) => state.fesorQuestions
  );

  const question = useSelector(
    (state) => state.fesorQuestions.queue[state.fesorQuestions.index]
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const countdownNumber = 10;

  const { correctAnswers, wrongAnswers, questionsAttempted, index } =
    useSelector((state) => state.fesorQuestions);

  const fetchFesorQuestions = useFetchFesorQuestions();

  const addRevisionQuestion = useAddRevisionQuestion();

  useEffect(() => {
    async function fetchAllFesorQuestions() {
      await fetchFesorQuestions()
        .then((response) => {
          if (response.data.successful) {
            console.log(response.data.result);
            setFesorQuestions(response.data.result);
            dispatch(Action.startQuizAction(response.data.result));
          } else {
            console.log(response.data.errorMessage);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }

    if (!fesorQuestions) {
      fetchAllFesorQuestions();
    }
  }, [dispatch]);

  useEffect(() => {
    document.title = "Thousand Questions";

    // dispatch(Action.resetOpacityAction());

    const correct = JSON.parse(localStorage.getItem("fesorCorrectAnswer"));
    const wrong = JSON.parse(localStorage.getItem("fesorWrongAnswer"));
    const index = JSON.parse(localStorage.getItem("fesorQuestionsAttempted"));

    console.log(correct, wrong, index);

    if (index) {
      dispatch(Action.setCorrectNumberAction(correct));
      dispatch(Action.setWrongNumberAction(wrong));
      dispatch(Action.setIndexNumberAction(index));
      dispatch(Action.setQuestionsAttemptedAction(index));

      if (correct + wrong === index) {
        setDisableButtons(true);
      }
    }
  }, []);

  // Countdown state
  const [countdown, setCountdown] = useState(countdownNumber);
  const [finishedTimer, setFinishedTimer] = useState(true);

  let timerId;

  // Setting timer function in use effect
  useEffect(() => {
    if (countdown > 0) {
      timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      setFinishedTimer(true);
      return () => clearTimeout(timerId);
    } else {
      setFinishedTimer(false);
      setDisableButtons(true);
      dispatch(Action.setOpacityAction(1));
      dispatch(Action.setDisableButtonAction(true));
      dispatch(Action.wrongAnswerAction());

      let body = {
        question: question.question,
        answer: question.answer
      }

      const AddToRevision = async () => {
          await addRevisionQuestion(body)
            .then((response) => {
              if (response.data.successful) {
                console.log(response.data.result);
              } else {
                console.log(response.data.errorMessage);
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }

      AddToRevision();
    

      // increaseWrongAnswers();
      // console.log(state);
    }
  }, [countdown]);

  const clearTimer = () => {
    clearTimeout(timerId);
  };

  const handleNextButtonClick = () => {
    // setFinishedTimer(true);
    setCountdown(countdownNumber);
    setDisableButtons(false);
    dispatch(Action.nextQuestionAction());
    dispatch(Action.remainingQuestionsAction());
    dispatch(Action.setOpacityAction(0));
    dispatch(Action.setDisableButtonAction(false));
    console.log(index);

    if (questions?.length - questionsAttempted === 1) {
      setQuestionsFinished(true);
    }
    // setAttemptedQuestions(attemptedQuestions + 1);
  };

  const handleSaveButtonClick = () => {
    localStorage.setItem("fesorCorrectAnswer", JSON.stringify(correctAnswers));
    localStorage.setItem("fesorWrongAnswer", JSON.stringify(wrongAnswers));
    localStorage.setItem(
      "fesorQuestionsAttempted",
      JSON.stringify(questionsAttempted)
    );
    navigate("/category");
  };

  const handleResetButtonClick = () => {
    localStorage.removeItem("fesorCorrectAnswer");
    localStorage.removeItem("fesorWrongAnswer");
    localStorage.removeItem("fesorQuestionsAttempted");
    dispatch(Action.resetIndexAction());
    setCountdown(countdownNumber);
    dispatch(Action.setOpacityAction(0));
    dispatch(Action.setDisableButtonAction(false));
  };

  const handleWrongAnswerAndDisableButton = () => {
    dispatch(Action.wrongAnswerAction());

    dispatch(Action.setDisableButtonAction(true));
  };

  const handleCorrectAnswerAndDisableButton = () => {
    dispatch(Action.correctAnswerAction());

    dispatch(Action.setDisableButtonAction(true));
  };

  const handleShowAnswer = () => {
    dispatch(Action.setOpacityAction(1));
  };

  const handleBackToCategory = () => {
    setQuestionsFinished(false);
    dispatch(Action.resetIndexAction());
  };

  return (
    <Row>
      <Col span={18} push={6}>
        {!questionsFinished && (
          <>
            <div className={style.timer}>
              <Timer countdown={countdown} />
              <div>
                <div className={style.next}>
                  <Button click={handleNextButtonClick}>
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </Button>
                  &nbsp; &nbsp;
                  <Button click={handleSaveButtonClick}>
                    <i class="fa fa-arrow-left"></i>
                  </Button>
                  &nbsp; &nbsp;
                  <Button click={handleResetButtonClick}>
                    <i class="fa-solid fa-ban"></i>
                  </Button>
                  &nbsp; &nbsp;
                </div>
              </div>
            </div>
          </>
        )}

        {questionsFinished && (
          <>
            <div className={style.startAgain}>
              <Link to="/category">
                <Button name="Back to Category" click={handleBackToCategory}>
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </Button>
              </Link>
            </div>
          </>
        )}

        <div className={style.question}>
          <Question
            disableButtons={disableButtons}
            displayAnswer={finishedTimer}
            clearTimer={clearTimer}
            state={question}
            handleWrongAnswerAndDisableButton={
              handleWrongAnswerAndDisableButton
            }
            handleCorrectAnswerAndDisableButton={
              handleCorrectAnswerAndDisableButton
            }
            handleShowAnswer={handleShowAnswer}
            opacity={opacity}
            disabledButtons={disabledButtons}
            questionsFinished={questionsFinished}
          />
        </div>
      </Col>

      <Col span={6} pull={18}>
        <Sidebar
        key={"fesor-question"}
          correct={correctAnswers}
          wrong={wrongAnswers}
          remaining={questions?.length - questionsAttempted}
          total={questions?.length}
        />
      </Col>
    </Row>
  );
}

export default FesorQuestions;
