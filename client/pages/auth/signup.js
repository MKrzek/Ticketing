import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';


const Signup = () => {

  const [email, setEmail] = useState( '' );
  const [password, setPassword] = useState( '' );

  const { doRequest, errors } = useRequest( {
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => { Router.push( '/' ); }
  } );

  const onSubmit = async ( event ) => {
    event.preventDefault();
    try {
      await doRequest();
    } catch ( err ) {
      console.log( 'req err' );
    }
  };

  return <form onSubmit={ onSubmit }>
    <h1>Sign Up</h1>
    <div className='form-group'>
      <label>Email Address</label>
      <input
        onChange={ e => setEmail( e.target.value ) }
        value={ email }
        className='form-control' />
    </div>
    <div className='form-group'>
      <label>Password</label>
      <input
        onChange={ e => setPassword( e.target.value ) }
        value={ password }
        type='password'
        className='form-control' />
    </div>
    { errors }
    <button className='btn btn-primary'>Sign Up</button>
  </form>;
};

export default Signup;