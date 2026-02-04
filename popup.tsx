import React, { useState, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

function IndexPopup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从当前豆包页面获取对话记录
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "GET_MESSAGES" },
          (response) => {
            if (response?.messages) {
              setMessages(response.messages);
            }
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleMessageClick = (messageId: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "SCROLL_TO_MESSAGE", messageId },
          () => {
            // 关闭 popup
            window.close();
          }
        );
      }
    });
  };

  return (
    <div className="w-80 h-96 p-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b">
          <h2 className="font-semibold text-lg">豆包对话目录</h2>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-gray-500">加载中...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-sm text-gray-500">
                未检测到豆包对话
              </div>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="space-y-2">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    className="w-full text-left p-2 rounded hover:bg-gray-100 text-sm"
                    onClick={() => handleMessageClick(message.id)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {message.content.length > 50
                          ? message.content.substring(0, 50) + "..."
                          : message.content}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndexPopup