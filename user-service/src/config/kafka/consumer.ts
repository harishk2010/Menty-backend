import kafka from "./kafkaConfig";
import { StudentController } from "../../controllers/studentController";
import { InstructorController } from "../../controllers/instructorController";

async function consume() {
  const studentController = new StudentController();
  const instructorController = new InstructorController();
  const consumer = kafka.consumer({ groupId: "user-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-student",
        "password-reset-student",
        "add-instructor",
        "password-reset-instructor",
        "verification-request",
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
            case "add-student":
              await studentController.addStudent(messageValue);
              console.log("Processed add-student event:", messageValue);
              break;

            case "password-reset-student":
              await studentController.passwordReset(messageValue);
              console.log("Processing add-instructor event:", messageValue);
              break;

            //instructor
            case "add-instructor":
              await instructorController.addInstructor(messageValue);
              console.log("Processed add-student event:", messageValue);
              break;

            case "password-reset-instructor":
              await instructorController.passwordReset(messageValue);
              console.log("Processing password-reset event:", messageValue);
              break;
            //verification
            case "verification-request":
              await instructorController.updateVerifyStatus(messageValue);
              console.log("Processing verification-request event:", messageValue);
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
