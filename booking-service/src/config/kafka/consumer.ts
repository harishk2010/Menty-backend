import kafka from "./kafkaConfig";

async function consume() {
  // const studentController = new StudentController();
  // const instructorController=new InstructorController()
  const consumer = kafka.consumer({ groupId: "booking-service" });

  try {
    console.log("Connecting to Couser-Service Consumer...");
    await consumer.connect();

    await consumer.subscribe({
      topics: [
        // "add-student",
        // "password-reset-student",
        // "add-instructor",
        // "password-reset-instructor",
      ],
      fromBeginning: true,
    });

    console.log("Course-Service Consumer is running...");
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
            // case "add-student":
            //   await studentController.addStudent(messageValue);
            //   console.log("Processed add-student event:", messageValue);
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
      "Error in Course-Service Consumer:",
      error.message,
      error.stack
    );
  }
}

export default consume;
