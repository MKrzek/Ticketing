import {Publisher, Subjects, TicketCreatedEvent} from '@mkrzektickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
