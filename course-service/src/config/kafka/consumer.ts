import {
  courseController,
  instructorDashboardController,
} from "../dependencyInjector";
import kafka from "./kafkaConfig";

async function consume() {
  const consumer = kafka.consumer({ groupId: "course-service" });

  try {
    console.log("Connecting to Couser-Service Consumer...");
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
            console.warn(`Empty message received on topic: ${topic}`);
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
      "Error in Course-Service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;
