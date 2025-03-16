import { KafkaError } from "../../utils/constants";
import {
  courseController,
  instructorDashboardController,
} from "../dependencyInjector";
import kafka from "./kafkaConfig";

async function consume() {
  const consumer = kafka.consumer({ groupId: "course-service" });

  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: ["add-student", "update-profile-student"],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const messageValue = message.value
            ? JSON.parse(message.value.toString())
            : null;

          if (!messageValue) {
            console.warn(`${KafkaError.CONSUMER_EMPTY_MESSAGE} ${topic}`);
            return;
          }

          switch (topic) {
            case "add-student":
              await courseController.addStudent(messageValue);
              break;
            case "update-profile-student":
              await instructorDashboardController.updateProfile(messageValue);
              break;

            default:
              console.warn(
                `${KafkaError.CONSUMER_NO_HANDLER} for topic: ${topic}`
              );
          }
        } catch (error: any) {
          console.error(
            `${KafkaError.CONSUMER_ERROR} ${topic}:`,
            error.message
          );
        }
      },
    });
  } catch (error: any) {
    console.error(KafkaError.CONSUMER_ERROR, error.message, error.stack);
  }
}

export default consume;
