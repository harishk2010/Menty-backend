import kafka from "./kafkaConfig";
import { studentController, instructorController } from "../dependencyInjector";
import { KafkaError } from "../../utils/constants";

async function consume() {
  const consumer = kafka.consumer({ groupId: "auth-service" });

  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "update-password-student",
        "update-profile-student",
        "block-student",
        "update-password-instructor",
        "update-profile-instructor",
        "block-instructor",
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
            console.warn(`${KafkaError.CONSUMER_EMPTY_MESSAGE}  topic: ${topic}`);
            return;
          }

          switch (topic) {
            case "update-password-student":
              await studentController.updatePassword(messageValue);

              break;

            case "update-profile-student":
              await studentController.updateProfile(messageValue);

              break;
            case "block-student":
              await studentController.blockStudent(messageValue);

              break;

            //instructor
            case "update-password-instructor":
              await instructorController.updatePassword(messageValue);

              break;

            case "update-profile-instructor":
              await instructorController.updateProfile(messageValue);

              break;
            case "block-instructor":
              await instructorController.blockInstructor(messageValue);

              break;

            default:
              console.warn(`${KafkaError.CONSUMER_NO_HANDLER} topic: ${topic}`);
          }
        } catch (error: any) {
          console.error(
            `${KafkaError.CONSUMER_MESSAGE_PROCESSING_FAILED} ${topic}:`,
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
