import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();

//an AI Bot for texting
router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        // this represents the bot and what role they will assume
        { role: "system", content: "You are a helpful assistant." },
        // the message that the user sends
        { role: "user", content: text },
      ],
    });

    /* console.log("choices: ", response.data.choices[0]);
    console.log("choices: ", response.data.choices[0].message); */

    //for letting to AI Bot response to user throught chat service
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: error.message });
  }
});

//an AI Bot for coding assist
router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        // this represents the bot and what role they will assume
        {
          role: "system",
          content:
            "You are an assistant coder who responds with only code and no explanations.",
        },
        // the message that the user sends
        { role: "user", content: text },
      ],
    });

    console.log("choices: ", response.data.choices[0]);
    console.log("choices: ", response.data.choices[0].message);

    //for letting to AI Bot response to user throught chat service
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: error.message });
  }
});

// an AI Bot assistant fills your sentences
router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        //this represents the bot and what role they will assume
        {
          role: "system",
          content:
            "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
        },
        //the message that the user sends
        { role: "user", content: `Finish my tought: ${text}` },
      ],
    });
    /* console.log("choices: ", response.data.choices[0]);
    console.log("choices: ", response.data.choices[0].message); */
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
