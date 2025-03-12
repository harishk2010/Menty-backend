import { KafkaError } from "@/utils/constants";
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
            console.warn(`${KafkaError.CONSUMER_EMPTY_MESSAGE} on topic: ${topic}`);
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
              console.warn(`${KafkaError.CONSUMER_NO_HANDLER}for topic: ${topic}`);
          }
        } catch (error: any) {
          console.error(
            KafkaError.CONSUMER_ERROR,
            error.message
          );
        }
      },
    });
  } catch (error: any) {
    console.error(
      KafkaError.CONSUMER_ERROR,
      error.message,
      error.stack
    );
  }
}

export default consume;
