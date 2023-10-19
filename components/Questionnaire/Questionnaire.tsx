import React, { useEffect, useState, useRef, useMemo } from 'react';

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { BlockUI } from 'primereact/blockui';

import Pagination from './Pagination/Pagination';

import renderQuestions from './renderQuestions';
import { Question } from '@/shared/types';

import fetchApi from '@/shared/fetchApi';
import { useAuth } from '@/context/authContext';

interface Props {
    questions: Question[]
    isAnswered: boolean
    updateCompletedQuestion: (questionToMove: Question) => void
    updateProgress: React.Dispatch<React.SetStateAction<number>>
    isFinished: boolean
    finish: () => void
    reset: () => void
}

const Questionnaire: React.FC<Props> = ({ questions, isAnswered, updateCompletedQuestion, updateProgress, isFinished, finish, reset }) => {

    const { userType } = useAuth();

    const [ questionnaireQuestions, setQuestionnnaireQuestions ] = useState(questions);
    const [ totalPages, setTotalPages ] = useState(0);
    const [ page, setPage ] = useState(0);
    const [ fetching, setFetching ] = useState(false);

    // const isLastPage = page + 1 === totalPages;
    const isLastPage = true;

    const toast = useRef<Toast>(null);

    useEffect(() => {
        const total = questionnaireQuestions.length;

        const answered = [...questionnaireQuestions].filter(question => question.value).length;

        const progress = answered/total * 100;

        updateProgress(progress);
    }, [ questionnaireQuestions, updateProgress ]);

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
        questionnaireQuestions.forEach(question => {
            if(!question.options) console.log(question)
        })
    }, [ questionnaireQuestions ]);

    const checkForErrors = () => {
        let haveError = false;

        const questions = questionnaireQuestions.map(question => {
            // const isCurrentPageComponent = question.page === page;

            // if(!isCurrentPageComponent) return component;

            const isEmpty = () => {
                let empty = false;
                switch(question.type) {
                    case 'text': case 'select':
                        empty = !question.value ? true : false;
                        break;
                }

                return empty;
            }

            if(!haveError) {
                haveError = isEmpty();
            }

            return {
                ...question,
                error: isEmpty()
            }
        });

        setQuestionnnaireQuestions(questions);

        if(haveError && toast.current) {
            toast.current.show({ 
                severity: 'error', 
                summary: "Error", 
                detail: 'Please answer all questions.', 
                life: 6000 
            });
        }

        return haveError;
    }

    const changePageHandler = (nextPage: number) => {

        // if(nextPage < page) {
        //     setPage(nextPage);
        //     return true;
        // };

        // if(checkForErrors()) return false;

        // setPage(nextPage);

        return true;
    }

    const updateValueHandler = (value: string | undefined, id: number) => {
        if(fetching) return;

        setQuestionnnaireQuestions(questions => {
            return [...questions].map(question => {
                return {
                    ...question,
                    value: question.question_id === id ? value : question.value
                }
            })
        });
    }

    const submitHandler = async () => {

        if(isAnswered) return;
        if(checkForErrors()) return false;
        
        if(fetching) return;
        setFetching(true);

        interface StudentQuestionAnswer {
            set_id: number
            question_id: number
            student_id: number
            teacher_id: number
            answer: string
        }

        const studentAnswers: StudentQuestionAnswer[] = [...questionnaireQuestions].map(question => {
            // questions and answers depend on the set_id, question_id, student_id, and teacher_id

            const { set_id, question_id, student_id, teacher_id, value } = question;

            return { set_id, question_id, student_id: student_id!, teacher_id: teacher_id!, answer: value! }
        });

        interface ParentQuestionAnswer {
            question_id: number
            student_id: number
            answer: string
        }

        const parentAnswers: ParentQuestionAnswer[] = [...questionnaireQuestions].map(question => {
            // questions and answers depend on the set_id, question_id, student_id, and teacher_id

            const { question_id, student_id, value } = question;

            return { question_id, student_id: student_id!, answer: value! }
        });

        const answers = userType! === 'student' ? studentAnswers : parentAnswers;
        const json = await fetchApi(``, {
            method: "POST",
            body: JSON.stringify({
                action: userType === 'student' ? "saveStudentAnswers" : "saveParentAnswers",
                data: answers
            })
        });

        // {status: 200, message: 'Student answers saved successfully.'}

        const success = json.status === 200;

        setFetching(false);

        if(toast.current) {
            toast.current.show({ 
                severity: success ? 'success' : 'error', 
                summary: success ? 'Success' : "Error", 
                detail: json.message, 
                life: 6000 
            });
        }

        if(success) {

            questionnaireQuestions.forEach(question => {
                updateCompletedQuestion(question);
            });
    
            finish();
        }
    }

    const finishedLayout = (
        <div className="w-full h-full flex justify-content-center align-items-center">
            <div className="flex flex-column">
                <div className="flex justify-content-center align-items-center mb-5">
                    <i className='pi pi-verified' style={{ fontSize: '2.5rem' }}></i>
                    <h4 className="text-4xl text-center ml-3">
                        Survey completed
                    </h4>
                </div>
                <Button 
                    label='Back to all surveys'
                    onClick={reset}
                />
            </div>
        </div>
    )

    return (
        <div className="w-full h-full py-5">
            <BlockUI 
                blocked={fetching}
                fullScreen 
            />
            <Toast ref={toast} />
            <div className='w-full h-full questionnaire p-5 border-round-2xl flex flex-column shadow-4 '>
                {!isFinished ? (
                    <>
                        <div className="flex flex-column flex-1">
                            {renderQuestions(questionnaireQuestions, page, updateValueHandler)}
                            {isLastPage && (
                                <div className='align-self-end mt-auto mb-3'>
                                    <Button 
                                        label={!fetching ? 'Submit' : 'Loading...'}
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
                ) : finishedLayout}
            </div>
        </div>
    );
};

export default Questionnaire;