const CLIENT_ID = encodeURIComponent('964902580044-dggeev80kgos8a7v56p56mcoboj9kuim.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://gbmknjhfccdepjcbmamahhcidgmapdjh.chromiumapp.org/')
const SCOPE = encodeURIComponent('openid');
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
const PROMPT = encodeURIComponent('consent');

let user_signed_in = false;

function is_user_signed_in() {
  return user_signed_in;
}

function create_auth_endpoint() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  let openId_endpoint_url =
    `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&scope=${SCOPE}
&state=${STATE}
&nonce=${nonce}
&prompt=${PROMPT}`;
  return openId_endpoint_url;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message === 'login') {
    if (user_signed_in) {
      console.log("User is already signed in.");
    } else {
      chrome.identity.launchWebAuthFlow({
        url: create_auth_endpoint(),
        interactive: true
      }, redirect_url => {
        if (chrome.runtime.lastError) {
          // problem signing in
        } else {
          let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
          id_token = id_token.substring(0, id_token.indexOf('&'));
          console.log("User successfully signed in.");
          chrome.storage.local.set({ idToken: id_token });
          user_signed_in = true;
          chrome.action.setPopup({ popup: '/html/signed-in-popup.html' }, () => {
            sendResponse('success');
          });
        }
      });
      return true;
    }
  } else if (request.message === 'logout') {
    chrome.storage.local.remove(['idToken']);
    user_signed_in = false;
    chrome.action.setPopup({ popup: '/html/popup.html' }, () => {
      sendResponse('success');
    });

    return true;
  } else if (request.message === 'isUserSignedIn') {
    sendResponse(is_user_signed_in());
  }
});
