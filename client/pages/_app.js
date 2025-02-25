import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';

const AppComponent = ( { Component, pageProps, currentUser } ) => {

  return <div>
    <Header currentUser={ currentUser } />
    <div className="container">
      <Component currentUser={currentUser}  {...pageProps} /></div>
  </div>
};

AppComponent.getInitialProps = async ( context ) => {
  const client = buildClient( context.ctx );
  const { data } = await client.get( '/api/users/currentuser' );

  return { ...data};

};

export default AppComponent;