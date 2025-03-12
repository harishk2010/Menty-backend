

export const MongoDB = {
  SUCCESS: "MongoDB connected",
  ERROR: "MongoDB connection error",
};

export const S3BucketErrors={
    ERROR_GETTING_IMAGE:"Error gettting the image from S3 Bucket!",
    NO_FILE:"No file uploaded"
}
export const AdminErrorMsg = {
  NO_ADMIN_ID: "No user id found",
  NO_ADMIN: "No user found",
  NO_ADMIN_DATA: "User data not found",
  NO_ADMINNAME: "Username not found",
};


export const AdminSuccessMsg = {
    ADMIN_FOUND: "Admin found successfully",
    ADMIN_DATA_FOUND: "Admin data retrieved successfully",

    // ADMIN_CREATED: "Admin account created successfully",
    // ADMIN_UPDATED: "Admin details updated successfully",
    // ADMIN_DELETED: "Admin account deleted successfully",
    // ADMIN_LOGGED_IN: "Admin logged in successfully",
    // PASSWORD_CHANGED: "Admin password changed successfully",
  };
  export const KafkaSuccess = {
    PRODUCER_CONNECTED: "Kafka producer connected successfully.",
    PRODUCER_MESSAGE_SENT: "Message sent successfully to topic.",
    PRODUCER_DISCONNECTED: "Kafka producer disconnected.",
  
    CONSUMER_CONNECTED: "Kafka consumer connected successfully.",
    CONSUMER_MESSAGE_RECEIVED: "Message received and processed successfully.",
    CONSUMER_DISCONNECTED: "Kafka consumer disconnected.",
  };
  export const KafkaError = {
    PRODUCER_CONNECTION_FAILED: "Failed to connect Kafka producer.",
    PRODUCER_MESSAGE_FAILED: "Failed to send message to topic.",
    PRODUCER_DISCONNECT_FAILED: "Error while disconnecting Kafka producer.",
    PRODUCER_ERROR: "Error In Admin Producer",
  
    CONSUMER_CONNECTION_FAILED: "Failed to connect Kafka consumer.",
    CONSUMER_MESSAGE_PROCESSING_FAILED: "Error processing Kafka message.",
    CONSUMER_ERROR: "Error In Admin Consumer",
    CONSUMER_DISCONNECT_FAILED: "Error while disconnecting Kafka consumer.",
    CONSUMER_NO_HANDLER: "No handler defined for the received topic.",
    CONSUMER_EMPTY_MESSAGE: "Received an empty Kafka message.",
  };
    

// export const GeneralErrorMsg = {
//   INVALID_TICK_REQUEST: "Invalid status for the tick request",
//   NO_IMAGE_FILE: "Image File not found",
//   NO_IMAGE_TYPE: "Image type not found",
//   UNEXPECTED_ERROR: "An unexpected error occurred",
//   DUPLICATE_KEY: "Duplicate key error",
//   DUPLICATE_KEY_INDEX: "E11000",
//   TICK_REQUEST_NOT_FOUND: "Tick request data not found.",
//   OTP_ERROR: "Error getting the OTP from database",
//   TIME_LIMIT_EXCEED: "Time limit exceeded",
//   INVALID_OTP: "Invalid OTP",
//   USER_RESTRICTED: "Sorry this user is restricted",
//   SIGN_UP_AGAIN: "Please SignUp again..",
// };

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
    TOKEN_EXPIRED_NAME:'TokenExpiredError'
};

export const GeneralServerErrorMsg = {
    INTERNAL_SERVER_ERROR: "Internal server error!",
    DATABASE_ERROR: "Database operation failed!",
    OPERATION_FAILED: "Operation could not be completed!",
    UNEXPECTED_ERROR: "An unexpected error occurred!",
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
  

export const CategorySuccessMsg = {
    CATEGORY_ADDED: "Category added successfully!",
    CATEGORY_UPDATED: "Category updated successfully!",
    CATEGORY_FETCHED: "Fetched categories successfully!",

    CATEGORY_FOUND: "Category found successfully!",
    CATEGORY_LISTED: "Category listed successfully!",
    CATEGORY_UNLISTED: "Category unlisted successfully!",
  };
  
  export const CategoryErrorMsg = {
    CATEGORY_EXISTS: "Category already exists!",
    CATEGORY_NOT_UPDATED: "Category not updated!",

    CATEGORY_NOT_FOUND: "Category not found!",
    CATEGORY_NOT_CREATED: "Could not create category!",
    CATEGORY_NOT_FETCHED: "Could not fetch categories!",
    CATEGORY_LISTING_FAILED: "Failed to list/unlist category!",
    INTERNAL_SERVER_ERROR: "Internal server error!",
  };



// // OTP and Profile Constants
// export const OTP_TIME_LIMIT = 60; // in seconds
// export const OTP_EXPIRY_TIME = 60 * 1000; // OTP expiry time in milliseconds
// export const TEMP_PASSWORD = "tempPassword"; // temporary password for Google sign-in

// // Default Profile Pictures
// export const DEFAULT_PROFILE_PIC_MALE = "/img/DefaultProfilePicMale.png";
// export const DEFAULT_PROFILE_PIC_FEMALE = "/img/DefaultProfilePicFemale.png";

// // Email and Password Reset Constants
// export const PASSWORD_RESET_SUBJECT = "Password Reset";
// export const PASSWORD_RESET_EMAIL_TEMPLATE = "newPassword"; 

// // Error Messages
// export const RESTRICTED_USER_ERROR_MSG = "Sorry, this user is restricted";
// export const INVALID_CREDENTIALS_MSG = "Please enter valid credentials";
// export const PASSWORD_CHANGED_MSG = "Password changed successfully";
// export const EMAIL_NOT_FOUND_MSG = "Email not found";
// export const OTP_SENT_MSG = "OTP sent successfully";