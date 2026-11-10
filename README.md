# Kunstatelier

A small web app (PWA) for signing up to art-studio sessions ("Ateliers") of my old Grammar School. Participants register, get activated by an admin, browse upcoming ateliers and enter or leave them. Admins create and edit ateliers and manage participants. Users get email notifications for activation, new or removed entries, atelier changes, reminders and password resets.

> **Status: archived.** This project is no longer running in production and is not maintained. It is published as-is for reference.

## Features

- Registration, login (JWT cookie), password reset by email, admin activation of new accounts
- Participant area: atelier overview, sign up / sign out, profile image, change email and password
- Admin area: create and edit ateliers, list and edit participants
- Email templates (German) for all notifications, plus scheduled reminders (`node-cron`)
- Installable PWA with service worker, offline page and iOS splash screens
- Privacy policy and impressum pages

## Tech stack

- Node.js, Express 4, EJS templates
- MySQL (`mysql2`), tables `accounts` and `ateliers`
- `jsonwebtoken`, `nodemailer`, `express-fileupload`, `sharp`, `node-cron`

## Getting started

Requirements: Node.js and a MySQL database.

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
dbHost=localhost
dbPort=3306
dbUser=...
dbPass=...
db=kunstatelier
jwtSecret=<long random string>
salt=<long random string>
emailUser=<smtp user>
emailPassword=<smtp password>
emailUserName=<sender address shown in emails>
apiUrl=<base url of the app>
```

The database schema is not included in the repo. It was reverse-engineered from the queries in `routes/` and `javascripts/`, which use the `accounts` and `ateliers` tables.

Run the app:

```bash
npm start
```

Use `npm test` for a development run with nodemon.

## Project layout

```
app.js            Express setup
bin/www           Server entry point
routes/           index (public), user (logged in), admin
javascripts/      Server-side logic (auth, entries, passwords, reminders, ...)
services/         MySQL connection and mailer
views/            EJS pages
emailTemplates/   HTML email templates
public/           Static assets, PWA manifest and service worker
```

## Known limitations

- Passwords are hashed with a single global salt (SHA plus `salt`). Use bcrypt or argon2 with per-user salts if you reuse this.
- The UI and emails are in German only.
- There are no tests and no database migrations.
