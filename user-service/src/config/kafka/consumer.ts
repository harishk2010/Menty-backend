import kafka from "./kafkaConfig";
import { StudentController } from "../../controllers/studentController";

async function consume() {
  const studentController = new StudentController();
  const consumer = kafka.consumer({ groupId: "user-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: ["add-student", "add-instructor"],
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
            case "add-student":
              await studentController.addStudent(messageValue);
              console.log("Processed add-student event:", messageValue);
              break;

            case "add-instructor":
              console.log("Processing add-instructor event:", messageValue);
              break;

            default:
              console.warn(`No handler for topic: ${topic}`);
          }
        } catch (error:any) {
          console.error(
            `Error processing message from topic ${topic}:`,
            error.message
          );
        }
      },
    });
  } catch (error:any) {
    console.error("Error in User-Service Consumer:", error.message, error.stack);
  }
}

export default consume;
