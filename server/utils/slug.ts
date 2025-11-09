import { nanoid } from 'nanoid';

export function generateSlug(): string {
  // Generate a short, URL-safe slug (8 characters)
  return nanoid(8);
}

export function generateSecretToken(): string {
  // Generate a longer secret token (32 characters)
  return nanoid(32);
}
