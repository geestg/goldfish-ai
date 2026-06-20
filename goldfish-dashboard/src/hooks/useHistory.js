import { useEffect, useState } from "react";
import { getHistory } from "../services/api";

export default function useHistory() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchData();

    const interval = setInterval(
      fetchData,
      3000
    );

    return () => clearInterval(interval);

  }, []);

  const fetchData = async () => {

    try {

      const res = await getHistory();

      if (Array.isArray(res.data)) {

        setData(res.data);

      } else {

        console.error(
          "[HISTORY] invalid response",
          res.data
        );

        setData([]);
      }

    } catch (err) {

      console.error(
        "[HISTORY] backend unavailable",
        err
      );

      setData([]);
    }
  };

  return {
    data
  };
}