import buildClient from "../../api/buildClient";
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const TicketShow = ({ ticket }) => {
    const {doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order)=> Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    return <div>
        <h1>{ticket.title}</h1>
        <h4>{ticket.price}</h4>
        {errors}
        <button onClick={()=>doRequest()} className="btn btn-primary">Purchase</button>
    </div>
}

export const getServerSideProps = async (context) => {
const {ticketId} = context.params
const client = await buildClient(context);

const { data } = await client.get(`/api/tickets/${ticketId}`);
return { props: { ticket: data } };
};

export default TicketShow;