import React from 'react';

import './styles.css';

const RegisterForm = () => (
    <form>
        <div className="input-group">
          <label htmlFor="">Usuário</label>
            <input 
              type="text" 
              name="" 
              id="" 
              required
            />
        </div>
        <div className="input-group">
          <label htmlFor="">Senha</label>
            <input 
              type="password" 
              name="" 
              id="" 
              required
            />
        </div>
        
        <button type="submit">Registrar</button>
       
    </form>
);

export default RegisterForm;