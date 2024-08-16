import { startAuthentication, startRegistration } from "@simplewebauthn/browser"

const signupButton = document.querySelector("[data-signup]")
const loginButton = document.querySelector("[data-login]")
const emailInput = document.querySelector("[data-email]")
const modal = document.querySelector("[data-modal]")
const closeButton = document.querySelector("[data-close]")

signupButton.addEventListener("click", signup)
loginButton.addEventListener("click", login)
closeButton.addEventListener("click", () => modal.close())

const SERVER_URL = "http://localhost:3000"

async function signup() {
  const email = emailInput.value

  // 1. Get challenge from server
  const initResponse = await fetch(
    `${SERVER_URL}/init-register?email=${email}`,
    { credentials: "include" }
  )
  const options = await initResponse.json()
  if (!initResponse.ok) {
    showModalText(options.error)
  }

  // 2. Create passkey
  const registrationJSON = await startRegistration(options)

  // 3. Save passkey in DB
  const verifyResponse = await fetch(`${SERVER_URL}/verify-register`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registrationJSON),
  })

  const verifyData = await verifyResponse.json()
  if (!verifyResponse.ok) {
    showModalText(verifyData.error)
  }
  if (verifyData.verified) {
    showModalText(`Successfully registered ${email}`)
  } else {
    showModalText(`Failed to register`)
  }
}

async function login() {
  const email = emailInput.value

  // 1. Get challenge from server
  const initResponse = await fetch(`${SERVER_URL}/init-auth?email=${email}`, {
    credentials: "include",
  })
  const options = await initResponse.json()
  if (!initResponse.ok) {
    showModalText(options.error)
  }

  // 2. Get passkey
  const authJSON = await startAuthentication(options)

  // 3. Verify passkey with DB
  const verifyResponse = await fetch(`${SERVER_URL}/verify-auth`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authJSON),
  })

  const verifyData = await verifyResponse.json()
  if (!verifyResponse.ok) {
    showModalText(verifyData.error)
  }
  if (verifyData.verified) {
    showModalText(`Successfully logged in ${email}`)
  } else {
    showModalText(`Failed to log in`)
  }
}

function showModalText(text) {
  modal.querySelector("[data-content]").innerText = text
  modal.showModal()
}
