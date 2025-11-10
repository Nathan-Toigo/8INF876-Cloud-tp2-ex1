import { useEffect, useState } from "react";
import "./App.css";

interface User {
  id: number;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://backend:3000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        return res.json();
      })
      .then((data: User[]) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Liste des utilisateurs 💻</h1>
      {error ? (
        <p style={{ color: "red" }}>Erreur : {error}</p>
      ) : users.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                background: "#f2f2f2",
                margin: "8px auto",
                padding: "10px",
                width: "200px",
                borderRadius: "8px",
              }}
            >
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Chargement des utilisateurs...</p>
      )}
    </div>
  );
}

export default App;
