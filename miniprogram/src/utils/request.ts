const API_BASE = 'http://localhost:3000'

export function request(url, options = {}) {
  const { method = 'GET', data, headers = {} } = options

  return new Promise((resolve, reject) => {
    wx.request({
      url: API_BASE + url,
      method: method.toUpperCase(),
      data,
      header: {
        'Content-Type': 'application/json',
        ...headers,
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error('Request failed: ' + res.statusCode))
        }
      },
      fail: (err) => {
        reject(new Error('Network error: ' + err.errMsg))
      },
    })
  })
}
