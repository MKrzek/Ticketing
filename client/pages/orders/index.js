import buildClient from '../../api/buildClient';

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders?.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

export const getServerSideProps = async (context) => {
  const client = await buildClient(context)
  const { data } = await client.get("/api/orders");

    return { props: { orders: data } };
};

export default OrderIndex;
