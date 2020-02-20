import elasticlunr from 'elasticlunr'

elasticlunr.clearStopWords()

export const searchIndex = elasticlunr(function() {
	this.addField('title')
	this.addField('body')
	this.setRef('id')
})

export const tagIndex = elasticlunr(function() {
	this.addField('name')
	this.setRef('id')
})

export function addToSearchIndex(document) {
	searchIndex.addDoc(document)
}

export function updateSearchIndex(document) {
	return searchIndex.updateDoc(document)
}

export function removeFromSearchIndex(document) {
	return searchIndex.removeDoc(document)
}

export function createSearchIndex({ notes }) {
	notes.forEach(note => {
		if (!note || (note.title.trim().length === 0 && note.body.length === 0)) return

		addToSearchIndex({ ...note, body: JSON.stringify(note.body) })
	})
}

export function addToTagIndex(document) {
	tagIndex.addDoc(document)
}

export function createTagSearchIndex({ tags }) {
	tags.forEach(tag => {
		if (!tag) return

		addToTagIndex(tag)
	})
}
