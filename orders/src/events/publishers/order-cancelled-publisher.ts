import {OrderCancelledEvent, Publisher, Subjects} from '@mkrzektickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
