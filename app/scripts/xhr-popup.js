const xhrTestUrl = "https://fastapi-auth-demo-app-mrbe4zqmdq-uw.a.run.app/";

chrome.storage.local.get(['idToken'], result => {
  let id_token = result.idToken;
  fetch(xhrTestUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${id_token}`,
    },
  })
    .then(response => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        console.log(response.err);
        return;
      }
      response.json()
        .then(data => {
          const stubDiv = document.getElementById("xhrStub");
          stubDiv.innerText = data.message;
        });
    })
    .catch(err => {
      console.log('Fetch Error :-S', err);
    });
});