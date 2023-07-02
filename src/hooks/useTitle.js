// Custom hook to set the title of the page
import { useEffect } from "react";

/**
 * @description This hook is used to set the title of the page
 * @param {string} title
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const useTitle = title => {
  useEffect(() => {
    // Get the previous title from the DOM
    const prevTitle = document.title;
    // Set it to the new title that is passed in as a prop
    document.title = title;

    // Clean up function
    // Every time the component unmounts, this sets the title to whatever it was before
    return () => (document.title = prevTitle);
  }, [title]);
};

export default useTitle;
