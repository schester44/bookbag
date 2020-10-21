export { buildSchema } from 'type-graphql'

import { NoteResolver } from './modules/notes/resolvers/Note'
import { UserCreationResolver } from './modules/authentication/resolvers/UserCreation'
import { UserAuthenticationResolver } from './modules/authentication/resolvers/UserAuthentication'
import { MeResolver } from './modules/authentication/resolvers/Me'
import { NoteBookResolver } from './modules/notebooks/resolvers/NoteBook'

export const resolvers = [
	NoteResolver,
	NoteBookResolver,
	UserCreationResolver,
	UserAuthenticationResolver,
	MeResolver,
]
