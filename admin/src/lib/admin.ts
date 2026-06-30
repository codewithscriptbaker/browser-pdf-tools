export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();
  if (!adminEmail || !adminPassword) return false;
  return email.trim().toLowerCase() === adminEmail && password === adminPassword;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail;
}
