export const serverFetch = async (
  url: string,
  method: string,
  payload?: any
) => {
  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      withcredentials: "include",
    },
    body: JSON.stringify(payload),
  });
  const jsonData = await res.json();
  return jsonData;
};
