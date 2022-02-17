import { useState, useEffect } from "react";
import axios from "axios";

export default function usePaginateFetch(
   keyword,
   page,
   limit,
   sort = "createdAt"
) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);
   const [results, setResults] = useState([]);
   const [hasNext, setHasNext] = useState(false);
   const [hasPrevious, setHasPrevious] = useState(false);
   const [term, setTerm] = useState()

   useEffect(() => {
      if(keyword) {
         setResults([])
         setTerm(keyword)
      } 
   }, [keyword])
      console.log(page, limit, sort, term)

   useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(false);

      const params = {page, limit, sort, term}


      axios({
         method: "GET",
         url: "/api/products",
         params: params,
      })
         .then((res) => {
            if (isMounted) {
                  console.log(res.data.docs)


                     setResults((prevResults) => {
                     return [...prevResults, ...res.data.docs].filter(
                        (value, index, self) =>
                           index ===
                           self.findIndex(
                              (t) => t._id === value._id && t.name === value.name
                           )
                     );
                  });
             
               setHasNext(res.data.next);
               setHasPrevious(res.data.previous);
               setLoading(false);
            }
         })
         .catch((e) => {
            if (isMounted) {
               setLoading(false);
               setError(true);
            }
         });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => {
         isMounted = false;
      };
   }, [term, page, limit, sort]);

   return { loading, error, results, hasNext, hasPrevious };
}
