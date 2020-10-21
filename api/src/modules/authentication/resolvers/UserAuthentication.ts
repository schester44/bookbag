import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import bcrypt from 'bcrypt'

import { User } from '../../../entity/User'
import { AuthenticationError } from 'apollo-server-express'
import { GQLContext } from '../../../types/GQLContext'

@Resolver()
export class UserAuthenticationResolver {
	@Mutation(() => Boolean)
	logout(@Ctx() ctx: GQLContext): Boolean {
		ctx.req.session.userId = undefined

		ctx.req.session.destroy((err) => console.log(err))

		return true
	}

	@Mutation(() => User, { nullable: true })
	async login(
		@Arg('username') username: String,
		@Arg('password') password: String,
		@Ctx() ctx: GQLContext
	): Promise<User | null> {
		if (!username || !password) {
			throw new AuthenticationError('Invalid username/password')
		}

		const user = await User.findOne({ where: { username } })

		if (!user) {
			throw new AuthenticationError('Invalid username/password')
		}

		const isValidPassword = await bcrypt.compare(password, user.password)

		if (!isValidPassword) {
			throw new AuthenticationError('Invalid username/password')
		}

		ctx.req.session.userId = user.id

		return user
	}
}
