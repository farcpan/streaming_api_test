import 'aws-lambda';
import { setTimeout } from 'node:timers/promises';

export const streamApiHandler = awslambda.streamifyResponse(
  async (_event, responseStream) => {
    // stream
    const stream = awslambda.HttpResponseStream.from(
      responseStream,
      {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // message returned to client
    const message = "Hello Streaming API!";

    // streaming 
    for (let index = 0; index < message.length; index++) {
        const chunk = message[index];
        const data = {
            chunk: chunk,
            index: index, 
        }
      stream.write(JSON.stringify(data));
      await setTimeout(1000);
    }
    stream.end();
  }
);
