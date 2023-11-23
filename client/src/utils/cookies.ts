// Function to set a cookie
export const setCookie = (
  name: string,
  value: string,
  expiresInSeconds: number
) => {
  const expirationTime = new Date().getTime() + expiresInSeconds * 1000;
  const expirationDate = new Date(expirationTime);

  // Convert the expirationDate to a UTC string
  const expires = `expires=${expirationDate.toUTCString()}`;

  // Create the cookie string
  const cookieString = `${name}=${value}; ${expires};`;

  // Set the cookie
  document.cookie = cookieString;
};

// Function to get a cookie by name
export const getCookie = (name: string) => {
  const cookieString = decodeURIComponent(document.cookie);
  const cookieArray = cookieString.split(';');

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    // Check if the cookie starts with the desired name
    if (cookie.startsWith(`${name}=`)) {
      // Extract and return the cookie's value
      return cookie.substring(name.length + 1);
    }
  }

  // Return null if the cookie is not found
  return null;
};

// Function to clear a cookie by setting its expiration to the past
export const clearCookie = (name: string) => {
  // Create a Date object in the past
  const expirationDate = new Date(0);

  // Convert the expirationDate to a UTC string
  const expires = `expires=${expirationDate.toUTCString()}`;

  // Create the cookie string with an expired date
  const cookieString = `${name}=; ${expires}; path=/`;

  // Set the cookie with an expired date
  document.cookie = cookieString;
};

// export const getCookie = (name) => {
//   const getCookieValue = (cookieName) => {
//     const cookieString = decodeURIComponent(document.cookie);
//     const cookieArray = cookieString.split(';');

//     // eslint-disable-next-line no-plusplus
//     for (let i = 0; i < cookieArray.length; i++) {
//       const cookie = cookieArray[i].trim();
//       if (cookie.startsWith(`${cookieName}=`)) {
//         return cookie.substring(cookieName.length + 1);
//       }
//     }

//     return null;
//   };

//   return getCookieValue(name);
// };
