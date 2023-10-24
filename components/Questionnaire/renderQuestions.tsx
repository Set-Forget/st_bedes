import type { Question as QuestionInterface } from '@/shared/types';
import Description from './Description/Description';
import Question from './Question/Question';

// Define the sections for each user type
const studentSections = ['School', 'Academic'];
const parentSections = ['Section A: Safety, Welfare and Personal Development', 'Section B: The quality of education', 'Section C'];

export default function renderQuestions(questions: QuestionInterface[], userType: string | null, updateValue: (value: string | undefined, id: number) => void): React.ReactNode {

    // Determine the sections to use based on the user type
    const sectionsToShow = userType === 'student' ? studentSections : parentSections;

    // Filter the questions based on the sections to show
    const filteredQuestions = questions.filter(question => sectionsToShow.includes(question.section));

    // Render the filtered questions
    return filteredQuestions.map(question => (
        <Question 
            key={question.question_id}
            {...question}
            updateValue={updateValue}
        />
    ));
}
