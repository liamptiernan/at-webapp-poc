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
    }
}

export interface ProjectsResponse extends AirtableArrayResponse<ProjectsRecord> {}

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
    }
}

export interface ExpensesResponse extends AirtableArrayResponse<ExpenseRecord> {}
export interface ExpenseResponse extends AirtableResponse<ExpenseRecord> {}
