

const Landing = (props) => {
  const {currentUser}=props
  return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
};

// export const getServerSideProps = async ( context ) => {
//   return {};
// };

export default Landing;