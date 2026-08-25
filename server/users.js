// Fixture accounts, seeded into MongoDB at startup by db.js.
// Passwords are bcrypt-hashed at rest -- see README for the plaintext dev logins.
export const users = [
  {
    id: 'usr_1',
    email: 'ana.ruiz@missionperform.com',
    name: 'Ana Ruiz',
    passwordHash: '$2b$10$pczeSq5iZ9P.f2ZtDGuzJuuYUVG42Cvnc/mzuUeoRhW46GEtj1GMq',
  },
  {
    id: 'usr_2',
    email: 'sam.okafor@missionperform.com',
    name: 'Sam Okafor',
    passwordHash: '$2b$10$6F1XPyae/PySIrlYsCFadeDUgl.f7Sv1TPjdTm/ojtbvG5THk.Y2y',
  },
]
