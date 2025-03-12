import kafka from "./kafkaConfig";
import { instructorController, studentController } from "../dependencyInjector";
import { KafkaError } from "../../utils/constants";

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
            console.warn(`${KafkaError.CONSUMER_EMPTY_MESSAGE} ${topic}`);
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
