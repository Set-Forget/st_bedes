// type ComponentType = 'open-question' | 'options' | 'description' | 'break'

// export interface Component {
//     type: ComponentType
//     title?: string
//     page?: number
//     id?: number
//     value?: string
//     error?: boolean
// }

// export interface Question extends Component {
//     options?: string[]
//     value?: string
//     error?: boolean
// }

export interface Question {
    content: string
    options: string
    question_id: number
    section: string
    set_id: number
    subject_name?: string // only student
    student_full_name?: string // only parent
    student_id?: number // only parent
    teacher_full_name?: string // only student
    teacher_id?: number // only student
    title: string | null
    type: "select" | "text"
    is_answered: boolean

    value?: string
    error?: boolean
}

export interface Questionnaire {
    [key: string]: Question[]
}

// interface Description extends Component {

// }

// interface Break extends Component {

// }

// type QuestionnaireComponent = Question | Description | Break

// export interface Questionnaire {
//     name: string
//     components: QuestionnaireComponent[]
// }

export interface User {
    student_id?: number
    parent_id?: number
    full_name: string
}