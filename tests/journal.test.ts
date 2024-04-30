import app from "../src/server";
import request from 'supertest'

let token = ""
beforeAll(async() => {
    const response = await request(app).post("/authentication/login").send({ username: "19910320141139", password: "Ayambakarkecap!212" }).set('Content-Type','application/json')
    token = response.body.token
})

describe("journal",()=>{
    it("get-journal",async()=>{
        const response = await request(app).get("/journal?page=1&size=5&from_date=2024-04-01&to_date=2024-04-30").set('Authorization',`Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})