function LoggedInName()
{
    let _ud;
    let ud;
    let firstName = '';
    let lastName = '';

    try
    {
        _ud = localStorage.getItem('user_data');
        ud = JSON.parse(_ud || '{}');
        firstName = ud.firstName;
        lastName = ud.lastName;
    }
    catch (e)
    {
        console.error("Could not parse user data from local storage", e);
    }

    const doLogout = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
	    event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };

    return(
      <div id="loggedInDiv">
        <span id="userName">Logged In As {firstName} {lastName}</span><br />
        <button type="button" id="logoutButton" className="buttons"
           onClick={doLogout}> Log Out </button>
      </div>
    );
};

export default LoggedInName;