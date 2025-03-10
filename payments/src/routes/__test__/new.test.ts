import request from 'supertest';
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mkrzektickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'hellll',
            orderId: new mongoose.Types.ObjectId().toHexString()
        }).expect(404)
}, 6000)

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'hellll',
            orderId: order.id
        })
        .expect(401)
}, 6000)

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'hellll'
        })
        .expect(400)
}, 6000)

it('returns  204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    const chargeResult = await (stripe.charges.create as jest.Mock).mock
        .results[0].value;
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: chargeResult.id,
    })

    expect(payment).not.toBeNull()

}, 6000)
