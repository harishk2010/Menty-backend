import kafka from "./kafkaConfig";
import { instructorController, studentController } from "../dependencyInjector";

async function consume() {

  const consumer = kafka.consumer({ groupId: "users-service" });

  try {
    console.log("Connecting to User-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "add-student",
        "password-reset-student",
        "add-instructor",
        "password-reset-instructor",
        "update-instructor-wallet"
        // "verification-request",
        // "approve-reject-request",
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
          console.log("=====> ",topic," <===========")

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
            case "update-instructor-wallet":
              await instructorController.updateWallet(messageValue);
              console.log("Processing password-reset event:", messageValue);
              break;
            //verification
            // case "verification-request":
            //   await instructorController.updateVerifyStatus(messageValue);
            //   console.log(
            //     "Processing verification-request event:",
            //     messageValue
            //   );
            //   break;
            // case "approve-reject-request":
            //   console.log("ap-rej-req")
            //   await instructorController.approveRequest(messageValue);
            //   console.log(
            //     "Processing req-approve-request event:",
            //     messageValue
            //   );
            //   break;

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
