import app from "../src/server";
import request from 'supertest'

let token = ""
beforeAll(async() => {
    const response = await request(app).post("/authentication/login").send({ username: "19910320141139", password: "Ayambakarkecap!212" }).set('Content-Type','application/json')
    token = response.body.token
})

describe("authenticate", () => {
    it("logout test", async () => {
        const response = await request(app).get("/authentication/logout").set('Authorization',`Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})