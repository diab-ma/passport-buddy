import { useState } from 'react';

function Login()
{
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setPassword] = useState('');

  const app_name = 'cop4331-5.com'; // As specified in the MERN B doc
  function buildPath(route:string)
  {
      if (process.env.NODE_ENV === 'production')
      {
          return 'http://' + app_name + ':5000/' + route;
      }
      else
      {
          return 'http://localhost:5000/' + route;
      }
  }

  const doLogin = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/login'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const res = JSON.parse(await response.text());

      if (res.id <= 0) {
        setMessage('User/Password combination incorrect');
      } else {
        const user = { firstName: res.firstName, lastName: res.lastName, id: res.id };
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '/cards';
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      alert(errorMessage);
      return;
    }
  };

  function handleSetLoginName(e: React.ChangeEvent<HTMLInputElement>): void
  {
    setLoginName(e.target.value);
  }

  function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>): void
  {
    setPassword(e.target.value);
  }

  return(
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span><br />
      <input type="text" id="loginName" placeholder="Username"
        onChange={handleSetLoginName} /><br />
      <input type="password" id="loginPassword" placeholder="Password"
        onChange={handleSetPassword} /><br />
      <input type="submit" id="loginButton" className="buttons" value="Do It"
        onClick={doLogin} />
      <span id="loginResult">{message}</span>
    </div>
  );
};

export default Login;