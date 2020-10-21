import bcrypt from 'bcrypt'
import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Note } from '../../../entity/Note'
import { User } from '../../../entity/User'

@Resolver()
export class UserCreationResolver {
	@Mutation(() => Note)
	async registerUser(
		@Arg('username') username: string,
		@Arg('password') password: string
	): Promise<User | null> {
		if (!username || !password) {
			throw new Error('Missing required fields')
		}

		const conflictingUser = await User.findOne({ where: { username } })

		if (conflictingUser) {
			throw new Error('Username not available')
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await User.create({ username, password: hashedPassword }).save()

		return user
	}
}
