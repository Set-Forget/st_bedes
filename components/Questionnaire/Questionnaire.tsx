import React, { useEffect, useState, useRef, useMemo } from "react";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { BlockUI } from "primereact/blockui";

import Pagination from "./Pagination/Pagination";

import renderQuestions from "./renderQuestions";
import { Question } from "@/shared/types";

import fetchApi from "@/shared/fetchApi";
import { useAuth } from "@/context/authContext";

interface Props {
  questions: Question[];
  isAnswered: boolean;
  updateCompletedQuestion: (questionToMove: Question) => void;
  updateProgress: React.Dispatch<React.SetStateAction<number>>;
  isFinished: boolean;
  finish: () => void;
  reset: () => void;
  // onSurveyCompleted?: () => void;
  refetchSurveys: () => Promise<void>;
}

const Questionnaire: React.FC<Props> = ({
  questions,
  isAnswered,
  updateCompletedQuestion,
  updateProgress,
  isFinished,
  finish,
  reset,
  // onSurveyCompleted,
  refetchSurveys,
}) => {
  const { userType } = useAuth();

  const [questionnaireQuestions, setQuestionnnaireQuestions] =
    useState(questions);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [fetching, setFetching] = useState(false);

  // const isLastPage = page + 1 === totalPages;
  const isLastPage = true;

  const toast = useRef<Toast>(null);

  useEffect(() => {
    const total = questionnaireQuestions.length;

    const answered = [...questionnaireQuestions].filter(
      (question) => question.value
    ).length;

    const progress = (answered / total) * 100;

    updateProgress(progress);
  }, [questionnaireQuestions, updateProgress]);

  // useEffect(() => {
  // let page = 0, totalPages = 1;

  // const updateComponents = parentQuestionnaire.components.map((component, index) => {

  //     // if(component.type === 'break') {
  //     //     page++;
  //     //     totalPages++;
  //     // };

  //     return {
  //         ...component,
  //         id: index,
  //         page
  //     }
  // });

  // setQuestionnaire({
  //     ...parentQuestionnaire,
  //     components: updateComponents
  // });

  // setTotalPages(totalPages);

  // }, [ ]);

  useEffect(() => {
    questionnaireQuestions.forEach((question) => {
      if (!question.options) console.log(question);
    });
  }, [questionnaireQuestions]);

  const checkForErrors = () => {
    let haveError = false;

    const questions = questionnaireQuestions.map((question) => {
      // const isCurrentPageComponent = question.page === page;

      // if(!isCurrentPageComponent) return component;

      const isEmpty = () => {
        let empty = false;
        switch (question.type) {
          case "text":
          case "select":
            empty = !question.value ? true : false;
            break;
        }

        return empty;
      };

      if (!haveError) {
        haveError = isEmpty();
      }

      return {
        ...question,
        error: isEmpty(),
      };
    });

    setQuestionnnaireQuestions(questions);

    if (haveError && toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please answer all questions.",
        life: 6000,
      });
    }

    return haveError;
  };

  const changePageHandler = (nextPage: number) => {
    // if(nextPage < page) {
    //     setPage(nextPage);
    //     return true;
    // };

    // if(checkForErrors()) return false;

    // setPage(nextPage);

    return true;
  };

  const updateValueHandler = (value: string | undefined, id: number) => {
    if (fetching) return;

    setQuestionnnaireQuestions((questions) => {
      return [...questions].map((question) => {
        return {
          ...question,
          value: question.question_id === id ? value : question.value,
        };
      });
    });
  };

  const BASE_URL = "https://script.google.com/macros/s/AKfycbzOQ-TAlZ5No2x2Hr8x6yLViRbwRhIMvv4v7d3hQa0n8FYjZEBZPSci0vT74m5l-kYU2g/exec";

  const submitHandler = async () => {
    if (isAnswered) return;
    if (checkForErrors()) return false;

    if (fetching) return;
    setFetching(true);

    const endpoint = "saveStudentAnswers"; 

    type AnswerObject = {
      row_number: number;
      student_id: number;
      question_id: number;
      answer: string;
      teacher_id?: number; 
    };

    // Construct the answers to send
    const answersToSend = questionnaireQuestions.map((question, index) => {
      const { set_id, question_id, student_id, teacher_id, value } = question;

      let answerObj: AnswerObject = {
        row_number: index + 1,
        student_id: student_id!,
        question_id,
        answer: value!,

      };

      if (teacher_id) {
        answerObj.teacher_id = teacher_id;
      }

      return answerObj;
    });

    const objectBody = {
      action: endpoint,
      data: answersToSend,
    };

    // Use the API_URL from the fetchApi utility to construct the full endpoint URL
    const json = await fetchApi(endpoint, {
      method: "POST",
      body: JSON.stringify(objectBody),
    });

    console.log("API Request Body:", objectBody);
    console.log("API Response:", json); // Enhanced logging

    const success = json.status === 200;

    setFetching(false);

    if (toast.current) {
      toast.current.show({
        severity: success ? "success" : "error",
        summary: success ? "Success" : "Error",
        detail: json.message,
        life: 6000,
      });
    }

    if (success) {
      questionnaireQuestions.forEach((question) => {
        updateCompletedQuestion(question);
      });

      finish();
      refetchSurveys();
    } else {
      console.error("Submission Error:", json.message); // Enhanced logging
    }
};


  const finishedLayout = (
    <div className="w-full h-full flex justify-content-center align-items-center">
      <div className="flex flex-column">
        <div className="flex justify-content-center align-items-center mb-5">
          <i className="pi pi-verified" style={{ fontSize: "2.5rem" }}></i>
          <h4 className="text-4xl text-center ml-3">Survey completed</h4>
        </div>
        <Button label="Back to all surveys" onClick={reset} />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full py-5">
      <BlockUI blocked={fetching} fullScreen />
      <Toast ref={toast} />
      <div className="w-full h-full questionnaire p-5 border-round-2xl flex flex-column shadow-4 ">
        {!isFinished ? (
          <>
            <div className="flex flex-column flex-1">
              {renderQuestions(questionnaireQuestions, userType, updateValueHandler)}

              {isLastPage && (
                <div className="align-self-end mt-auto mb-3">
                  <Button
                    label={!fetching ? "Submit" : "Loading..."}
                    disabled={isAnswered}
                    onClick={submitHandler}
                    loading={fetching}
                  />
                </div>
              )}
            </div>
            <div className="w-full">
              <Pagination
                total={totalPages}
                changePageHandler={changePageHandler}
              />
            </div>
          </>
        ) : (
          finishedLayout
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
