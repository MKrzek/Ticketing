import buildClient from '../api/buildClient';
const Landing = ( { currentUser } ) => {
  console.log( 'in component', currentUser );

  return <div>Helllo3333</div>;
};

export const getServerSideProps = async ( context ) => {

  const { data } = await buildClient( context ).get( '/api/users/currentuser' );
  return { props: { ...data } };

};

export default Landing;