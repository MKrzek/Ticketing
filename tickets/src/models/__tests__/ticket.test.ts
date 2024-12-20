import {Ticket} from '../ticket';

it('implements optimistic concurrency control', async () => {
	const ticket = Ticket.build({
		userId: '123',
		price: 5,
		title: 'New ticket',
	});
	await ticket.save();
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({price: 10});
	secondInstance!.set({price: 15});

	await firstInstance!.save();

	try {
		await secondInstance!.save();
	} catch (err) {
		return;
	}
	throw new Error('Show not reach this point');
});

it('increments the version number on mutliple saves', async () => {
	const ticket = Ticket.build({
		userId: '123',
		price: 10,
		title: 'New ticket',
	});
	await ticket.save();
	expect(ticket.version).toEqual(0);
	await ticket.save();
	expect(ticket.version).toEqual(1);
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
