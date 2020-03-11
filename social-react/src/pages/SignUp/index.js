import React, { useState, useRef } from 'react';
import InputForm from '../../components/InputForm';
import { useHistory } from "react-router-dom";

import * as Yup from 'yup';
import api from '../../services/api';
import { login } from '../../services/auth';

import { Form } from './styles';

const SignUp = () => {

  const [gender, setGender] = useState('m');

  const formRef = useRef(null);
  const history = useHistory();

  const handleSubmit = async (data) => {

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Type a valid email')
          .required('Fill all the fields'),
        hash: Yup.string()
          .required('Fill all the fields'),
        confpassword: Yup.string()
          .oneOf([Yup.ref('hash'), null], 'Passwords don\'t match')
          .required('Fill all the fields'),
        first_name: Yup.string().required('Fill all the fields'),
        last_name: Yup.string().required('Fill all the fields'),
        birthday: Yup.string().required('Fill all the fields'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      let userInfo = { ...data, gender };

      delete userInfo.confpassword;

      apiCalling(userInfo);

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
      console.log(data);
      const response = await api.post('/signup', data);

      login(response.data.token);

      history.push("/");
      
    } catch(err) {
      const { email } = err.response.data.message;
      formRef.current.setFieldError('email', email);
    }
  }

    return (
      <Form onSubmit={handleSubmit} ref={formRef} >
        <div className="input-group-flex">
          <InputForm name="email" type="email" labelText="E-mail" />
        </div>

        <div className="container-grid">
          <div>
            <InputForm name="hash" type="password" labelText="Password" />
          </div>  
          <div>
            <InputForm name="confpassword" type="password" labelText="Confirm Password" />
          </div>
        </div>

        <div className="container-grid">
          <div>
            <InputForm name="first_name" type="text" labelText="First Name" />
          </div>
          <div>
            <InputForm name="last_name" type="text" labelText="Last Name" />
          </div>
        </div>

        <div className="container-grid">
          <div>
            <InputForm name="birthday" type="date" labelText="Birthday" />
          </div>
          <div>
            <label htmlFor="">Gender</label>
            <div className='container-flex-row'>
              <div className="radioContainer">
                <input
                  type="radio" 
                  name="gender"
                  id="male"
                  value="m"
                  onChange={e => setGender(e.target.value)}
                  checked
                />
                <label htmlFor="male">
                  Male
                </label>
              </div>

              <div className="radioContainer">
                <input
                  type="radio" 
                  name="gender"
                  id="female"
                  value="f"
                  onChange={e => setGender(e.target.value)}
                />
                <label htmlFor="female">
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" formNoValidate >Register</button>
      </Form>
  );
}

export default SignUp;