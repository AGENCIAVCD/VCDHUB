export const SINGLE_USER = {
  id: 1,
  name: "Bruno Ravaglia",
  email: "bruravaglia@hotmail.com",
  password: "vcd123",
};

export const DISPLAY_USERS = [
  { name: "Bruno Ravaglia", email: "bruravaglia@hotmail.com", enabled: true },
  { name: "Ana Souza", email: "ana@vocedigital.com", enabled: false },
  { name: "Carlos Lima", email: "carlos@vocedigital.com", enabled: false },
];

export function isSingleUserLogin(identifier: string, password: string) {
  const normalized = identifier.trim().toLowerCase();
  const matchesIdentifier =
    normalized === SINGLE_USER.email.toLowerCase() ||
    normalized === SINGLE_USER.name.toLowerCase();

  return matchesIdentifier && password === SINGLE_USER.password;
}
