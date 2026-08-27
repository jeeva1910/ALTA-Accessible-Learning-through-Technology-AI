# Contributing to ALTA

Thank you for your interest in improving ALTA.

ALTA focuses on accessible learning workflows, so contributions should preserve usability for learners with different accessibility needs.

## Development Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a local `.env` file using `.env.example`.
4. Add the required development secrets locally.
5. Start the development server:

```bash
npm run dev
```

## Making Changes

1. Create a focused branch for your change.
2. Keep changes small and related to the issue/feature.
3. Do not commit `.env` files or credentials.
4. Preserve existing accessibility interactions.
5. Test the affected workflow in a supported browser/device where practical.
6. Run the type check:

```bash
npm run lint
```

## Pull Requests

A pull request should describe:
- what changed
- why it changed
- which workflow was tested
- any known limitations

For accessibility-related changes, mention keyboard, voice, screen-reader, haptic or other relevant interaction testing when applicable.

## Security

Do not submit API keys, passwords, tokens or other secrets. Security issues should be reported privately to the maintainers.
