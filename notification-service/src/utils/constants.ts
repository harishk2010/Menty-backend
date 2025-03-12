export const GeneralServerErrorMsg = {
  INTERNAL_SERVER_ERROR: "Internal server error!",
  DATABASE_ERROR: "Database operation failed!",
  OPERATION_FAILED: "Operation could not be completed!",
  UNEXPECTED_ERROR: "An unexpected error occurred!",
  INVALID_SERVICE_CONFIG: "Invalid service configuration",
};

export const KafkaSuccess = {
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
