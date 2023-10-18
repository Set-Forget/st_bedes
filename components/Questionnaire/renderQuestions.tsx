import type { Question as QuestionInterface } from '@/shared/types';
import Description from './Description/Description';
import Question from './Question/Question';

export default function renderQuestions(questions: QuestionInterface[], page: number, updateValue: (value: string | undefined, id: number) => void): React.ReactNode {

    return questions.map(question => {

        return (
            <Question 
                key={question.question_id}
                {...question}
                updateValue={updateValue}
            />
        )

        // if(component.page! === page) {
        //     if(component.type === 'description') {
        //         return (
        //             <Description key={index}>
        //                 {component.title}
        //             </Description>
        //         )
        //     }
    
        //     if(component.type === 'open-question' || component.type === 'options') {
        //         return (
        //             <Question 
        //                 key={index}
        //                 {...component}
        //                 updateValue={updateValue}
        //             />
        //         )
        //     }
        // }

        // return null;
    });

}