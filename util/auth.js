import axios from "axios";

const API_KEY = "AIzaSyDsTk8C4uhIeaqXsO8w5rn18gp-b-Tatzc";

export async function authenticate(mode, email, password) {
  //REST API url to access the authentication service
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}

export async function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

/*This is a utility function to handle the Firebase REST API for authentication only*/