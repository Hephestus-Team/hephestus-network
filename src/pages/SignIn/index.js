import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import InputForm from '../../components/InputForm';
import { Form } from './styles';

import { signIn } from '../../store/actions/user';

const SignIn = () => {
  const formRef = useRef(null);

  const dispatch = useDispatch();

  const apiCalling = async (data) => {
    try {
      const response = await axios.post('http://localhost:3333/signin', data);

      dispatch(signIn(response.data));
      window.location.reload(false);
    } catch (err) {
      const { email } = err.response.data.message;
      formRef.current.setFieldError('email', email);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Type a valid email')
          .required('Fill all the fields'),
        hash: Yup.string()
          .required('Fill all the fields'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      apiCalling(data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <div className="input-group-flex">
        <InputForm name="email" type="email" labelText="E-mail" />
      </div>
      <div className="input-group-flex">
        <InputForm name="hash" type="password" labelText="Password" />
      </div>

      <button type="submit" formNoValidate>Sign In</button>

      <div className="registerContainer">
        <Link to="/signup">
          Create an account
        </Link>
      </div>
    </Form>
  );
};


export default SignIn;
