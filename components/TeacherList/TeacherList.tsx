import React from 'react';

import Selector from '@/components/Selector/Selector';
import { Question, Questionnaire } from '@/shared/types';

interface Props {
    questionnaire: Questionnaire
    selectedSubject: string
    selectTeacherHandler: (value: string) => void
}

const TeacherList: React.FC<Props> = ({ questionnaire, selectedSubject, selectTeacherHandler }) => {

    const data = questionnaire[selectedSubject];

    const teacherData: Record<string, Question[]> = {};

    // Check if data is defined before iterating over it
    if (data && Array.isArray(data)) {
        data.forEach((obj) => {
            const key = obj.teacher_full_name!;
          
            if (!teacherData[key]) {
              teacherData[key] = [];
            }
          
            teacherData[key].push(obj);
        });
    } else {
        console.error(`No data found for subject: ${selectedSubject}`);
    }

    return (
        <div className="py-8 w-full flex justify-content-between align-items-center">
            <Selector 
                title={`${selectedSubject} Survey`}
                width={50}
                className='mb-5'
            />
            <div className="flex flex-column flex-wrap">
                {Object.keys(teacherData)
                .filter(teacher => teacher && teacherData[teacher])
                .map(teacher => {
                    return (
                        <Selector 
                            key={teacher}
                            title={teacher}
                            width={100}
                            hover
                            className='mb-5'
                            onClick={() => selectTeacherHandler(teacher)}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default TeacherList;
