'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const ContactForm = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    const form = new FormData(event.currentTarget)
    const body = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      company: form.get('company'),
      message: form.get('message'),
      website: form.get('website'), // honeypot
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const payload = (await res.json().catch((): null => null)) as { error?: string } | null
        setErrorMessage(payload?.error ?? 'Coś poszło nie tak. Spróbuj ponownie.')
        setStatus('error')
        return
      }

      setStatus('success')
      event.currentTarget.reset()
    } catch {
      setErrorMessage('Brak połączenia. Spróbuj ponownie.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p role="status">Dziękujemy! Odezwiemy się najszybciej, jak to możliwe.</p>
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p hidden aria-hidden="true">
        <label>
          Zostaw puste
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p>
        <label htmlFor="name">Imię i nazwisko</label>
        <input id="name" name="name" type="text" required minLength={2} maxLength={120} />
      </p>
      <p>
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required maxLength={200} />
      </p>
      <p>
        <label htmlFor="phone">Telefon (opcjonalnie)</label>
        <input id="phone" name="phone" type="tel" maxLength={30} />
      </p>
      <p>
        <label htmlFor="company">Firma (opcjonalnie)</label>
        <input id="company" name="company" type="text" maxLength={200} />
      </p>
      <p>
        <label htmlFor="message">Wiadomość</label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={5} />
      </p>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}

      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Wysyłanie…' : 'Wyślij'}
      </button>
    </form>
  )
}
