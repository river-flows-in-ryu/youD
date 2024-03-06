import { useEffect, useState } from "react";

export default function useFetch(url: string, method?: string, payload?: any) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setErr(error as string);
      }
    };
    fetchData();
  }, []);
  return { data, err };
}
