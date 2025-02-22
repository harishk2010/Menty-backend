import { Request, Response } from "express"

export interface IChatController{
    createChat(req: Request, res: Response):Promise<void>
    getChat(req: Request, res: Response):Promise<void>
    getChatHistory(req: Request, res: Response):Promise<void>
}