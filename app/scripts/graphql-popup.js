const graphqlTestUrl = "https://fastapi-graphql-auth-demo-mrbe4zqmdq-uw.a.run.app/";

chrome.storage.local.get(['idToken'], result => {
  let id_token = result.idToken;
  if (id_token == null) {
    console.log('There was a problem getting logged in user ID token');
    return;
  }
  fetch(graphqlTestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${id_token}`,
    },
    body: JSON.stringify({
      query: `
    query GetCoursesQuery {
      getCourses {
        id
        title
        instructor
        publishDate
      }
    }` }),
  })
    .then(res => {
      if (res.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + res.status);
        return;
      }
      return res.json();
    })
    .then(res => {
      const stubDiv = document.getElementById("graphqlStub");
      const data = res.data;
      stubDiv.innerText = data.getCourses[0].title;
    })
    .catch(err => {
      console.log('Fetch Error :-S', err);
    });
});
