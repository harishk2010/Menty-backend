import { adminController } from "../dependencyInjector";
import kafka from "./kafkaConfig";

async function consume() {
  const consumer = kafka.consumer({ groupId: "admin-service" });

  try {
    await consumer.connect();

    await consumer.subscribe({
      topics: ["update-admin-wallet", "create-admin-data"],
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
            case "update-admin-wallet":
              await adminController.updateWallet(messageValue);
              break;
            case "create-admin-data":
              await adminController.createAdmin(messageValue);

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
