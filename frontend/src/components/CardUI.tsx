import { useState } from 'react';

function CardUI()
{
  let _ud;
  let ud;
  try
  {
    _ud = localStorage.getItem('user_data');
    ud = JSON.parse(_ud || '{}');
  }
  catch (e)
  {
    console.error("Could not parse user data from local storage", e);
    ud = {};
  }

  const userId = ud.id;

  const [message, setMessage] = useState('');
  const [searchResults, setResults] = useState('');
  const [cardList, setCardList] = useState('');
  const [search, setSearchValue] = useState('');
  const [card, setCardNameValue] = useState('');

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

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>): void
  {
    setSearchValue(e.target.value);
  }

  function handleCardTextChange(e: React.ChangeEvent<HTMLInputElement>): void
  {
    setCardNameValue(e.target.value);
  }

  const addCard = async (e: React.MouseEvent<HTMLButtonElement>) =>
  {
    e.preventDefault();

    const obj = { userId: userId, card: card };
    const js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath('api/addcard'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const res = JSON.parse(await response.text());

      if (res.error && res.error.length > 0)
      {
        setMessage("API Error:" + res.error);
      }
      else
      {
        setMessage('Card has been added');
      }
    }
    catch (e: unknown)
    {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setMessage(errorMessage);
    }
  };

  const searchCard = async (e: React.MouseEvent<HTMLButtonElement>) =>
  {
    e.preventDefault();
    
    const obj = { userId: userId, search: search };
    const js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath('api/searchcards'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      const txt = await response.text();
      const res = JSON.parse(txt);
      const _results = res.results;
      let resultText = '';
      for (let i = 0; i < _results.length; i++)
      {
        resultText += _results[i];
        if (i < _results.length - 1)
        {
          resultText += ', ';
        }
      }
      setResults('Card(s) have been retrieved');
      setCardList(resultText);
    }
    catch (e: unknown)
    {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      alert(errorMessage);
      setResults(errorMessage);
    }
  };

  return(
    <div id="cardUIDiv">
      <br />
      Search: <input type="text" id="searchText" placeholder="Card To Search For"
        onChange={handleSearchTextChange} />
      <button type="button" id="searchCardButton" className="buttons"
        onClick={searchCard}> Search Card</button><br />
      <span id="cardSearchResult">{searchResults}</span>
      <p id="cardList">{cardList}</p><br /><br />
      Add: <input type="text" id="cardText" placeholder="Card To Add"
        onChange={handleCardTextChange} />
      <button type="button" id="addCardButton" className="buttons"
        onClick={addCard}> Add Card </button><br />
      <span id="cardAddResult">{message}</span>
    </div>
  );
}

export default CardUI;