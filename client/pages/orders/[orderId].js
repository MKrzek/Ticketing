import buildClient from '../../api/buildClient';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/useRequest";
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
 let timerId
    const [timeLeft, setTimeLeft] = useState(0)

    const { doRequest, errors} = useRequest( {
        url:'/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess:()=>Router.push('/orders')
    })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
      findTimeLeft();
       timerId = setInterval(findTimeLeft, 1000)

      return () => {
          clearInterval(timerId)
      }
  }, [])

    if (timeLeft <= 0) {
        clearInterval(timerId)
        return <div>Order expired</div>
    }

    return <div>Time left to pay: {timeLeft} seconds
        <StripeCheckout
            token={({id}) => doRequest({token: id})}
            stripeKey="pk_test_HPudnXijOi9poQQ2LCdW9gsh"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />

        {errors}
    </div>
}

export const getServerSideProps = async (context) => {
  const client = await buildClient(context)
  const { orderId } = context.params
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { props: { order: data } }
}

export default OrderShow
