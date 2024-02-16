import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./utils/apis";
import Posts from "./components/Posts";
function App() {
  return (
    <>
      <h1>React Query</h1>
      <Posts />
    </>
  );
}

export default App;
