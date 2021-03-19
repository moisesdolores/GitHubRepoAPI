import "./App.css";
import React from "react";

let token = "";

// retrieves user information
const fetchRepo = async () => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${token}`,
    },
  });
  const info = await response.json();
  return info;
};

// Collects user's token and retrieves repo information
function GetRepo() {
  const [apiToken, setToken] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const handleChange = (e) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector("#token-form").hidden = true;
    document.querySelector("#Access").hidden = false;
    document.querySelector("#options").hidden = false;
    token = apiToken;
    const data = await fetchRepo();
    setUserName(data.login);
  };

  return (
    <div>
      <div id="Access" hidden>
        Access Token: {apiToken}
        <br />
        <strong>Welcome {userName}</strong>
      </div>
      <form id="token-form" onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} />
        <input type="submit" placeholder="Access Token" value="Submit" />
      </form>
    </div>
  );
}

// Shows the user's list of repos
function ShowRepo({ updatedRepo, setUpdate }) {
  const repos = async () => {
    const data = await fetchRepo();
    const response = await fetch(data.repos_url);
    const repoArr = await response.json();

    setUpdate(repoArr);
  };
  const li = updatedRepo.map((ele) => <li key={ele.id}>{ele.name}</li>);

  return (
    <div>
      <button onClick={repos}>Get My Repos</button>
      <ul>{li}</ul>
    </div>
  );
}

// Allows user to create a repo with a name and description
function CreateRepo({ updatedRepo, setUpdate }) {
  const [repoName, repoToAdd] = React.useState("");
  const [description, addDescription] = React.useState("");
  const handleRepoName = (e) => {
    repoToAdd(e.target.value);
  };
  const handleRepoDescription = (e) => addDescription(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({
        name: repoName,
        description: description,
      }),
    });

    const data = await response.json();
    setUpdate([...updatedRepo, data]);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Repo name" onChange={handleRepoName} />
        <br />
        <input
          type="text"
          placeholder="Repo description"
          onChange={handleRepoDescription}
        />
        <br />
        <input type="Submit" />
      </form>
    </div>
  );
}

// Allows user to delete a repo of the given name
function DeleteRepo({ updatedRepo, setUpdate }) {
  const [user, setUser] = React.useState("");
  const [repoName, setRepoName] = React.useState("");
  const handleChange = (e) => {
    setRepoName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    const data = await fetchRepo();
    setUser(data.login);
    await fetch(`https://api.github.com/repos/${user}/${repoName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({
        owner: user,
        repo: repoName,
      }),
    });
    setUpdate(
      updatedRepo.filter(
        (ele) => ele.name.toLowerCase() !== repoName.toLowerCase()
      )
    );
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name of repo to delete"
          onChange={handleChange}
        />
        <br />
        <input type="Submit" />
      </form>
    </div>
  );
}

// Renders app components
function App() {
  const [updatedRepo, setUpdate] = React.useState([]);
  return (
    <div className="App">
      <h1>Github App</h1>
      <GetRepo />
      <div id="options" hidden>
        <div id="show-repos" className="opt">
          <ShowRepo updatedRepo={updatedRepo} setUpdate={setUpdate} />
        </div>
        <div id="make-repo" className="opt">
          <CreateRepo updatedRepo={updatedRepo} setUpdate={setUpdate} />
        </div>
        <div id="delete-repo" className="opt">
          <DeleteRepo updatedRepo={updatedRepo} setUpdate={setUpdate} />
        </div>
      </div>
    </div>
  );
}

export default App;
