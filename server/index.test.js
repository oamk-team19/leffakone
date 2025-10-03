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

        expect(response.status).to.equal(400)
        expect(data).to.have.property('message');
        expect(data).to.be.an('object');
        expect(data).to.deep.equal({ message: 'Check email and password' });
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
        expect(data).to.be.an('object');
        expect(data).to.have.property('error');
        expect(data).to.deep.equal({ error: 'Invalid credentials' });

    })

    it("should login with correct email and password", async () => {
        const newUser = { email: "user2@example.com", password: "password2" }

        const response = await fetch('http://localhost:3001/auth/signin', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["iduser", "email"]);
        expect(data).to.be.an('object');
        expect(data).to.deep.equal({ iduser: 1, email: 'user2@example.com' });
    })

    it("should log out", async () => {
        const newUser = { email: "user2@example.com", password: "password2" }

        const response = await fetch('http://localhost:3001/auth/signout', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.have.property('message');
        expect(data).to.be.an('object');
        expect(data).to.deep.equal({ message: 'Logged out' });
    })


    it("should delete registration", async () => {
        const newUser = { email: "user2@example.com" }

        const response = await fetch('http://localhost:3001/user/deleteuser', {
            method: "delete",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(response)

        expect(response.status).to.equal(201)
        expect(data).to.be.an('object').that.has.all.keys('message');
        expect(data).to.deep.equal({ message: 'User deletion completed' });


    })

    it("should not delete registration with wrong email", async () => {
        const newUser = { email: "user3@example.com" }

        const response = await fetch('http://localhost:3001/user/deleteuser', {
            method: "delete",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        })

        const data = await response.json()
        //console.log(response)

        expect(response.status).to.equal(409)
        expect(data).to.have.property('error');
        expect(data).to.be.an('object');
        expect(data).to.deep.equal({ error: 'Not find user by email from users' });
    })
})
