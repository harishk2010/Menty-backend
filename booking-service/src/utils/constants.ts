import { CANCELLED } from "dns";

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


export const KafkaSuccess = {
  INITIAISED:"",
  CONSUMER_CONNECTED: "Kafka consumer connected successfully.",
  CONSUMER_MESSAGE_RECEIVED: "Message received and processed successfully.",
  CONSUMER_DISCONNECTED: "Kafka consumer disconnected.",
};
export const KafkaError = {
  PRODUCER_CONNECTION_FAILED: "Failed to connect Kafka producer.",
  PRODUCER_MESSAGE_FAILED: "Failed to send message to topic.",
  PRODUCER_DISCONNECT_FAILED: "Error while disconnecting Kafka producer.",
  PRODUCER_ERROR: "Error In Admin Producer",
};
export const BookingSuccessMessages = {
  SLOT_BOOKED: "Slot booked successfully.",
  STUDENT_BOOKINGS_FETCHED: "Student bookings retrieved successfully.",
  INSTRUCTOR_BOOKINGS_FETCHED: "Instructor bookings retrieved successfully.",
  BOOKING_DETAILS_FETCHED: "Booking details retrieved successfully.",
};
export const BookingErrorMessages = {
  SLOT_ALREADY_BOOKED: "This slot is already booked. Please select a different one.",
  INVALID_STUDENT_ID: "Invalid or missing student ID.",
  INVALID_INSTRUCTOR_ID: "Invalid or missing instructor ID.",
  INVALID_BOOKING_ID: "Invalid or missing booking ID.",
  BOOKING_NOT_FOUND: "No booking found for the given ID.",
  FETCH_BOOKINGS_FAILED: "Failed to fetch bookings. Please try again later.",
  BOOKING_CREATION_FAILED: "Failed to create a booking. Please try again.",
};
export const SlotSuccessMessages = {
  SLOTS_CREATED: "Slots created successfully.",
  INSTRUCTOR_SLOTS_FETCHED: "Instructor slots retrieved successfully.",

  SLOT_DELETED: "Slot deleted successfully.",
  SLOT_FETCHED: "Slot retrieved successfully.",
};
export const SlotErrorMessages = {
  INVALID_INSTRUCTOR_ID: "Invalid or missing instructor ID.",

  INVALID_SLOT_ID: "Invalid or missing slot ID.",
  SLOT_NOT_FOUND: "No slot found for the given ID.",
  FETCH_SLOTS_FAILED: "Failed to fetch slots. Please try again later.",
  SLOT_CREATION_FAILED: "Failed to create slots. Please try again.",
  SLOT_DELETION_FAILED: "Failed to delete slot. Please try again.",
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

  export const UserErrorMsg = {
      NO_USER_ID: "No user id found",
      NO_USER: "No user found",
      NO_USER_DATA: "User data not found",
      NO_USERNAME: "Username not found",
    };
  



    export const BookingStatus={
      CONFIRMED:"confirmed",
      CANCELLED: "cancelled"
    }