const express = require("express");

// db access using knex
const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  // SELECT * FROM Posts
  //   db("accounts")
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.json(accounts);
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to get accounts" });
    });
});

router.get("/:id", (req, res) => {
  // SELECT * FROM Posts WHERE ID = param.id
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .then(accounts => {
      const account = accounts[0];

      if (account) {
        res.json(account);
      } else {
        res.status(400).json({ message: "invalid account id" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to get account" });
    });
});
// postman http://localhost:4000/api/posts/2

router.post("/", (req, res) => {
  // INSERT INTO Posts (all of the keys from req.body) VALUES (all of the values from req.body)
  const accountData = req.body;
  db("accounts")
    .insert(accountData)
    .then(ids => {
      res.status(201).json({ newAccount: ids[0] });
    })
    .catch(error => {
      console.log("post error", error);
      res.status(500).json({ message: "Failed to insert account" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  // UPDATE  Posts SET changes.key = changes.value, changes.key = WHERE 9d = id;
  db("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.status(200).json({ updated: count });
      } else {
        res.status(404).json({ message: "invalid account id" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to update account" });
    });
});

router.delete("/:id", (req, res) => {
  // DELETE FROM Posts WHERE id = id;
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.json({ deleted: count });
      } else {
        res.status(404).json({ message: "invalid account id" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to delete account" });
    });
});

module.exports = router;
