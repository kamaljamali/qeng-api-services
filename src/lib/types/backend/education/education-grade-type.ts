import { FieldOfStudyType } from "./field-of-study-type";

/**
 * EducationGradeType
 */
export type EducationGradeType = {
    code: string;
    name: string;
    fieldOfStudy?: Array<FieldOfStudyType>;
};
