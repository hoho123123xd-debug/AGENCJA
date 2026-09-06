import { z } from 'zod'

/**
 * Jedyne miejsce definiujące kształt danych z formularza kontaktowego.
 * Walidacja jest wykonywana WYŁĄCZNIE po stronie serwera (w route handlerze)
 * — walidacja w przeglądarce to tylko UX, nigdy nie jest źródłem prawdy.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Podaj imię i nazwisko.').max(120),
  email: z.string().trim().email('Podaj poprawny adres e-mail.').max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+0-9 ()-]*$/, 'Niepoprawny format telefonu.')
    .optional()
    .or(z.literal('')),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Wiadomość musi mieć co najmniej 10 znaków.').max(5000),
  interestedService: z.string().trim().max(100).optional().or(z.literal('')),
  // Honeypot — pole niewidoczne dla ludzi w UI. Boty formularzowe je
  // wypełniają; jeśli ma wartość, zgłoszenie jest cicho odrzucane.
  website: z.string().max(200).optional().or(z.literal('')),
})

export type LeadInput = z.infer<typeof leadSchema>
