import kafka from "./kafkaConfig";
import { instructorController, studentController } from "../dependencyInjector";

async function consume() {
  const consumer = kafka.consumer({ groupId: "users-service" });

  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-student",
        "password-reset-student",
        "add-instructor-data",
        "password-reset-instructor",

        "update-instructor-wallet",
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
            case "add-student":
              await studentController.addStudent(messageValue);
              break;

            case "password-reset-student":
              await studentController.passwordReset(messageValue);
              break;

            //instructor
            case "add-instructor-data":
              await instructorController.addInstructor(messageValue);
              break;

            case "password-reset-instructor":
              await instructorController.passwordReset(messageValue);
              break;
            case "update-instructor-wallet":
              await instructorController.updateWallet(messageValue);
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
