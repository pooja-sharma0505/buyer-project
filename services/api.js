async function parseErrorMessage(response, fallback) {
  const text = await response.text()
  try {
    const body = JSON.parse(text)
    if (body.message && body.error) return `${body.message}: ${body.error}`
    if (body.message) return body.message
    if (body.error) return body.error
  } catch {
    /* ignore */
  }
  return fallback
}

export const getProducts = async () => {
  let response
  try {
    response = await fetch('/api/products')
  } catch {
    throw new Error(
      'Cannot reach the API. Run `npm run dev` (starts API + frontend) or `npm run dev:api` in another terminal. Ensure MySQL/XAMPP is running.'
    )
  }
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to load products'))
  }
  return response.json()
}

export const getProductById = async (id) => {
  let response
  try {
    response = await fetch(`/api/products/${id}`)
  } catch {
    throw new Error(
      'Cannot reach the API. Run `npm run dev` (starts API + frontend) or `npm run dev:api` in another terminal. Ensure MySQL/XAMPP is running.'
    )
  }
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, 'Failed to load product'))
  }
  return response.json()
}

export const loginUser = async ({ name, phone }) => {
  let response
  try {
    response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phone })
    })
  } catch {
    throw new Error(
      'Cannot reach the API. Run `npm run dev` (starts API + frontend) or `npm run dev:api` in another terminal. Ensure MySQL/XAMPP is running.'
    )
  }

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.message || 'Login failed')
  }

  return payload
}
