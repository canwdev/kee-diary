/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isOutboundURL(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isProd = process.env.NODE_ENV === 'production'
