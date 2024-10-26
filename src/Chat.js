// src/Chat.js
import React, { useState } from "react";
import axios from "axios";
import OpenAI from "openai";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const openai = new OpenAI();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);

    // Send message to OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [...messages, newMessage],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    // Get the assistant's response and update the chat
    const botMessage = response.data.choices[0].message;
    setMessages([...messages, newMessage, botMessage]);
    setInput("");
  };

  return (
    <div>
      <h2>Chat with OpenAI Bot</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user" : "bot"}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
