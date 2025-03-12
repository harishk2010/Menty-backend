import { KafkaError } from "../../utils/constants";
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
            console.warn(`${KafkaError.CONSUMER_EMPTY_MESSAGE} topic: ${topic}`);
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
              console.warn(`${KafkaError.CONSUMER_NO_HANDLER}topic: ${topic}`);
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
