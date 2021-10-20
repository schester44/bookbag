import { createRxDatabase, getRxStoragePouch, addPouchPlugin } from 'rxdb'

export async function createDB() {
	const notebookSchema = {
		title: 'notebook schema',
		version: 0,
		primaryKey: 'id',
		type: 'object',
		properties: {
			id: {
				type: 'string',
			},
			name: {
				type: 'string',
			},
			notes: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						title: {
							type: 'string',
						},
						body: {
							type: 'string',
						},
						snippet: {
							type: 'string',
						},
						trashed: {
							type: 'boolean',
						},
					},
				},
			},
		},
		required: ['name'],
	}

	addPouchPlugin(require('pouchdb-adapter-idb'))

	const db = await createRxDatabase({
		name: 'bookbagdb',
		storage: getRxStoragePouch('idb'),
	})

	await db.addCollections({
		notebooks: {
			schema: notebookSchema,
		},
	})

	return { db }
}
