import {Publisher, Subjects, TicketUpdatedEvent} from '@mkrzektickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
