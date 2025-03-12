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
  CONSUMER_ERROR: "Error In Admin Consumer",
  CONSUMER_DISCONNECT_FAILED: "Error while disconnecting Kafka consumer.",
  CONSUMER_NO_HANDLER: "No handler defined for the received topic.",
  CONSUMER_EMPTY_MESSAGE: "Received an empty Kafka message.",
};
export const ChatSuccessMessages = {
  CHAT_CREATED: "Chat created successfully.",
  CHAT_FETCHED: "Chat retrieved successfully.",
  CHAT_HISTORY_FETCHED: "Chat history retrieved successfully.",
  IMAGE_UPLOADED: "Image uploaded successfully.",
};


export const ChatErrorMessages = {
  CHAT_CREATION_FAILED: "Failed to create chat. Please try again later.",
  CHAT_NOT_FOUND: "Chat not found for the given booking ID.",
  CHAT_FETCH_FAILED: "Failed to fetch chat. Please try again later.",
  CHAT_HISTORY_FETCH_FAILED: "Failed to fetch chat history. Please try again later.",
  IMAGE_UPLOAD_FAILED: "Image upload failed. Please check the file format and size.",
  IMAGE_PROCESSING_FAILED: "Error processing the uploaded image. Please try again.",
  CREATE_BOOKING_FAILED: "Error creating Booking.",
  FILE_NOT_UPLOADED: "No file uploaded. Please attach an image.",
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
  