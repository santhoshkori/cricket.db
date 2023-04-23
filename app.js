const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const present_path = __dirname;
//console.log(present_path);
const path = require("path");
let db_path = path.join(present_path, "cricketTeam.db");

//console.log(db_path);

let cricket_db = null;
const connect_db_server = async () => {
  try {
    cricket_db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server running 3000");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
//calling server
connect_db_server();
let expected_output = (db_object) => {
  return {
    playerId: db_object.player_id,
    playerName: db_object.player_name,
    jerseyNumber: db_object.jersey_number,
    role: db_object.role,
  };
};

app.get("/players/", async (request, response) => {
  const my_sql_query = `
    SELECT 
    *
    FROM 
      cricket_Team;
    `;
  const players_array = await cricket_db.all(my_sql_query);
  response.send(
    players_array.map((eachplayer) => {
      return expected_output(eachplayer);
    })
  );
});

app.get("/players/:playerid/", async (request, response) => {
  const { playerid } = request.params;
  let my_single_query = `
  SELECT
  *
  FROM 
  cricket_Team
  WHERE 
  player_id=${playerid};
  `;

  const singleplayer = await cricket_db.get(my_single_query);
  response.send(singleplayer);
});

app.post("/players/", (request, response) => {
  let new_player_details = request.body;
  const { playerName, jerseyNumber, role } = new_player_details;
  console.log(playerName);
  console.log(jerseyNumber);
});
