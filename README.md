# Viikkotapahtumat (Week Events Manager)

A simple weekly event management tool that helps organize and create a formatted list. This was created to streamline the creation of a list of student events during a week for the associations WordPress site. With automatic date handeling and easy event management the app has saved countles of my time durin 2025 as my tenure as the Communications Coordinator for Asteriski ry.

## What can it do?

- Add events for any day throughout the week
- Organize them by weekday (Monday through Sunday)
- Include all the important details: time, location, and whether signup is required
- Copy everything in a nicely formatted text that's ready to share anywhere
- Switch between Finnish and English
- Edit or delete events

## Key Features

### Week Selection

Choose any week you want to plan for. The app automatically shows the upcoming Monday by default, but you can pick any date.

### Event Management

Adding events is straightforward - just fill in the form with your event details:

- Name (Finnish is required, English is optional for bilingual events)
- Location (also bilingual support)
- Day of the week
- Start and end times
- Whether the event requires signup or is open for everyone

### Edit Mode

Made a mistake? Plans changed? Just hit the edit button and you can modify or delete individual events. There's even a "delete all" option if you need a fresh start.

### Bilingual Support

The app works in both Finnish and English. Switch between languages with a single click, and if you've provided translations for your events, they'll automatically show up in the selected language.

### Copy to Clipboard

This is where the magic happens. Once you've added all your events, click the copy button and get a WordPress ready text version of your entire week. It groups events by day, sorts them chronologically, and formats everything perfectly for pasting into messages, emails, social media posts, or wherever you need to share your schedule.

Example output:

```
Maanantai 19.1.
Koodikerho, 16:00 @Agora K124A

Torstai 22.1.
IT-Sitz ft. Digit, DaTe, Infå, 18:30 @Q-Talo (Ilmoittautuneille)
```

## Getting Started

It's pretty straightforward to get running:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser and you're good to go!

## How the API Works

The app uses a simple REST API for managing events:

- `GET /api` - Fetch all events
- `POST /api` - Create a new event
- `DELETE /api` - Delete all events
- `POST /api/[id]` - Update a specific event
- `DELETE /api/[id]` - Delete a specific event

All data is stored in a JSON file, which keeps things simple and doesn't require a database setup.

## Building for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

The app works great on any platform that supports Next.js - Vercel, Netlify, or your own server.

## Notes

- The app defaults to showing the next Monday, which makes sense for weekly planning
- Week numbers follow the ISO 8601 standard
- Dates are formatted Finnish-style (dd.mm.yyyy)

## Potential Improvements

Some ideas for future versions:

- Usage of a database to allow multi-user or presistent events
- Event templates for commonly repeated schedules
- Integration with actual calendar services to import events automatically

---

_Built with ❤️ for creating a weekly summary just a little bit easier._
