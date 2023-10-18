import React, { useEffect, useState, useMemo } from 'react';

import Layout from '@/components/Layout/Layout';

import Questionnaire from '@/components/Questionnaire/Questionnaire';

import fetchApi from '@/shared/fetchApi';
import SubjectChildrenList from '@/components/SubjectChildrenList/SubjectChildrenList';
import TeacherList from '@/components/TeacherList/TeacherList';
import LoadingScreen from '@/components/Questionnaire/LoadingScreen/LoadingScreen';
import { Question, Questionnaire as QuestionnaireInterface } from '@/shared/types';
import SelectSurvey from '@/components/SelectSurvey/SelectSurvey';
import { useAuth } from '@/context/authContext';

export type QuestionnaireStep = 'preparing-questions' | 'selecting-subject-child' | 'selecting-teacher' | 'answering' | 'finished';
type SelectedSurveyType = null | 'pending' | 'finished';
export type QuestionnaireKnobType = 'overall' | 'questionnaire';

const Home = () => { 

    const { user, userType } = useAuth();

    // 1) school pgoress and teacher progress when questionnaire is not started
    // 2) questionnaire progress when its started

    const [ step, setStep ] = useState<QuestionnaireStep>('preparing-questions');
    const [ selectedSurveys, setSelectedSurveys ] = useState<SelectedSurveyType>(null);
    const [ questionnaire, setQuestionnaire ] = useState<null | QuestionnaireInterface>(null);
    const [ selectedSubject, setSelectedSubject ] = useState<null | string>(null); // for student
    const [ selectedChild, setSelectedChild ] = useState<null | string>(null); // for parent
    const [ selectedTeacher, setSelectedTeacher ] = useState<null | string>(null); // for student
    const [ knobType, setKnobType ] = useState<QuestionnaireKnobType>('overall');
    const [ schoolProgressPercentage, setSchoolProgressPercentage ] = useState(0);
    const [ teacherProgressPercentage, setTeacherProgressPercentage ] = useState(0);
    const [ questionnaireProgressPercentage, setQuestionnaireProgressPercentage ] = useState(0);

    console.log(questionnaire)

    useEffect(() => {
        setKnobType((step === 'answering' || step === 'finished') ? 'questionnaire' : 'overall');
    }, [ step ]);

    useEffect(() => {
        if(!user || !userType) return;

        const getData = async () => {

            const url = userType === 'student' ? `?action=getStudentQuestion&studentId=${user.student_id}` /* 4415 */ : 
            `?action=getParentQuestion&parentId=${user.parent_id}`; // 20590

            const json = await fetchApi(url, {
                method: 'GET'
            });

            const questions = json.response.questions;

            const subjectData: QuestionnaireInterface = {};

            questions.forEach((obj: Question) => {
                const key = userType === 'student' ? obj.subject_name! : obj.student_full_name!;
              
                if (!subjectData[key]) {
                  subjectData[key] = [];
                }
              
                subjectData[key].push(obj);
            });

            setQuestionnaire(subjectData);
        }

        if(!questionnaire) getData();
    }, [ questionnaire, user, userType ]);

    useEffect(() => {
        if(!questionnaire) return;
        setStep('selecting-subject-child');
        // if(userType === 'parent') setSelectedSurveys('pending');
    }, [ questionnaire ]);

    const headerTitle = () => {
        switch(step) {
            case 'preparing-questions':
                return 'Home';
            case 'selecting-subject-child':
                if(selectedSurveys === 'pending') return 'Pending Surveys';
                if(selectedSurveys === 'finished') return 'Finished Surveys';
                return 'Home';
            case 'selecting-teacher':
                return `${selectedSubject} Surveys`;
            case 'answering': case 'finished':
                if(userType === 'student') return `${selectedTeacher} Survey`;
                if(userType === 'parent') return `${selectedChild} Survey`;
        }
    }

    const getFooterTitle = (step: QuestionnaireStep, type: SelectedSurveyType, userType: 'student' | 'parent') => {
        switch(step) {
            case 'preparing-questions':
                return null;
            case 'selecting-subject-child':
                if(!type) return null;
                return 'Back to Home';
            case 'selecting-teacher':
                return 'Back to pending';
            case 'answering':
                return 'Back to teachers';
            case 'finished':
                return null;
        }
    }

    const footerTitle = getFooterTitle(step, selectedSurveys, userType!);

    const footerAction = () => {
        switch(step) {
            case 'preparing-questions':
                return () => false;
            case 'selecting-subject-child': 
                const fn = () => {
                    if(selectedSurveys) setSelectedSurveys(null);
                }
                return fn;
            case 'selecting-teacher':
                return () => setStep('selecting-subject-child')
            case 'answering': case 'finished':
                return () => setStep('selecting-teacher')
        }
    }

    const selectSubjectHandler = (value: string) => {
        setSelectedSubject(value);
        setStep('selecting-teacher');
    }

    const selectChildHandler = (value: string) => {
        setSelectedChild(value);
        setStep('answering');
    }

    const selectTeacherHandler = (value: string) => {
        setSelectedTeacher(value);
        setStep('answering');
    }

    const resetHandler = () => {
        setSelectedTeacher(null);
        setSelectedSubject(null);
        setSelectedChild(null);
        setStep('selecting-subject-child');
    }

    const getQuestions: Question[] = useMemo(() => {

        if(userType === 'student') {
            if(!selectedSubject && !selectedTeacher) return [];

            return questionnaire![selectedSubject!].filter(question => question.teacher_full_name === selectedTeacher);
        }

        if(userType === 'parent') {
            if(!selectedChild) return [];

            return questionnaire![selectedChild].filter(question => question.student_full_name === selectedChild);
        }

        return [];
        
    }, [ userType, questionnaire, selectedSubject, selectedTeacher, selectedChild ]);

    const layout = useMemo(() => {
        switch(step) {
            case 'preparing-questions':
                return <LoadingScreen />;

            case 'selecting-subject-child':
                if(!selectedSurveys) {
                    return (
                        <SelectSurvey 
                            pending={() => setSelectedSurveys('pending')}
                        />
                    )
                } else {
                    return (
                        <SubjectChildrenList 
                            questionnaire={questionnaire!} 
                            selectHandler={userType === 'student' ? selectSubjectHandler : selectChildHandler}
                        />
                    )
                }
            case 'selecting-teacher':
                return (
                    <TeacherList 
                        questionnaire={questionnaire!}
                        selectedSubject={selectedSubject!}
                        selectTeacherHandler={selectTeacherHandler}
                    />
                )

            case 'answering': case 'finished':
                return (
                    <Questionnaire 
                        questions={getQuestions}
                        updateProgress={setQuestionnaireProgressPercentage}
                        isFinished={step === 'finished'}
                        finish={() => setStep('finished')}
                        reset={resetHandler}
                    />
                )
        }
    }, [ getQuestions, questionnaire, selectedSurveys, selectedSubject, step, userType ]);

    return (
        <Layout 
            knobType={knobType}
            schoolProgressPercentage={schoolProgressPercentage}
            teacherProgressPercentage={teacherProgressPercentage}
            questionnaireProgressPercentage={questionnaireProgressPercentage}
            headerTitle={headerTitle()!}
            footerTitle={footerTitle}
            footerAction={footerAction()}
        >
            <div className="h-full flex align-items-center">
                {layout}
            </div>
        </Layout>
    );
};

Home.authGuard = true;

export default Home;