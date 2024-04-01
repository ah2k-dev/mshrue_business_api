const SucessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const files = async (req, res) => {
  // #swagger.tags = ['Business']
  // #swagger.summary = 'Upload file'
  try {
    const { title, purpose } = req.body;
    const { file } = req.files;
    if (!title || !purpose || !file) {
      return ErrorHandler("All fields are required", 400, req, res);
    }

    file.mv(`./uploads/${file.name}`, async (err) => {
      if (err) {
        return ErrorHandler(err.message, 500, req, res);
      }
    });

    const data = new FormData();
    data.append("title", title);
    data.append("purpose", purpose);
    data.append("expires_at", `${Date.now() + 1000 * 60 * 60 * 24 * 7}`);
    data.append("file_link_create", "true");
    data.append("file", fs.createReadStream(`./uploads/${file.name}`));

    // console.log(Object.fromEntries(data.entries()));
    const response = await axios.post(
      "https://api.tap.company/v2/files",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_TEST}`,
          Accept: "application/json",
          ...data.getHeaders(),
        },
      }
    );
    return SucessHandler(
      {
        response: response.data,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const create = async (req, res) => {
  // #swagger.tags = ['Business']
  // #swagger.summary = 'Create business'
  try {
    const { payload } = req.body;
    if (!payload) {
      return ErrorHandler("All fields are required", 400, req, res);
    }
    // console.log(payload);
    const response = await axios.post(
      "https://api.tap.company/v2/business",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_TEST}`,
          Accept: "application/json",
        },
      }
    );

    console.log(response.data);
    return SucessHandler(
      {
        response: response.data,
      },
      200,
      req,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const get = async (req, res) => {
  // #swagger.tags = ['Business']
  // #swagger.summary = 'Get business'
  try {
    const response = await axios.get(
      `https://api.tap.company/v2/business/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_TEST}`,
          Accept: "application/json",
        },
      }
    );
    return SucessHandler(
      {
        response: response.data,
      },
      200,
      req,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  files,
  create,
  get,
};
