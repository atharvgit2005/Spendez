fetch('http://localhost:10000/api/v1/ai/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({message: "hi"}) })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err.message));
