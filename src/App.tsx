import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState<string>('');
  const [accessToken,setAccessToken] = useState<string>('');
  const [permissions, setpermissions] = useState<string>('');

  useEffect(() => {
    const extractQueryParams = () => {
      
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams;
    };

  const keys = extractQueryParams();
  console.log(keys);
  if(keys.size === 0)return;

  if(keys.get("shop") && keys.get("hmac") && keys.get("timestamp") && keys.get("code") && keys.get("state")){
    fetch("http://localhost:8080/exchange-access-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        shop: keys.get("shop"),
        hmac: keys.get("hmac"),
        timestamp: keys.get("timestamp"),
        code: keys.get("code"),
        state: keys.get("state")
      })
    }).then(res => res.json()).then(data => {
      console.log(data);
      setAccessToken(data.data.access_token);
      setpermissions(data.data.scope);
    }).catch(err => {
      alert("something went wrong! try again later");
    })
  }
  }, [])

  function onConnect () {
    fetch("http://localhost:8080/connect/" + input, {
      method: "GET"
    }).then(res => {
      return res.text()
    }).then(data => {
      console.log(data);
      window.open(data, "_self");
    }).catch(err => {
      alert("provide yor shopname or something went wrong");
    })
  }

  return (
    <>
      <div>
          <label htmlFor="input">shop name: </label>
          <input type="text" name="shopname" id="shopname"onChange={(event) => setInput(event.target.value)} value={input}/>
          <br />
          <hr />
          <button onClick={() => onConnect()}>connect your shopify store</button>
    <hr />
          <div>
            <h1>{accessToken}</h1>
            <h3>{permissions}</h3>
          </div>
      </div>
    </>
  )
}

export default App
