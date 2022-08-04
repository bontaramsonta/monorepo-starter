rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017", priority: 10 },
    { _id: 1, host: "mongo2:27017", priority: 0 },
  ]
})