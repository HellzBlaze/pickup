md
# Antartican Co. - Next.js Application

This project is a Next.js application for Antartican Co., a fictional food ordering platform. It's built with modern web technologies and designed to be easily extensible.

## Getting Started

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    This project uses npm.
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project. You can copy the structure from `.env` (which is empty by default) or start fresh.
    Example `.env.local`:
    ```
    # Google AI API Key for Genkit (if using AI features)
    GOOGLE_API_KEY=your_google_api_key_here

    # Other environment variables as needed
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002`.

5.  **(Optional) Run Genkit development server (for AI features):**
    If you are working with AI features powered by Genkit, run this in a separate terminal:
    ```bash
    npm run genkit:dev
    ```

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript to check for type errors.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with watch mode.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **UI Library:** [React](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) (with Google AI)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Deployment

*   **Firebase App Hosting:** This project is configured for deployment with Firebase App Hosting (see `apphosting.yaml`).
*   **Vercel:** As a Next.js project, Vercel (from the creators of Next.js) is an excellent platform for deployment.
*   **Other Platforms:** Can be deployed to other Node.js compatible hosting platforms.

## Project Structure

A brief overview of the key directories:

*   `src/app/`: Contains all the routes, pages, and layouts (using Next.js App Router).
*   `src/components/`: Shared UI components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/features/`: Feature-specific components (e.g., cart, checkout).
    *   `src/components/layout/`: Layout components like header and footer.
*   `src/ai/`: Genkit related code, including flows.
*   `src/context/`: React context providers (e.g., CartContext).
*   `src/data/`: Mock data used in the application.
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions.
*   `public/`: Static assets.

## `.gitignore`

This project includes a `.gitignore` file tailored for Next.js projects. This file ensures that unnecessary build artifacts, local configuration files, and sensitive information are not committed to version control. Key ignored items include:

*   `node_modules/`: Project dependencies.
*   `.next/`: Next.js build output.
*   `.env.local`: Local environment variables (potentially sensitive).
*   Log files, editor-specific files, and OS-specific files.

Review the `.gitignore` file for a complete list.

## Contributing

Contributions are welcome! If you'd like to contribute, please consider the following:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  **Make your changes.** Ensure you follow the existing code style and conventions.
4.  **Test your changes thoroughly.**
5.  **Ensure linting and type checks pass** (`npm run lint` and `npm run typecheck`).
6.  **Commit your changes** with a clear and descriptive commit message.
7.  **Push your branch** to your forked repository.
8.  **Open a pull request** to the original repository, detailing the changes you've made.

## License

This project is currently unlicensed as it is marked private in `package.json`. If you intend to make this project open source, please choose an appropriate license and add a `LICENSE` file to the root of the project. You can find help choosing a license at [choosealicense.com](https://choosealicense.com/).

---

This project was prototyped using Firebase Studio.
