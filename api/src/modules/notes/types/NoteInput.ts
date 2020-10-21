import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateNoteInput {
	@Field(() => String, { nullable: true })
	title?: string

	@Field(() => String, { nullable: true })
	snippet?: string

	@Field(() => String, { nullable: true })
	body?: string

	@Field(() => Boolean, { defaultValue: false })
	trashed?: boolean

	@Field(() => String, { nullable: true })
	notebookId?: string
}

@InputType()
export class CreateNoteInput {
	@Field(() => String, { nullable: true })
	title?: string

	@Field(() => String, { nullable: true })
	snippet?: string

	@Field(() => String, { nullable: true })
	body?: string

	@Field(() => String, { nullable: true })
	notebookId?: string
}
