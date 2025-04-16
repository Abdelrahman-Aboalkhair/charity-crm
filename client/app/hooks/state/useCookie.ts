import { useState } from "react";

const useCookie = (key: string, defaultValue?: string) => {
  const getCookie = () => {
    const matches = document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`);
    return matches ? matches[2] : defaultValue;
  };

  const [cookie, setCookieState] = useState<string | undefined>(getCookie);

  const setCookie = (value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
    setCookieState(value);
  };

  const deleteCookie = () => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setCookieState(undefined);
  };

  return { cookie, setCookie, deleteCookie };
};

export default useCookie;
