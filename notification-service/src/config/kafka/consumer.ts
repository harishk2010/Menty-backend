import { NotificationControllers } from "../../controllers/notificationController";
import kafka from "./kafkaConfig";

async function consume() {
  const notificatinController=new NotificationControllers()
  const consumer = kafka.consumer({ groupId: "notification-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "send-otp-email",
        "send-forgotPassword-email",
        "verified-Instructor-email"
      ],
      fromBeginning: true,
    });

    console.log("User-Service Consumer is running...");
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
              console.log("Processed send-otp-email event:", messageValue);
              break;

            case "send-forgotPassword-email":
              await notificatinController.sendForgotEmail(messageValue);
              console.log("Processing send-forgotPassword-email event:", messageValue);
              break;
            case "verified-Instructor-email":
              await notificatinController.sendVerifiedInstructorEmail(messageValue);
              console.log("Processing verified-Instructor-email event:", messageValue);
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
