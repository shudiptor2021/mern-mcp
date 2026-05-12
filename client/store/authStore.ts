let accessToken = null as string | null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

let userId = null as string | null;

export const setUserId = (id: string | null) => {
  userId = id;
};

export const getUserId = () => {
  return userId;
};

// log in with google
export const googleLogin = async () => {
    window.location.href =
  "http://localhost:5000/api/v1/auth/google";
};