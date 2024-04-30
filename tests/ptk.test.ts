import app from '../src/server'
import request from 'supertest'

describe("report", ()=>{
    it("ptk test if not authorization", async()=>{
        const response = await request(app).get("/ptk")
        expect(response.status).toBe(401)
    })
})