import { ExpirationCompleteEvent, Publisher, Subjects } from "@mkrzektickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}