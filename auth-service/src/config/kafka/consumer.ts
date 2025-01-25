import kafka from "./kafkaConfig";
import { StudentController } from "../../controllers/studentController";
import { InstructorController } from "../../controllers/instructorController";

async function consume() {
  const studentController = new StudentController();
  const instructorController=new InstructorController()
  const consumer = kafka.consumer({ groupId: "auth-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
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
            case "update-password-student":
              await studentController.updatePassword(messageValue);
              console.log("Processed add-student event:", messageValue);
              break;

            case "update-profile-student":
              await studentController.updateProfile(messageValue);
              console.log("Processing add-instructor event:", messageValue);
              break;
            case "block-student":
              await studentController.blockStudent(messageValue);
              console.log("Processing add-instructor event:", messageValue);
              break;

              //instructor
            case "update-password-instructor":
              await instructorController.updatePassword(messageValue);
              console.log("Processed add-student event:", messageValue);
              break;

            case "update-profile-instructor":
              await instructorController.updateProfile(messageValue);
              console.log("Processing add-instructor event:", messageValue);
              break;
            case "block-instructor":
              await instructorController.blockInstructor(messageValue);
              console.log("Processing add-instructor event:", messageValue);
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
