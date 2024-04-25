
class ChatBot extends HTMLElement {
    constructor() {
        super()
        // Attach a shadow root to the element.
        this.attachShadow({mode: "open"})
        this.isOpen = false
        this.messages = []

    }

    connectedCallback() {
        this.render()
        this.addEventListeners()
        console.log('test');
    }

    disconnectedCallback() {

    }

    render() {
        console.log('this.messages', this.messages);
        this.shadowRoot.innerHTML = `
      ${!this.isOpen ? `<button class="start-chat-btn">start</button>` : ''}
      <div class="chat-window">
        <div class="chat-log">
            ${this.messages
            .map(
                (msg) => `
                    <div class="message ${msg.role}">${msg.content}</div>
                    ${msg.actions ? msg.actions.map((action) => `<li>${action}</li>`).join("") : ''}
                `
            )
            .join("")}
        </div>
        <div class="chat-input">
          <input class='chat-input-message' type="text" placeholder="Type a message...">
          <button class="send-btn" >Send</button>
        </div>
      </div>
    `
    }


    async sendMessage(message) {
        this.messages.push({ role: "user", content: message })
        this.render()
        this.addEventListeners()

        console.log(message);

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

            console.log('data', data);

            this.messages.push({
                role: "assistant",
                content: data.text || "Sorry, I didn't understand that.",
                actions: Array.isArray(data.actions) ? data.actions : Object.keys(data.actions)
            })

            this.render()
            this.addEventListeners()

            // Return focus to the input
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
        }
    }

    handleStartChat() {
        this.isOpen = !this.isOpen
        this.sendMessage('start')
    }

    handleSendButtonClick() {
        console.log('handleSendButtonClick', this);
        const inputField = this.shadowRoot.querySelector(".chat-input-message")
        if (inputField.value.trim()) {
            this.sendMessage(inputField.value.trim())
            this.clearAndFocusInput(inputField)
        }
    }

    clearAndFocusInput(inputField) {
        inputField.value = ""
        inputField.focus()
    }

    addEventListeners() {
        this.shadowRoot
            .querySelector(".start-chat-btn")
            .addEventListener("click", this.handleStartChat.bind(this))

        this.shadowRoot.querySelector(".send-btn")
            .addEventListener("click", this.handleSendButtonClick.bind(this))

    }
}

// Define the new element
if (!customElements.get("chat-bot")) {
    customElements.define("chat-bot", ChatBot)
}
