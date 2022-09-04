import { PubSub } from '@google-cloud/pubsub';
import { catchError, from, map, throwError, retry, switchMap } from 'rxjs';

export class PublishPubSubMessage {
  /**
   * publishPubSubMessage
   */

  public publishPubSubMessage(pubsubTopicName: string, messagedata: any) {
    const pubSubClient = new PubSub();
    let dataBuffer: Buffer;

    const pubsubTopic = pubSubClient.topic(pubsubTopicName, {
      batching: {
        maxMessages: 500,
        maxMilliseconds: 5000,
      },
    });

    if (typeof messagedata === 'string' || messagedata instanceof String) {
      console.log('messagedata is typeof string');
      dataBuffer = Buffer.from(messagedata);
    } else if (typeof messagedata === 'object') {
      console.log('messagedata is typeof object');
      dataBuffer = Buffer.from(JSON.stringify(messagedata));
    }

    const publishTopic = from(pubsubTopic.publishMessage({ data: dataBuffer }));
    return publishTopic
      .pipe(
        map((r) => r),
        retry(2),
        catchError((error) => {
          if(error.code === 5) {
          const managedError = from(pubSubClient.createTopic(pubsubTopicName))
          .pipe(
            switchMap( () => from(pubsubTopic.publishMessage({ data: dataBuffer }))),
            catchError(err => {
              throw 'Second Attempt to publish PubSub Message Error Details: ' + err;
            })
          );
          return managedError;
        } else {
          return throwError(() => new Error(' PubSub Message Error Details'))
        }

        })
      )

  }
}
