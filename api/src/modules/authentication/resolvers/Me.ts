import { Resolver, Ctx, Query } from 'type-graphql'

import { User } from '../../../entity/User'
import { GQLContext } from '../../../types/GQLContext'

@Resolver()
export class MeResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() ctx: GQLContext): Promise<User | undefined> {
		if (!ctx.req.session!.userId) return null

		return await User.findOne(ctx.req.session!.userId)
	}
}
