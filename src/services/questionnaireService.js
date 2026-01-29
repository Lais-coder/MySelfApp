export async function sendToN8n(answers) {
  // Compatibility function kept for backwards compatibility
  return sendToApi(answers)
}

export async function sendToApi(answers) {
  const apiUrl = import.meta.env.VITE_API_URL || null
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || null

  // Build form data
  const form = new FormData()
  const payload = {}

  Object.entries(answers).forEach(([key, value]) => {
    if (value instanceof File) {
      form.append(`file_${key}`, value, value.name)
    } else {
      payload[key] = value
    }
  })

  form.append('payload', JSON.stringify(payload))

  if (apiUrl) {
    const url = `${apiUrl.replace(/\/$/, '')}/api/questionnaire`
    const res = await fetch(url, { method: 'POST', body: form })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`API retornou status ${res.status}: ${text}`)
    }
    return res.json().catch(() => null)
  }

  if (webhookUrl) {
    const res = await fetch(webhookUrl, { method: 'POST', body: form })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`n8n webhook retornou status ${res.status}: ${text}`)
    }
    return res.json().catch(() => null)
  }

  console.warn('Nenhuma URL de envio configurada (VITE_API_URL ou VITE_N8N_WEBHOOK_URL). Imprimindo respostas no console.')
  console.log('Questionnaire answers:', payload)
  return null
}
