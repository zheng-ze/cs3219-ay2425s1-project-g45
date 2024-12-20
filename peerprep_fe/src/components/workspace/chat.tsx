import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useChat } from "../../contexts/chat-context";
import Textfield from "../common/text-field";
import Button from "../common/button";
import ChatMessage from "./chatMessage";

type ChatProps = {
  isVisible: boolean;
};

const Chat: React.FC<ChatProps> = ({ isVisible }) => {
  const { username } = useAuth();
  const { messages, sendMessage } = useChat();

  const [messageToSend, setMessageToSend] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (
      messages.length > messageCount &&
      messages[messages.length - 1].username !== username
    ) {
      setNotification(true);
    }

    // Scroll to the bottom of the chat on first load if there are messages
    if (messageCount === 0 && messages.length > 0) {
      const chatContainer = document.getElementById("chat-container");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }

    setMessageCount(messages.length);
  }, [messages]);

  function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop - 2 <=
      e.currentTarget.clientHeight;
    if (bottom) {
      console.log("At the bottom");
      setNotification(false);
    }
  }

  return (
    <div
      className={`relative h-full bg-white dark:bg-slate-800 rounded-lg flex flex-col ${isVisible ? "z-50" : "hidden"}`}
    >
      <div
        id="chat-container"
        className=" w-full overflow-y-scroll h-[70%]"
        onScroll={(e) => handleScroll(e)}
      >
        {notification && (
          <div className="sticky top-0 text-center text-gray-500 dark:text-gray-400 ">
            {"New Messages"}
          </div>
        )}
        <div className="flex flex-col-reverse justify-end h-full px-4">
          {messages &&
            messages.toReversed().map((message, index) => {
              // console.log(message);
              return (
                <ChatMessage
                  key={index}
                  username={message.username}
                  message={message.message}
                  index={index}
                  isSender={message.username === username}
                />
              );
            })}
        </div>
        {/* Signal to user if new messages were received */}
      </div>
      <div className="flex justify-between space-x-5 items-center px-4">
        <div className="flex-grow">
          <Textfield
            placeholder_text="Message"
            maxLength={200}
            text={messageToSend}
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
          />
        </div>
        <div>
          <Button
            text="Send"
            type="button"
            onClick={() => {
              sendMessage(messageToSend);
              setMessageToSend("");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
