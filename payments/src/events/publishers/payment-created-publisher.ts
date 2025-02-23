import { PaymentCreatedEvent, Publisher, Subjects } from "@mkrzektickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}