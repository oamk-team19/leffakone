import { expect } from "chai"
import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js"

describe("Testing basic database functionality", () => {
    let token = null
    const userTest = { username: "testuser", password: "password123", email: "user1@example.com" }

    before(() => {
        initializeTestDb()
        token = getToken(userTest.email)
    })

    it("should scroll reviews", async () => {
        //code
    })
})


describe("Testing user management", () => {
    let token = null
    const userTest = { username: "testuser2", password: "password123", email: "user2@example.com" }

    before(() => {
        insertTestUser(userTest)
        token = getToken(userTest.email)
    })

    it("should login", async () => {
        const response = await fetch( 'http://localhost:3001/auth/signin',
        { email: userTest.email, password: userTest.password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        //console.log(response)
        /*
         const response = await fetch("http://localhost:3001/login")
        //const data = await response.json()
        console.log(response)
        /*
        const response = await fetch("http://localhost:3001/login", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userTest })
        })
        const data = await response.json()
        console.log(data)

        expect(response.status).to.equal(200)
        /*
        expect(data).to.include.all.keys(["id", "email", "token"]);
        */
    })

    it("should log out", async () => {
        //code
    })

    it("should register", async () => {
        //code
    })

    it("should delete registration", async () => {
        //code
    })
})
