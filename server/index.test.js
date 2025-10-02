import { expect } from "chai"
import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js"


describe("Testing database functionality", () => {
    let token = null

    before(async () => {
        await initializeTestDb()
    })


    it("should scroll reviews", async () => {
        //code
    })
})


describe("Testing user management", () => {
    let token = null
    const userTest = { username: "testuser1", password: "password1", email: "user1@example.com" }
    const userTest2 = { username: "testuser2", password: "password2", email: "user2@example.com" } //An user to added the db

    before(async () => {
        await insertTestUser(userTest2)
        token = getToken(userTest2.email)
    })

     it("should register", async () => {
        //code
    })

    it("should not login, missing password", async () => {
        const newUser = { email: "user2@example.com", password: "" }

        const response = await fetch('http://localhost:3001/auth/signin', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(data) // { message: 'Check email and password' }
        expect(response.status).to.equal(400)
        expect(data).to.include.all.keys(["message"]);
    })

    it("should not login, wrong password", async () => {
        const newUser = { email: "user2@example.com", password: "password22" }

        const response = await fetch('http://localhost:3001/auth/signin', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        expect(response.status).to.equal(401)
    })

    it("should login with correct email and password", async () => {
        const newUser = { email: "user2@example.com", password: "password2" }

        const response = await fetch('http://localhost:3001/auth/signin', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(data) // { iduser: 1, email: 'user2@example.com' } if successfull

        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["iduser", "email"]); // , "token"
    })

    it("should log out", async () => {
        const newUser = { email: "user2@example.com", password: "password2" }

        const response = await fetch('http://localhost:3001/auth/signout', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(data) // { message: 'Logged out' } if successfull

        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["message"]);
    })


    it("should delete registration", async () => {
        const newUser = { email: "user2@example.com" }

        const response = await fetch('http://localhost:3001/user/deleteuser', {
            method: "delete",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(data) // { message: 'User deletion completed' } if successfull
        //console.log(response)

        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(["message"]);
    })
})
