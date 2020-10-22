import CryptoJS from 'crypto-js'

export function encrypt(string, key) {
	return CryptoJS.AES.encrypt(string, key).toString()
}

export function decrypt(ciphertext, key) {
	return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8)
}

// FIXME: Make this configurable per user
export const SECRET = localStorage.getItem('encryptionKey')
