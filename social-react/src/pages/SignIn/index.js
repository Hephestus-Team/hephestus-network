import React, { useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputForm from '../../components/InputForm';

import * as Yup from 'yup';
import api from '../../services/api';
import { login } from '../../services/auth';

import { Form } from './styles';

const SignIn = () => {

  const formRef = useRef(null);
  const history = useHistory();

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Type a valid email')
          .required('Fill all the fields'),
        hash: Yup.string()
          .required('Fill all the fields')
      });

      await schema.validate(data, {
        abortEarly: false
      });

      apiCalling(data);

    } catch(err) {

      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  }  

  const apiCalling = async (data) => {
    try {
      const response = await api.post('/signin', data);

      login(response.data.token);

      history.push("/home");
      
    } catch(err) {
      const { email } = err.response.data.message;
      formRef.current.setFieldError('email', email);
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <div className="input-group-flex">
        <InputForm name="email" type="email" labelText="E-mail"/>
      </div>
      <div className="input-group-flex">
        <InputForm name="hash" type="password" labelText="Password"/>
      </div>
        
      <button type="submit" formNoValidate>Sign In</button>

      <div className="registerContainer">
        <Link to="/register">
          Create an account
        </Link>
      </div>
    </Form>
  );
};
    

export default SignIn;