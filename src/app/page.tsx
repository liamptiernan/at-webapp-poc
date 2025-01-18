"use client";

import { functions, httpsCallable } from "./firebase/main";

export default function Home() {

  const callFirebaseFunction = async () => {
    try {
      const test = httpsCallable(functions, "on_request_example");

      // Call the function and pass data
      const result = await test();
      console.log(result)
      // Get reference to the Firebase function

    } catch (error) {
      console.error("Error calling Firebase function:", error);
    }
  };

  return (
   <button onClick={callFirebaseFunction}>
    Test
   </button>
  );
}
