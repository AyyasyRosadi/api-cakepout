import bcrypt from "bcrypt"

class BcryptHelper{
    public async hash(password:string):Promise<string>{
        return await bcrypt.hash(password,await bcrypt.genSalt())
    }
    public async compare(password:string,userPassword:string):Promise<boolean>{
        return await bcrypt.compare(password,userPassword)
    }
}

export default new BcryptHelper