import { z } from 'zod'

/** PocketBase record ids: 15 lowercase alphanumerics. */
export const recordId = z.string().regex(/^[a-z0-9]{15}$/, 'Invalid id')

export const pageNumber = z.number().int().min(1).max(1000)

export const searchScope = z.object({
  kind: z.literal('search'),
  query: z.string().trim().min(1).max(100),
})

export const feedScope = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('all') }),
  z.object({ kind: z.literal('author'), authorId: recordId }),
  searchScope,
])
export type FeedScope = z.infer<typeof feedScope>

const password = z
  .string()
  .min(8, 'At least 8 characters')
  .max(72, 'At most 72 characters')
  .regex(/\d/, 'Include at least one number')

export const loginSchema = z.object({
  identity: z.string().trim().min(1, 'Enter your email or username'),
  password: z.string().min(1, 'Enter your password'),
})

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name').max(60),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_]{3,30}$/, '3–30 characters: letters, numbers and underscores'),
    email: z.email('Enter a valid email'),
    password,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  })

const MB = 1024 * 1024

export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export const createPostSchema = z.object({
  caption: z.string().trim().max(280, 'At most 280 characters'),
  video: z
    .instanceof(File, { message: 'Choose a video' })
    .refine((file) => file.size > 0, 'Choose a video')
    .refine((file) => file.size <= 50 * MB, 'Videos can be up to 50 MB')
    .refine((file) => VIDEO_TYPES.includes(file.type), 'Use an MP4, WebM or MOV file'),
})

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(60),
  bio: z.string().trim().max(160, 'At most 160 characters'),
  avatar: z
    .instanceof(File)
    .optional()
    .transform((file) => (file && file.size > 0 ? file : undefined))
    .refine((file) => !file || file.size <= 5 * MB, 'Images can be up to 5 MB')
    .refine((file) => !file || IMAGE_TYPES.includes(file.type), 'Use a JPEG, PNG, WebP or GIF'),
})

export const commentSchema = z.object({
  content: z.string().trim().min(1, 'Write something first').max(500, 'At most 500 characters'),
})

/** Shape returned by every form action, consumed with `useActionState`. */
export type FormState = {
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
  values?: Record<string, string>
}

export function fieldErrors(error: z.ZodError): FormState['fieldErrors'] {
  return z.flattenError(error).fieldErrors as FormState['fieldErrors']
}
