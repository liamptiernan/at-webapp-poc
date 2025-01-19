type AirtableArrayResponse<T> = {
    data: {
        records: T[];
    }
}

type AirtableResponse<T> = {
    data: T;
}

export interface ProjectsRecord {
    id: string;
    fields: {
        Name: string;
        Status?: string;
        "Youtube Link"?: string;
        Expenses?: unknown[];
        "Publish Date"?: string;
        "Actualized"?: boolean;
    }
}

export type ProjectsResponse = AirtableArrayResponse<ProjectsRecord>

export const unitOptions = [
    "Day",
    "Hour",
    "Week",
]

export interface ExpenseRecord {
    id: string;
    fields: {
        Description: string;
        Actualized?: boolean;
        "Unit Amount"?: number;
        Unit?: string;
        Quantity?: number;
        Total?: number;
        Project: string[];
        "Actual Total"?: number;
    }
}

export type ExpensesResponse = AirtableArrayResponse<ExpenseRecord>;
export type ExpenseResponse = AirtableResponse<ExpenseRecord>
