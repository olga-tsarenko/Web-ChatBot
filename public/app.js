class ChatBot extends HTMLElement {
    constructor() {
        super()
        // Attach a shadow root to the element.
        this.attachShadow({ mode: "open" });

        this.isOpen = false
        this.messages = []
    }

    connectedCallback() {
        this.render()
        this.addEventListeners()
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="main.css">
            <div class="chat-window">
                <div class="chat-log"></div>
                <div class="chat-input">
                    <input type="text" class="chat-input-message" placeholder="Type a message...">
                    <button class="send-btn">Send</button>
                </div>
            </div>
        `
        this.updateChatLog()
    }

    updateChatLog() {
        const chatLog = this.shadowRoot.querySelector('.chat-log')
        chatLog.innerHTML = this.messages
            .map(
                (msg) => `
                    <div class="message-${msg.role}">
                        <p class="message">${msg.content}</p>
                        ${msg.role === 'assistant' && msg.actions ? `<ul>${msg.actions.map(action => `<li>${action}</li>`).join('')}</ul>` : ''}
                    </div>
                `
            )
            .join("")
    }

    async sendMessage(message) {
        this.messages.push({ role: "user", content: message })
        this.updateChatLog()
        this.addEventListeners()

        try {
            const response = await fetch("http://localhost:3030", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message}),
            })

            if (!response.ok) {
                throw new Error("Network response was not ok")
            }

            const data = await response.json()

            this.messages.push({
                role: "assistant",
                content: data.text,
                actions: data.hasOwnProperty('actions') ? Object.keys(data.actions) : ''
            })

            this.updateChatLog()
            this.addEventListeners()

            const inputField = this.shadowRoot.querySelector(".chat-input input")
            if (inputField) {
                inputField.focus()
            }

        } catch (error) {
            console.error("There was a problem with the fetch operation:", error)
            this.messages.push({
                role: "assistant",
                content: "Sorry, there was an error processing your message.",
            })
            this.updateChatLog()
        }
    }

    handleSendButtonClick() {
        const inputField = this.shadowRoot.querySelector(".chat-input-message")
        if (inputField.value.trim()) {
            this.sendMessage(inputField.value.trim())
            this.clearAndFocusInput(inputField)
        }
    }

    handleInputEnter(event) {
        if (event.key === "Enter") {
            this.handleSendButtonClick();
        }
    }

    clearAndFocusInput(inputField) {
        inputField.value = ""
        inputField.focus()
    }

    addEventListeners() {
        const sendButton = this.shadowRoot.querySelector(".send-btn");
        const inputField = this.shadowRoot.querySelector(".chat-input-message");

        sendButton.addEventListener("click", this.handleSendButtonClick.bind(this));
        inputField.addEventListener("keypress", this.handleInputEnter.bind(this));
    }
}

// Define the new element
if (!customElements.get("chat-bot")) {
    customElements.define("chat-bot", ChatBot)
}
