import { OrderStatus } from '@mkrzektickets/common';
import mongoose from 'mongoose';

import { Order } from './order';

interface TicketAttrs {
	id?: string;
	title: string;
	price: number;
}
export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	version: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
	findByEvent(event: {id: string; version: number}): Promise<TicketDoc | null>;
}
const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.set('versionKey', 'version');
// ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.pre('save', function () {
	this.$where = {
		version: this.get('version') - 1,
	};
});
ticketSchema.statics.findByEvent = (event: {id: string; version: number}) => {
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};
// statics is how we add a method to ticket model directly
ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price,
	});
};

// if we want to add a method to an indiviual document
ticketSchema.methods.isReserved = async function () {
	//this === the ticket documet that is 'Reserved'
	// run query to look at all orders and we need to find a query that has this particular ticket attached to it
	// and the order status is ***not cancelled**
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};
