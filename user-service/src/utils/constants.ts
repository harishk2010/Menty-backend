export const MongoDB = {
  SUCCESS: "MongoDB connected",
  ERROR: "MongoDB connection error",
  DB_ERROR:"Error Saving in DB"
};


export const GeneralServerErrorMsg = {
  INTERNAL_SERVER_ERROR: "Internal server error!",
  DATABASE_ERROR: "Database operation failed!",
  OPERATION_FAILED: "Operation could not be completed!",
  UNEXPECTED_ERROR: "An unexpected error occurred!",
  INVALID_SERVICE_CONFIG: "Invalid service configuration",
};
export const SocketErrors={
  INTERNAL_SOCKET_ERROR: "Internal Socket server error!",
  FAILED_TO_REGISTER:"Failed to register socket handlers:",
  SERVER_CLOSED:"Socket.IO server closed",
  SHUTDOWN_ERROR:"Error during shutdown:"

}

export const KafkaSuccess = {
  INITIAISED:"",
  CONSUMER_CONNECTED: "Kafka consumer connected successfully.",
  CONSUMER_MESSAGE_RECEIVED: "Message received and processed successfully.",
  CONSUMER_DISCONNECTED: "Kafka consumer disconnected.",
};
export const KafkaError = {
  CONSUMER_CONNECTION_FAILED: "Failed to connect Kafka consumer.",
  CONSUMER_MESSAGE_PROCESSING_FAILED: "Error processing Kafka message.",
  CONSUMER_ERROR: "Error In Course Consumer",
  PRODUCER_ERROR: "Error In Course Producer",
  CONSUMER_DISCONNECT_FAILED: "Error while disconnecting Kafka consumer.",
  CONSUMER_NO_HANDLER: "No handler defined for the received topic.",
  CONSUMER_EMPTY_MESSAGE: "Received an empty Kafka message.",
};
export const InstructorErrorMessages = {
  INSTRUCTOR_NOT_FOUND: "Instructor not found.",
  INSTRUCTOR_ID_MISSING: "Instructor ID is required.",
  EMAIL_REQUIRED: "Email is required.",
  INVALID_CREDENTIALS: "Invalid credentials provided.",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  TRANSACTIONS_NOT_FOUND: "No transactions found for the instructor.",
  PLAN_PRICE_UPDATE_FAILED: "Failed to update plan price. Please try again.",
  WALLET_UPDATE_FAILED: "Failed to update wallet details.",
  VERIFICATION_FAILED: "Failed to update verification status.",
  BLOCK_FAILED: "Failed to block/unblock instructor.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  FILE_UPLOAD_FAILED: "Failed to upload file. Please try again.",
  INVALID_DATA: "Invalid data provided. Please check your inputs.",
};
export const InstructorSuccessMessages = {
  INSTRUCTOR_CREATED: "Instructor account created successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_UPDATED: "Password updated successfully.",
  PLAN_PRICE_UPDATED: "Plan price updated successfully.",
  WALLET_UPDATED: "Wallet details updated successfully.",
  VERIFICATION_STATUS_UPDATED: "Verification status updated successfully.",
  INSTRUCTOR_BLOCKED: "Instructor blocked successfully.",
  INSTRUCTOR_UNBLOCKED: "Instructor unblocked successfully.",
  TRANSACTIONS_FETCHED: "Transactions fetched successfully.",
  MENTORS_FETCHED: "Mentors fetched successfully.",
  MENTOR_EXPERTISE_FETCHED: "Mentor expertise fetched successfully.",
  PAGINATED_MENTORS_FETCHED: "Paginated mentors fetched successfully.",
  INSTRUCTOR_DATA_FETCHED: "Instructor data fetched successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  REQUEST_APPROVED: "Request approved successfully.",
  REQUEST_REJECTED: "Request rejected successfully.",
  FILE_UPLOADED: "File uploaded successfully.",
};

export const MentorReviewErrorMessages = {
  MENTOR_ID_REQUIRED: "Mentor ID is required.",
  MENTOR_NOT_FOUND: "Mentor not Found!",
  MENTOR_ALREADY_REVIEWED: "Already Reviewed the Mentor",
  USER_ID_REQUIRED: "User ID is required.",
  INVALID_REVIEW_DATA: "Invalid review data provided.",
  REVIEW_CREATION_FAILED: "Failed to create review. Please try again.",
  REVIEWS_NOT_FOUND: "No reviews found for the mentor.",
  AVERAGE_RATING_CALCULATION_FAILED: "Failed to calculate average rating.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
};

export const MentorReviewSuccessMessages = {
  REVIEW_CREATED: "Review created successfully.",
  MENTOR_REVIEWS_FETCHED: "Mentor reviews retrieved successfully.",
  AVERAGE_RATING_FETCHED: "Average rating calculated successfully.",
};

export const StudentErrorMessages = {
  STUDENT_NOT_FOUND: "Student not found.",
  STUDENT_ID_MISSING: "Student ID is required.",
  EMAIL_REQUIRED: "Email is required.",
  INVALID_CREDENTIALS: "Invalid credentials provided.",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  PASSWORD_UPDATE_FAILED: "Failed to update password. Please try again.",
  BLOCK_FAILED: "Failed to block/unblock student.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  FILE_UPLOAD_FAILED: "Failed to upload file. Please try again.",
  INVALID_DATA: "Invalid data provided. Please check your inputs.",
  SEARCH_FAILED: "Failed to search for students. Please try again.",
};
export const StudentSuccessMessages = {
  STUDENT_CREATED: "Student account created successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  PASSWORD_UPDATED: "Password updated successfully.",
  STUDENT_BLOCKED: "Student blocked successfully.",
  STUDENT_UNBLOCKED: "Student unblocked successfully.",
  STUDENT_DATA_FETCHED: "Student data fetched successfully.",
  STUDENTS_FETCHED: "Students fetched successfully.",
  SEARCH_RESULTS_FETCHED: "Search results fetched successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully.",
  FILE_UPLOADED: "File uploaded successfully.",
};

export const VerificationErrorMessages = {
  NO_DOCUMENTS_RECEIVED: "No documents received.",
  DOCUMENTS_MISSING: "Required documents are missing.",
  VERIFICATION_REQUEST_FAILED: "Failed to submit verification request.",
  REVERIFICATION_REQUEST_FAILED: "Failed to submit re-verification request.",
  REQUEST_DATA_NOT_FOUND: "Verification request data not found.",
  ALL_REQUESTS_NOT_FOUND: "No verification requests found.",
  APPROVAL_FAILED: "Failed to approve/reject verification request.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  INVALID_DATA: "Invalid data provided. Please check your inputs.",
  UPLOAD_FAILED: "Failed to upload documents. Please try again.",
};
export const VerificationSuccessMessages = {
  VERIFICATION_REQUEST_SENT: "Verification request sent successfully.",
  REVERIFICATION_REQUEST_SENT: "Re-verification request sent successfully.",
  REQUEST_DATA_FETCHED: "Verification request data fetched successfully.",
  ALL_REQUESTS_FETCHED: "All verification requests fetched successfully.",
  REQUEST_APPROVED: "Verification request approved successfully.",
  REQUEST_REJECTED: "Verification request rejected successfully.",
  INSTRUCTOR_VERIFIED: "Instructor verified successfully.",
  DOCUMENTS_UPLOADED: "Documents uploaded successfully.",
};
export const AuthErrorMsg = {
  NO_ACCESS_TOKEN: "Unauthorized access. Please provide a valid token.",
  NO_REFRESH_TOKEN: "Unauthorized access. Session verification required.",
  INVALID_ACCESS_TOKEN: "Unauthorized access. Please authenticate again.",
  INVALID_REFRESH_TOKEN: "Session verification failed. Please log in again.",
  ACCESS_TOKEN_EXPIRED: "Session expired. Refreshing authentication...",
  REFRESH_TOKEN_EXPIRED: "Session expired. Please log in again.",
  AUTHENTICATION_FAILED: "Authentication failed. Please try again later.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  ACCESS_FORBIDDEN: "You do not have permission to perform this action.",
  TOKEN_EXPIRED_NAME:'TokenExpiredError',
  TOKEN_VERIFICATION_ERROR:"Error verifying token",
};

export const PROFILE_PICTURE="https://freesvg.org/img/abstract-user-flat-4.png"

export const AdminboardResponses={
  DASHBOARD_DATA_FETCHED:"Admin dashboard data retrieved successfully"
}

export const JwtErrorMsg = {
  JWT_NOT_FOUND: "JWT not found in the cookies",
  INVALID_JWT: "Invalid JWT",
  JWT_EXPIRATION: "1h",
  JWT_REFRESH_EXPIRATION: "6h",
};
export const S3BucketErrors={
  ERROR_GETTING_IMAGE:"Error gettting the image from S3 Bucket!",
  NO_FILE:"No file uploaded"
}
export const EnvErrorMsg = {
    CONST_ENV: "",
    JWT_NOT_FOUND: "JWT secret not found in the env",
    NOT_FOUND: "Env not found",
    ADMIN_NOT_FOUND: "Environment variables for admin credentials not found",
  };


  