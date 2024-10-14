import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';

const AppComponent = ( { Component, pageProps } ) => {

  return <div>
    <Header currentUser={ pageProps?.currentUser } />
    <Component { ...pageProps } /></div>;
};

AppComponent.getInitialProps = async ( context ) => {
  const client = buildClient( context.ctx );
  const { data } = await client.get( '/api/users/currentuser' );

  return { ...data };

};

export default AppComponent;