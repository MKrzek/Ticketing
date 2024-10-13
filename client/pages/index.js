import axios from 'axios';

const Landing = ( { currentUser } ) => {
  console.log( 'in component', currentUser );

  return <div>Helllo3333</div>;
};

export const getServerSideProps = async ( { req } ) => {
  if ( typeof window === 'undefined' ) {
    const response = await axios.get( 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        withCredentials: true,
        headers: req?.headers
      } );
    return { props: { ...response?.data } };

  } else {
    const response = await axios.get( '/api/users/currentuser' ).catch( err => {
      console.log( err.message );
    } );
    return { props: { ...response?.data } };
  }

};

export default Landing;