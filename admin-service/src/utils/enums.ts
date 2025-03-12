export enum StatusCode {
    OK = 200,  // Standard success response
    CREATED = 201,  // Resource created successfully
    BAD_REQUEST = 400,  // Client error (invalid input, missing fields)
    UNAUTHORIZED = 401,  // Authentication required
    NOT_FOUND = 404,  // Resource not found
    CONFLICT = 409,  // Conflict with current state (e.g., duplicate entry)
    INTERNAL_SERVER_ERROR = 500,  // Server error
}


export enum TransactionType{
    DEBITED="debit",
    CREDITED="credit"
}

export enum Roles{
    ADMIN='admin',
    INSTRUCTOR='instructor',
    STUDENT='student'
}