
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function handleContinue() {
    const name = username.trim();

    if (!name) return;

    navigate("/chat", {
      state: { username: name },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Welcome to Chat
        </h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="rounded border p-3"
        />

        <button
          onClick={handleContinue}
          disabled={!username.trim()}
          className="rounded bg-blue-600 p-3 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
