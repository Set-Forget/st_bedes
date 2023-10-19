import React, { useEffect, useState, useMemo, useCallback } from 'react';

import Layout from '@/components/Layout/Layout';

import Questionnaire from '@/components/Questionnaire/Questionnaire';

import fetchApi from '@/shared/fetchApi';
import SelectSurvey from '@/components/SelectSurvey/SelectSurvey';
import TeacherList from '@/components/TeacherList/TeacherList';
import Knob from '@/components/Knob/Knob';
import LoadingScreen from '@/components/Questionnaire/LoadingScreen/LoadingScreen';
import { Question, Questionnaire as QuestionnaireInterface } from '@/shared/types';
import SelectSurveyType from '@/components/SelectSurveyType/SelectSurveyType';
import { useAuth } from '@/context/authContext';

export type QuestionnaireStep = 'preparing-questions' | 'selecting' | 'answering' | 'finished';

type SurveyType = null | 'pending' | 'finished';
type SelectingType = 'subject' | 'child' | 'teacher';

export type QuestionnaireKnobType = 'overall' | 'questionnaire';

const QUESTIONS = [
    {
        "set_id": 3937,
        "student_id": 7351,
        "teacher_id": 121,
        "question_id": 1,
        "teacher_full_name": "Steffan Morgan",
        "subject_name": "Business",
        "section": "Academic",
        "content": "I feel I understand the subject and learn something in each lesson",
        "title": "Progress",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3937,
        "student_id": 7351,
        "teacher_id": 121,
        "question_id": 2,
        "teacher_full_name": "Steffan Morgan",
        "subject_name": "Business",
        "section": "Academic",
        "content": "I find homework is worthwhile and helps me become more confident in the subject",
        "title": "Homework",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3937,
        "student_id": 7351,
        "teacher_id": 121,
        "question_id": 3,
        "teacher_full_name": "Steffan Morgan",
        "subject_name": "Business",
        "section": "Academic",
        "content": "My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve.",
        "title": "Feedback",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3937,
        "student_id": 7351,
        "teacher_id": 121,
        "question_id": 4,
        "teacher_full_name": "Steffan Morgan",
        "subject_name": "Business",
        "section": "Academic",
        "content": "I feel I get enough support and I know where to go to get extra help.",
        "title": "Support",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3937,
        "student_id": 7351,
        "teacher_id": 121,
        "question_id": 5,
        "teacher_full_name": "Steffan Morgan",
        "subject_name": "Business",
        "section": "Academic",
        "content": "Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence.",
        "title": "Love of Learning",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3956,
        "student_id": 7351,
        "teacher_id": 723,
        "question_id": 1,
        "teacher_full_name": "Jenni Di Paola",
        "subject_name": "Spanish",
        "section": "Academic",
        "content": "I feel I understand the subject and learn something in each lesson",
        "title": "Progress",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3956,
        "student_id": 7351,
        "teacher_id": 723,
        "question_id": 2,
        "teacher_full_name": "Jenni Di Paola",
        "subject_name": "Spanish",
        "section": "Academic",
        "content": "I find homework is worthwhile and helps me become more confident in the subject",
        "title": "Homework",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3956,
        "student_id": 7351,
        "teacher_id": 723,
        "question_id": 3,
        "teacher_full_name": "Jenni Di Paola",
        "subject_name": "Spanish",
        "section": "Academic",
        "content": "My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve.",
        "title": "Feedback",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3956,
        "student_id": 7351,
        "teacher_id": 723,
        "question_id": 4,
        "teacher_full_name": "Jenni Di Paola",
        "subject_name": "Spanish",
        "section": "Academic",
        "content": "I feel I get enough support and I know where to go to get extra help.",
        "title": "Support",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3956,
        "student_id": 7351,
        "teacher_id": 723,
        "question_id": 5,
        "teacher_full_name": "Jenni Di Paola",
        "subject_name": "Spanish",
        "section": "Academic",
        "content": "Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence.",
        "title": "Love of Learning",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 3957,
        "student_id": 7351,
        "teacher_id": 52,
        "question_id": 1,
        "teacher_full_name": "Suzanne Dittman",
        "subject_name": "Art",
        "section": "Academic",
        "content": "I feel I understand the subject and learn something in each lesson",
        "title": "Progress",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": true
    },
    {
        "set_id": 3957,
        "student_id": 7351,
        "teacher_id": 52,
        "question_id": 2,
        "teacher_full_name": "Suzanne Dittman",
        "subject_name": "Art",
        "section": "Academic",
        "content": "I find homework is worthwhile and helps me become more confident in the subject",
        "title": "Homework",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": true
    },
    {
        "set_id": 3957,
        "student_id": 7351,
        "teacher_id": 52,
        "question_id": 3,
        "teacher_full_name": "Suzanne Dittman",
        "subject_name": "Art",
        "section": "Academic",
        "content": "My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve.",
        "title": "Feedback",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": true
    },
    {
        "set_id": 3957,
        "student_id": 7351,
        "teacher_id": 52,
        "question_id": 4,
        "teacher_full_name": "Suzanne Dittman",
        "subject_name": "Art",
        "section": "Academic",
        "content": "I feel I get enough support and I know where to go to get extra help.",
        "title": "Support",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": true
    },
    {
        "set_id": 3957,
        "student_id": 7351,
        "teacher_id": 52,
        "question_id": 5,
        "teacher_full_name": "Suzanne Dittman",
        "subject_name": "Art",
        "section": "Academic",
        "content": "Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence.",
        "title": "Love of Learning",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": true
    },
    {
        "set_id": 4224,
        "student_id": 7351,
        "teacher_id": 129,
        "question_id": 1,
        "teacher_full_name": "Hannah Park",
        "subject_name": "Art 10 week",
        "section": "Academic",
        "content": "I feel I understand the subject and learn something in each lesson",
        "title": "Progress",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 4224,
        "student_id": 7351,
        "teacher_id": 129,
        "question_id": 2,
        "teacher_full_name": "Hannah Park",
        "subject_name": "Art 10 week",
        "section": "Academic",
        "content": "I find homework is worthwhile and helps me become more confident in the subject",
        "title": "Homework",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 4224,
        "student_id": 7351,
        "teacher_id": 129,
        "question_id": 3,
        "teacher_full_name": "Hannah Park",
        "subject_name": "Art 10 week",
        "section": "Academic",
        "content": "My teacher gives me regular feedback (either verbal or written) and I know what I need to do to improve.",
        "title": "Feedback",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 4224,
        "student_id": 7351,
        "teacher_id": 129,
        "question_id": 4,
        "teacher_full_name": "Hannah Park",
        "subject_name": "Art 10 week",
        "section": "Academic",
        "content": "I feel I get enough support and I know where to go to get extra help.",
        "title": "Support",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    },
    {
        "set_id": 4224,
        "student_id": 7351,
        "teacher_id": 129,
        "question_id": 5,
        "teacher_full_name": "Hannah Park",
        "subject_name": "Art 10 week",
        "section": "Academic",
        "content": "Even if lessons are difficult or I don't like what we are learning about, the teacher inspires me and I grow in confidence.",
        "title": "Love of Learning",
        "type": "select",
        "options": "['Agree','Not sure','Disagree']",
        "is_answered": false
    }
];

// NEED: student that have multiple teachers of one subject

const Home = () => {

    const { user, userType } = useAuth();

    // 1) school pgoress and teacher progress when questionnaire is not started
    // 2) questionnaire progress when its started

    const [ step, setStep ] = useState<QuestionnaireStep>('preparing-questions');
    const [ selectingStep, setSelectingStep ] = useState<null | SelectingType>(null);
    const [ selectedSurveyType, setSelectedSurveyType ] = useState<SurveyType>(null);

    const [ questions, setQuestions ] = useState<Question[]>(QUESTIONS as Question[]);
    const [ pendingQuestions, setPendingQuestions ] = useState<Question[]>([]);
    const [ answeredQuestions, setAnsweredQuestions ] = useState<Question[]>([]);

    const [ selectedSubject, setSelectedSubject ] = useState<null | string>(null); // for student
    const [ selectedChild, setSelectedChild ] = useState<null | string>(null); // for parent
    const [ selectedTeacher, setSelectedTeacher ] = useState<null | string>(null); // for student

    const getQuestions = useCallback(async () => { // get questions from server, called only once

        if(!user || !userType) return;

        const url = userType === 'student' ? `?action=getStudentQuestion&studentId=${user.student_id}` /* 4415 */ : 
        `?action=getParentQuestion&parentId=${user.parent_id}`; // 20590

        const json = await fetchApi(url, {
            method: 'GET'
        });

        const questions = json.response.questions;      

        setQuestions(questions);

        setStep('selecting');

    }, [ user, userType ]);

    useEffect(() => {
        // getQuestions();
        setStep('selecting');
    }, [ getQuestions ]);


    useEffect(() => { // modify questions based on is_answered field, updated when questionnaire is finished

        const pendingQuestions: Question[] = [];
        const answeredQuestions: Question[] = [];

        questions.forEach(question => {
            if(question.is_answered) {
                answeredQuestions.push(question);
            } else {
                pendingQuestions.push(question);
            }
        });

        setPendingQuestions(pendingQuestions);
        setAnsweredQuestions(answeredQuestions);

    }, [ questions ]);

    const updateCompletedQuestion = useCallback((questionToMove: Question) => { // update list of questions that are successfully answered

        setPendingQuestions((prevPendingQuestions) =>
            prevPendingQuestions.filter((question) => {
                // Check if the current question matches the criteria
                return !Object.keys(questionToMove).every(
                    (key) => {
                        // @ts-expect-error
                        return question[key] === questionToMove[key]
                    }
                );
            })
        );

        // Update the is_answered property to true before moving
        const updatedQuestionToMove: Question = { ...questionToMove, is_answered: true, value: '' };

        // Add the updated question to answeredQuestions
        setAnsweredQuestions((prevAnsweredQuestions) => [
            ...prevAnsweredQuestions,
            updatedQuestionToMove,
        ]);

    }, [  ]);

    const makeQuestionnaire = useCallback((questions: Question[]) => {
        const questionnaire: QuestionnaireInterface = {};

        questions.forEach((obj: Question) => {
            const key = userType === 'student' ? obj.subject_name! : obj.student_full_name!;
            
            if (!questionnaire[key]) {
                questionnaire[key] = [];
            }
            
            questionnaire[key].push(obj);
        });

        return questionnaire;
    }, [ userType ]);

    const selectPendingSurveys = useCallback(() => {
        setSelectedSurveyType('pending');
        setSelectingStep(userType === 'parent' ? 'child' : 'subject');
    }, [ userType ]);

    const selectAnsweredSurveys = useCallback(() => {
        setSelectedSurveyType('finished');
        setSelectingStep(userType === 'parent' ? 'child' : 'subject');
    }, [ userType ]);

    const selectSubjectHandler = useCallback((value: string) => {
        setSelectedSubject(value);
        setStep('selecting');
        setSelectingStep('teacher');
        // setStep('selecting-teacher');
    }, []);

    const selectChildHandler = useCallback((value: string) => {
        setSelectedChild(value);
        setStep('answering');
    }, []);

    const selectTeacherHandler = useCallback((value: string) => {
        setSelectedTeacher(value);
        setStep('answering');
    }, []);

    const resetHandler = useCallback(() => {
        setSelectedTeacher(null);
        setSelectedSubject(null);
        setSelectedChild(null);
        setSelectedSurveyType(null);
        setStep('selecting');
    }, []);

    const getHeaderTitle = useCallback(() => {

        switch(step) {
            case 'preparing-questions':
                return 'Home';
            case 'selecting':
                if(selectedSurveyType === 'pending') return 'Pending Surveys';
                if(selectedSurveyType === 'finished') return 'Finished Surveys';
                return 'Home';
            // case 'selecting-teacher':
            //     return `${selectedSubject} Surveys`;
            case 'answering': case 'finished':
                if(userType === 'student') return `${selectedTeacher} Survey`;
                if(userType === 'parent') return `${selectedChild} Survey`;
        }
    
        return ``;
    }, [ step, selectedSurveyType, userType, selectedTeacher, selectedChild ]);

    const getFooterTitle = useCallback(() => {
        switch(step) {
            case 'preparing-questions':
                return null;
            case 'selecting':
                if(!selectedSurveyType) return null;

                if(selectingStep === 'teacher') {
                    return 'Back to subjects';
                } 

                return 'Back to home';
                
            case 'answering':
                if(selectingStep === 'teacher') {
                    return 'Back to teachers';
                } else if (selectingStep === 'child') {
                    return 'Back to children';
                }
            case 'finished':
                return null;
        }
    }, [ step, selectingStep, selectedSurveyType ]);

    const getFooterAction = useCallback(() => {
        switch(step) {
            case 'preparing-questions':
                return () => false;
            case 'selecting':

                if(selectingStep === 'subject') {
                    return () => {
                        setSelectingStep(null);
                        setSelectedSurveyType(null);
                    }
                }

                if(selectingStep === 'teacher') {
                    return () => {
                        setSelectingStep('subject');
                        setSelectedSubject(null);
                    }
                } 

                if(selectingStep === 'child') {
                    return () => {
                        setSelectingStep(null);
                        setSelectedSurveyType(null);
                    }
                }

                
            case 'answering':
                if(selectingStep === 'teacher') {
                    return () => { // student
                        setStep('selecting');
                        setSelectingStep('teacher');
                        setSelectedTeacher(null);
                    };
                } else if (selectingStep === 'child') {
                    return () => {
                        setStep('selecting');
                        setSelectingStep('child');
                        setSelectedChild(null);
                    }
                }
            case 'finished':
                return () => false;
        }
    }, [ step, selectingStep ]);

    const headerTitle = getHeaderTitle(), footerTitle = getFooterTitle(), footerAction = getFooterAction();

    const [ questionnaireProgressPercentage, setQuestionnaireProgressPercentage ] = useState(0);
    const [ schoolProgressPercentage, setSchoolProgressPercentage ] = useState(0);
    const [ teacherProgressPercentage, setTeacherProgressPercentage ] = useState(0);

    const layout = useMemo(() => {

        const questions = selectedSurveyType === 'finished' ? answeredQuestions : pendingQuestions;

        const questionnaireQuestions = [...questions].filter(question => {
            if(userType === 'student') {
                return question.teacher_full_name === selectedTeacher;
            } else {
                return question.student_full_name === selectedChild;
            }
        });

        switch(step) {
            case 'preparing-questions':
                return <LoadingScreen />;
            case 'selecting':
                if(!selectedSurveyType) {
                    return (
                        <SelectSurveyType 
                            finished={selectAnsweredSurveys}
                            pending={selectPendingSurveys}
                        />
                    )
                } else {

                    const questionnaire = makeQuestionnaire(questions);

                    if(selectingStep === 'teacher') {
                        return (
                            <TeacherList 
                                questionnaire={questionnaire}
                                selectedSubject={selectedSubject!}
                                selectTeacherHandler={selectTeacherHandler}
                            />
                        )
                    } else {
                        return (
                            <SelectSurvey 
                                questionnaire={questionnaire}
                                emptyMessage={selectedSurveyType === 'finished' ? 'You dont have pending surveys.' : 'You dont have pending surveys.'}
                                selectHandler={userType === 'student' ? selectSubjectHandler : selectChildHandler}
                            />
                        )
                    }
                    
                }
            case 'answering': case 'finished':
                return (
                    <Questionnaire 
                        questions={questionnaireQuestions}
                        isAnswered={selectedSurveyType === 'finished'}
                        updateCompletedQuestion={updateCompletedQuestion}
                        updateProgress={setQuestionnaireProgressPercentage}
                        isFinished={step === 'finished'}
                        finish={() => setStep('finished')}
                        reset={resetHandler}
                    />
                )
        }
    }, [ 
        selectedSurveyType,
        answeredQuestions,
        pendingQuestions,
        step,
        selectAnsweredSurveys,
        selectPendingSurveys,
        makeQuestionnaire,
        selectingStep,
        selectedSubject,
        selectTeacherHandler,
        userType,
        selectSubjectHandler,
        selectChildHandler,
        resetHandler,
        updateCompletedQuestion,
        selectedChild,
        selectedTeacher
    ]);

    const getKnob = useMemo(() => {

        if(step === 'answering' || step === 'finished') {
            return (
                <Knob 
                    title='Survey progress'
                    value={questionnaireProgressPercentage} 
                />
            )
        } else {
            return (
                <>
                    <Knob 
                        title='School progress'
                        value={schoolProgressPercentage}
                        className='mr-5'
                    />
                    <Knob 
                        title='Teacher progress'
                        value={teacherProgressPercentage}
                    />
                </>
            )
        }


    }, [ step, questionnaireProgressPercentage, schoolProgressPercentage, teacherProgressPercentage ]);

    return (
        <Layout 
            knob={getKnob}
            headerTitle={headerTitle}
            footerTitle={footerTitle}
            footerAction={footerAction}
        >
            <div className="h-full flex align-items-center">
                {layout}
            </div>
        </Layout>
    );
};

export default Home;