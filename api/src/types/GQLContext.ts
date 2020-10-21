import { User } from '../entity/User'
import { Request } from 'express'

export interface GQLContext {
	req: Request
	res: Response
	user?: User
}
