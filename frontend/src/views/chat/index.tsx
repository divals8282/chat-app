import "./styles.scss";

import { useEffect, useState } from "react";
import { socketClient } from "../../socket-io";

export const ChatView = () => {
  const [messages, setMessages] = useState<
    { message: string; nickname: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socketClient.listen<{ message: string; nickname: string }[]>(
      "auth/messages",
      (data) => {
        setMessages([...data].reverse());
      }
    );
  }, []);

  const onNewMesssage = () => {
    socketClient.send<{ message: string }>("auth/send-message", {
      message: newMessage,
    });
  };

  return (
    <div className="chat-view">
      <ul className="list">
        {messages.reverse().map((msg, idx) => (
          <li key={idx}>
            {msg.nickname}: {msg.message}
          </li>
        ))}
      </ul>
      <div className="actions">
        <textarea
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <button onClick={onNewMesssage}>Send Message</button>
      </div>
    </div>
  );
};
