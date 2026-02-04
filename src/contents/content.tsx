import type { PlasmoCSConfig } from "plasmo"

interface Message {
  id: string
  content: string
  timestamp: number
  element?: Element
}

// 创建浮悬框组件
function createFloatingDirectory() {
  // 检查是否已经存在浮悬框
  const existingContainer = document.getElementById("chatbox-directory")
  if (existingContainer) {
    // 如果浮悬框已存在但被隐藏，显示它
    if (existingContainer.style.display === "none") {
      existingContainer.style.display = "block"
      console.log("重新显示浮悬框")
    } else {
      console.log("浮悬框已存在且可见")
    }
    return
  }

  console.log("开始创建浮悬框")

  // 创建浮悬框容器
  const container = document.createElement("div")
  container.id = "chatbox-directory"
  container.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    max-height: 600px;
    background: #f2f1ed;
    border: 1px solid #d2d0d1;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 9999;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

  // 创建标题栏
  const header = document.createElement("div")
  header.style.cssText = `
    padding: 12px 16px;
    background: #f2f1ed;
    border-bottom: 1px solid rgba(210, 208, 209, 0.3);
    font-weight: 600;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
    color: #020001;
  `
  header.textContent = "豆包对话目录"

  // 创建关闭按钮
  const closeButton = document.createElement("button")
  closeButton.style.cssText = `
    background: #020000;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #ffffff;
    padding: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  `
  closeButton.textContent = "×"
  closeButton.addEventListener("click", () => {
    container.style.display = "none"
    console.log("关闭浮悬框")
    // 显示重新打开按钮
    showOpenButton()
  })
  header.appendChild(closeButton)

  // 创建内容区域
  const content = document.createElement("div")
  content.id = "chatbox-directory-content"
  content.style.cssText = `
    padding: 12px;
    max-height: 500px;
    overflow-y: auto;
    background: #f2f1ed;
    scrollbar-color: #888 #f1f1f1;
  `

  // 创建刷新按钮
  const refreshButton = document.createElement("button")
  refreshButton.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    background: #020000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 8px;
    color: #ffffff;
  `
  refreshButton.textContent = "刷新对话目录"
  refreshButton.addEventListener("click", () => {
    console.log("点击刷新按钮")
    updateDirectory()
  })

  // 组装浮悬框
  container.appendChild(header)
  container.appendChild(content)
  container.appendChild(refreshButton)

  // 添加到页面
  document.body.appendChild(container)
  console.log("浮悬框已添加到页面")

  // 初始加载对话目录
  console.log("初始加载对话目录")
  updateDirectory()

  // 添加拖动功能
  makeDraggable(container, header)

  // 隐藏重新打开按钮
  hideOpenButton()
}

// 创建重新打开按钮
function createOpenButton() {
  // 检查是否已经存在重新打开按钮
  if (document.getElementById("chatbox-open-button")) {
    return
  }

  // 创建重新打开按钮
  const openButton = document.createElement("button")
  openButton.id = "chatbox-open-button"
  openButton.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: #020000;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 9998;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 16px;
    transition: all 0.2s;
  `
  openButton.textContent = "📋"
  openButton.title = "打开对话目录"

  // 添加点击事件
  openButton.addEventListener("click", () => {
    createFloatingDirectory()
  })

  // 添加到页面
  document.body.appendChild(openButton)
  console.log("创建重新打开按钮")
}

// 显示重新打开按钮
function showOpenButton() {
  // 确保按钮已创建
  createOpenButton()

  // 显示按钮
  const openButton = document.getElementById("chatbox-open-button")
  if (openButton) {
    openButton.style.display = "flex"
    console.log("显示重新打开按钮")
  }
}

// 隐藏重新打开按钮
function hideOpenButton() {
  const openButton = document.getElementById("chatbox-open-button")
  if (openButton) {
    openButton.style.display = "none"
    console.log("隐藏重新打开按钮")
  }
}

// 添加拖动功能
function makeDraggable(element: HTMLElement, handle: HTMLElement) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  handle.onmousedown = dragMouseDown

  function dragMouseDown(e: MouseEvent) {
    e = e || window.event
    e.preventDefault()
    // 获取鼠标点击位置
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // 移动鼠标时触发
    document.onmousemove = elementDrag
  }

  function elementDrag(e: MouseEvent) {
    e = e || window.event
    e.preventDefault()
    // 计算新位置
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // 设置新位置
    element.style.top = element.offsetTop - pos2 + "px"
    element.style.left = element.offsetLeft - pos1 + "px"
    // 清除transform，使用top和left定位
    element.style.transform = "none"
  }

  function closeDragElement() {
    // 停止移动
    document.onmouseup = null
    document.onmousemove = null
  }
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// 更新目录内容
function updateDirectory() {
  const contentElement = document.querySelector("#chatbox-directory-content")
  if (contentElement) {
    const messages = extractUserMessages()
    renderDirectory(contentElement as HTMLElement, messages)
  }
}

// 渲染目录内容
function renderDirectory(contentElement: HTMLElement, messages: Message[]) {
  contentElement.innerHTML = ""

  if (messages.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.style.cssText = `
      padding: 20px;
      text-align: center;
      color: #d2d0d1;
      font-size: 14px;
      background: #ffffff;
      border-radius: 4px;
    `
    emptyMessage.textContent = "未检测到对话记录"
    contentElement.appendChild(emptyMessage)
    return
  }

  // 创建消息列表
  const messageList = document.createElement("div")
  messageList.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 8px;
  `

  messages.forEach((message, index) => {
    const messageItem = document.createElement("button")
    messageItem.style.cssText = `
      text-align: left;
      padding: 10px;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    `
    messageItem.addEventListener("mouseenter", () => {
      if (!messageItem.classList.contains("selected-message-item")) {
        messageItem.style.background = "#f9fafb"
      }
    })
    messageItem.addEventListener("mouseleave", () => {
      if (!messageItem.classList.contains("selected-message-item")) {
        messageItem.style.background = "#ffffff"
      }
    })
    messageItem.addEventListener("click", () => {
      // 移除之前选中项的高亮
      const prevSelected = messageList.querySelector(".selected-message-item")
      if (prevSelected) {
        prevSelected.classList.remove("selected-message-item")
        prevSelected.style.background = "#ffffff"
      }

      // 添加当前选中项的高亮
      messageItem.classList.add("selected-message-item")
      messageItem.style.background = "#f2f7fa"

      // 滚动到对应的消息
      scrollToMessage(message)
    })

    // 创建消息内容
    const messageContent = document.createElement("div")
    messageContent.style.cssText = `
      font-weight: 500;
      margin-bottom: 4px;
      line-height: 1.3;
      color: #020001;
    `
    messageContent.textContent = `Q${index + 1}: ${
      message.content.length > 40
        ? message.content.substring(0, 40) + "..."
        : message.content
    }`

    // 创建消息时间
    const messageTime = document.createElement("div")
    messageTime.style.cssText = `
      font-size: 11px;
      color: #d2d0d1;
    `
    messageTime.textContent = new Date(message.timestamp).toLocaleString()

    // 组装消息项
    messageItem.appendChild(messageContent)
    messageItem.appendChild(messageTime)
    messageList.appendChild(messageItem)
  })

  contentElement.appendChild(messageList)
}

// 提取用户消息
function extractUserMessages(): Message[] {
  const messages: Message[] = []

  console.log("开始提取用户消息")

  // 豆包页面的消息容器选择器
  const messageContainers = document.querySelectorAll(
    '[data-testid="send_message"], [data-testid="receive_message"]'
  )

  console.log("找到消息容器数量:", messageContainers.length)

  messageContainers.forEach((container, index) => {
    // 检查是否是用户发送的消息
    const isUserMessage =
      container.getAttribute("data-testid") === "send_message"

    if (isUserMessage) {
      console.log("找到用户消息:", index)

      // 提取消息内容
      const contentElement = container.querySelector(
        '[data-testid="message_text_content"]'
      )

      let content = ""
      if (contentElement) {
        content = contentElement.textContent?.trim() || ""
      } else {
        // 如果没找到特定的内容元素，尝试获取整个容器的文本
        const clonedElement = container.cloneNode(true) as Element
        const excludeElements = clonedElement.querySelectorAll(
          '[data-testid="message_action_bar"], [data-testid="suggest_message_list"]'
        )
        excludeElements.forEach((el) => el.remove())
        content = clonedElement.textContent?.trim() || ""
      }

      if (content) {
        console.log("提取到用户消息内容:", content.substring(0, 50) + "...")
        messages.push({
          id: `message-${index}`,
          content,
          timestamp: Date.now() - messages.length * 1000,
          element: container
        })
      }
    }
  })

  console.log("提取完成，共找到用户消息:", messages.length, "条")
  return messages
}

// 滚动到指定消息
function scrollToMessage(message: Message) {
  console.log("滚动到消息:", message.id)

  if (message.element) {
    message.element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })

    // 添加高亮效果
    message.element.style.backgroundColor = "#fef3c7"
    setTimeout(() => {
      message.element!.style.backgroundColor = ""
    }, 2000)
  } else {
    // 如果没有元素引用，尝试通过ID查找
    const index = parseInt(message.id.split("-")[1])
    const messageContainers = document.querySelectorAll(
      '[data-testid="send_message"], [data-testid="receive_message"]'
    )

    if (messageContainers[index]) {
      messageContainers[index].scrollIntoView({
        behavior: "smooth",
        block: "center"
      })

      // 添加高亮效果
      messageContainers[index].style.backgroundColor = "#fef3c7"
      setTimeout(() => {
        messageContainers[index].style.backgroundColor = ""
      }, 2000)
    }
  }
}

// 监听页面变化，自动更新目录
let observer: MutationObserver

// 开始观察对话内容变化
function startObserving() {
  console.log("开始观察对话内容变化")

  // 豆包特定的对话容器选择器
  const doubaoContainers = [
    ".chat-container",
    ".message-list",
    ".conversation-container",
    ".dialog-container",
    ".chat-content",
    ".message-content",
    ".conversation-content",
    ".dialog-content",
    ".chat-history",
    ".message-history",
    ".messages",
    "#chat-content",
    "#message-list",
    '[class*="chat"]',
    '[class*="message"]',
    '[class*="dialog"]'
  ]

  let chatContainer = null
  for (const selector of doubaoContainers) {
    chatContainer = document.querySelector(selector)
    if (chatContainer) {
      console.log("找到对话容器:", selector)
      break
    }
  }

  // 如果没找到特定容器，使用body作为备选
  if (!chatContainer) {
    chatContainer = document.body
    console.log("使用body作为对话容器")
  }

  observer = new MutationObserver(
    throttle((mutations) => {
      // 检查是否有新内容添加
      let hasNewContent = false
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          hasNewContent = true
        }
      })

      if (hasNewContent) {
        console.log("检测到新内容，准备更新目录")
        // 延迟处理，确保DOM已完全加载
        setTimeout(() => {
          updateDirectory()
        }, 300)
      }
    }, 500)
  )

  observer.observe(chatContainer, {
    childList: true,
    subtree: true
  })
  console.log("开始观察对话内容变化")
}

// 监听页面加载完成
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM加载完成，创建浮悬框")
    createFloatingDirectory()
    startObserving()
  })
} else {
  console.log("DOM已加载，创建浮悬框")
  createFloatingDirectory()
  startObserving()
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.doubao.com/*"]
}

export default function Content() {
  return null
}
