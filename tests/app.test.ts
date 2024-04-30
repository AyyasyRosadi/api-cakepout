import app from '../src/server'
import request from 'supertest'

describe("report", ()=>{
    it("report test", async()=>{
        const response = await request(app).get("/report/income-statement?start=2024-01-01&end=2024-05-01")
        expect(response.status).toBe(200)
    })
})