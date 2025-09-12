const express = require("express");
const Court = require("../models/Court");
const { model } = require("mongoose");
const router = express.Router();

const getCourts =  async (req, res) => {
  try {
    const courts = await Court.find()
      .populate("officers")
      .populate("readers");

    const data = await Promise.all(
      courts.map(async (court, index) => {
       
        return {
          key: index + 1,
          courtName: court.courtName,
          officers: court.officers.length,
          readers: court.readers.length,
         
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = getCourts