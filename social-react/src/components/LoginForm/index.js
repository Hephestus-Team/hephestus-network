import React from 'react';

import './styles.css';

const LoginForm = () => (
    <form>
        <div className="input-group">
          <label htmlFor="">Usuário ou E-mail</label>
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
        
        <button type="submit">Entrar</button>

        <div id="registerContainer">
          <a href="*">
            Criar uma conta
          </a>
        </div>
       
    </form>
);

export default LoginForm;