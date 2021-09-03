const AWS = require("aws-sdk");
const rand = require("generate-key");
// const secret = require("./secret");

class Sqs {
  constructor(url) {
    this.sqsClient = new AWS.SQS({ region: "us-east-1" });
    this.url = url;
    this.sqsVisibilityTimeout = 20;
    // this.sqsWaitTimeSeconds = secret.sqsError.sqsWaitTimeSeconds
  }

  sqsGetMessage(MaxNumberOfMessages = 10) {
    return new Promise((resolve, reject) => {
      this.sqsClient.receiveMessage(
        {
          QueueUrl: this.url,
          MaxNumberOfMessages,
          VisibilityTimeout: this.sqsVisibilityTimeout,
          WaitTimeSeconds: this.sqsWaitTimeSeconds,
          AttributeNames: ["All"],
        },
        (err, data) => {
          // console.log('saco mensajes: ', data)
          if (err) {
            return reject(err);
          }
          resolve(data.Messages || []);
        }
      );
    });
  }

  sqsDeleteMessage(message) {
    return new Promise((resolve, reject) => {
      console.log("se eliminara mensaje");
      this.sqsClient.deleteMessage(
        {
          QueueUrl: this.url,
          ReceiptHandle: message.ReceiptHandle,
        },
        (err, data) => {
          if (err) {
            console.log("error al eliminar mensaje de SQS: ", err.message);
            return reject(err);
          }
          console.log("mensaje eliminado");
          resolve(data);
        }
      );
    });
  }

  sqsDeleteMessage_v2(_receiptHandle) {
    return new Promise((resolve, reject) => {
      console.log("se eliminara mensaje");
      this.sqsClient.deleteMessage(
        {
          QueueUrl: this.url,
          ReceiptHandle: _receiptHandle,
        },
        (err, data) => {
          if (err) {
            console.log("error al eliminar mensaje de SQS: ", err.message);
            return reject(err);
          }
          console.log("mensaje eliminado");
          resolve(data);
        }
      );
    });
  }

  sendQueue(messageBody) {
    return new Promise((resolve, reject) => {
      this.sqsClient.sendMessage(
        {
          MessageBody: JSON.stringify(messageBody),
          QueueUrl: this.url,
          DelaySeconds: 0,
          MessageDeduplicationId: rand.generateKey(),
          MessageGroupId: rand.generateKey(),
        },
        function (err, data) {
          console.log("message sent : ", data);
          if (err) {
            console.log("ERROR Sqs.sendQueue: ", err);
            return reject(err);
          }
          resolve(true);
        }
      );
    });
  }
}

module.exports = Sqs;
