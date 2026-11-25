import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchUser() {
    const name = username.trim();

    if (name === "") {
      setError("Please enter a username.");
      setUser(null);
      setRepos([]);
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

    try {
      const userRes = await fetch(`https://api.github.com/users/${name}`);

      if (!userRes.ok) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      const repoRes = await fetch(
        `https://api.github.com/users/${name}/repos?sort=updated&per_page=5`
      );
      const repoData = await repoRes.json();

      setUser(userData);
      setRepos(repoData);
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>GitHub Profile Finder</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchUser()}
      />
      <button onClick={searchUser}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {user && (
        <div className="card">
          <img src={user.avatar_url} alt={user.login} width="120" />
          <h2>{user.name || user.login}</h2>
          <p>{user.bio || "No bio available"}</p>
          <p>Public Repos: {user.public_repos}</p>
          <p>Followers: {user.followers}</p>
          <p>Following: {user.following}</p>

          <h3>Latest Repositories</h3>
          {repos.map((repo) => (
            <p key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>{" "}
              - {repo.language || "N/A"} - ⭐ {repo.stargazers_count}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;