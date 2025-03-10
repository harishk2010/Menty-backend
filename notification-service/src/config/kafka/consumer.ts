import notificatinController from "../dependencyInjection";
import kafka from "./kafkaConfig";

async function consume() {
  const consumer = kafka.consumer({ groupId: "notification-service" });

  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "send-otp-email",
        "send-forgotPassword-email",
        "verified-Instructor-email",
      ],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const messageValue = message.value
            ? JSON.parse(message.value.toString())
            : null;

          if (!messageValue) {
            console.warn(`Empty message received on topic: ${topic}`);
            return;
          }

          switch (topic) {
            case "send-otp-email":
              await notificatinController.sendOtpEmail(messageValue);
              break;

            case "send-forgotPassword-email":
              await notificatinController.sendForgotEmail(messageValue);
              break;
            case "verified-Instructor-email":
              await notificatinController.sendVerifiedInstructorEmail(
                messageValue
              );
              break;

            default:
              console.warn(`No handler for topic: ${topic}`);
          }
        } catch (error: any) {
          console.error(
            `Error processing message from topic ${topic}:`,
            error.message
          );
        }
      },
    });
  } catch (error: any) {
    console.error(
      "Error in User-Service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;
