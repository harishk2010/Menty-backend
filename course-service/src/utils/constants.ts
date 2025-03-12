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
export const ChapterErrorMessages = {
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  MISSING_VIDEO_FILE: "Missing required video file.",
  CHAPTER_NOT_FOUND: "Chapter not found.",
  COURSE_ID_REQUIRED: "Course ID is required.",
  CHAPTER_ID_REQUIRED: "Chapter ID is required.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const ChapterSuccessMessages = {
  CHAPTER_ADDED: "Chapter added successfully.",
  CHAPTER_UPDATED: "Chapter updated successfully.",
  CHAPTERS_FETCHED: "Chapters fetched successfully.",
  CHAPTER_FETCHED: "Chapter fetched successfully.",
};

export const CourseErrorMessages = {
  MISSING_FILES: "Missing files.",
  COURSE_NOT_FOUND: "Course not found.",
  COURSE_ID_NOT_FOUND: "CourseId not found.",
  CHAPTERS_NOT_FOUND: "Chapters not found.",
  INSTRUCTOR_ID_REQUIRED: "Instructor ID is required.",
  INVALID_PAGE_OR_LIMIT: "Invalid page or limit value.",
  CHAPTER_ID_REQUIRED: "ChapterId is not provided in the query.",
  ADD_QUIZ_TO_PUBLISH: "Add Quiz to Publish Course!",
  ADD_CHAPTERS_TO_PUBLISH: "Add chapters to Publish Course!",
  NO_COURSE_DATA_FOUND: "No courseData found.",
  INTERNAL_ERROR: "Internal Error.",
  SOMETHING_WENT_WRONG: "Something wrong Please try Later!",
  ERROR_UPDATING_COURSE: "Error updating Course.",
};

export const CourseSuccessMessages = {
  COURSE_CREATED: "Course created successfully.",
  COURSE_UPDATED: "Course updated successfully.",
  COURSE_PUBLISHED: "Course Published",
  COURSE_UNPUBLISHED: "Course UnPublished",
  COURSE_LISTED: "Course Listed",
  COURSE_UNLISTED: "Course unListed",
  COURSE_DELETED: "Course Deleted!",
  COURSES_FETCHED: "Courses fetched successfully.",
  COURSE_FETCHED: "Course fetched successfully.",
  COURSE_CATEGORIES_FETCHED: "Fetched course categories!",
  INSTRUCTOR_COURSES_FETCHED: "User courses fetched!",
  COURSES_DATA_FETCHED: "Fetched courses data successfully",
  BOUGHT_COURSES_FETCHED: "Buyed Courses Got Successfully",
  THANK_YOU_FOR_ENROLLING: "Thank you for Enrolling!",
  CHAPTER_COMPLETED: "Chapter Completed",
  PLAY_DATA_RETRIEVED: "Retrieved play data",
};
export const QuizErrorMessages = {
  NO_COURSE_FOUND: "No course found.",
  NO_USER_FOUND: "No user found.",
  QUIZ_ID_REQUIRED: "Quiz ID is required.",
  COURSE_ID_REQUIRED: "Course ID is required.",
  INVALID_QUIZ_DATA: "Invalid quiz data provided.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const QuizSuccessMessages = {
  QUIZ_ADDED: "Quiz added successfully.",
  QUIZ_UPDATED: "Quiz updated successfully.",
  QUIZ_FETCHED: "Quiz fetched successfully.",
  COURSE_COMPLETED: "Course completed successfully!",
  RETRY_QUIZ: "Retry quiz!",
};
export const ReviewErrorMessages = {
  SOMETHING_WENT_WRONG: "Something Went Wrong.",
  COURSE_ID_REQUIRED: "Course ID is required.",
  ALREADY_REVIEWED:"You have already reviewed this course",
  USER_ID_REQUIRED: "User ID is required.",
  INVALID_REVIEW_DATA: "Invalid review data provided.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const ReviewSuccessMessages = {
  REVIEW_CREATED: "Review created successfully.",
  COURSE_REVIEWS_RETRIEVED: "Course reviews retrieved successfully.",
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

export const InstructorDashboardResponses={
  DASHBOARD_DATA_FETCHED:"Instructor dashboard data retrieved successfully"
}

export const JwtErrorMsg = {
  JWT_NOT_FOUND: "JWT not found in the cookies",
  INVALID_JWT: "Invalid JWT",
  JWT_EXPIRATION: "1h",
  JWT_REFRESH_EXPIRATION: "6h",
};
export const EnvErrorMsg = {
    CONST_ENV: "",
    JWT_NOT_FOUND: "JWT secret not found in the env",
    NOT_FOUND: "Env not found",
    ADMIN_NOT_FOUND: "Environment variables for admin credentials not found",
  };
  