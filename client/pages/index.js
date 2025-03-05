import buildClient from "../api/buildClient";
import Link from "next/link";

const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link as={`tickets/${ticket.id}`} href="/tickets/[ticketId]">
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const client = await buildClient(context);

  const { data } = await client.get("/api/tickets");
  return { props: { tickets: data } };
};

export default Landing;