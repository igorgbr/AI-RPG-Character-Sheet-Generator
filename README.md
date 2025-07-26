# 🎭 AI RPG Character Sheet Generator

Generate a complete, ready-to-play AI-powered character sheet for your tabletop RPG campaigns. Simply provide a few core concepts, and let AI build the rest!

[React](https://react.dev/) | [TypeScript](https://www.typescriptlang.org/) | [Google Gemini](https://ai.google.dev/)

---

![Character Sheet Example](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F1gu38f8inphbd21ghmna.png)

## ✨ Features

- **🤖 Full AI-Powered Generation** - Uses Google's **Gemini 2.5 Flash** for rich backstories and creative item names, and **Imagen 3.0** for high-quality character portraits and atmospheric backgrounds.
- **🌌 Limitless RPG Settings** - The AI adapts to any setting you can imagine, from classic fantasy to grimdark sci-fi.
- **📝 Customizable Characters** - Define your character's name, race, alignment (inclination), and RPG setting.
- **🎲 Randomized Stat Distribution** - Automatically distributes points across main, secondary, and unique AI-generated extra skills.
- **📜 AI-Generated History & Items** - Creates a unique backstory, a custom weapon, and a defensive item tailored to your character's profile.
- **🎨 Dynamic Theming** - The app's entire color scheme changes based on the RPG setting (e.g., horror, fantasy) for a more immersive experience.
- **🌐 Multilingual Support** - Fully available in English (US) and Portuguese (BR), including AI-generated content.
- **💾 Downloadable Sheets** - Export your final character sheet as a high-quality **JPG** or **PDF**.
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices.

## 🎮 Limitless RPG Settings

Unlike generators with predefined universes, this application allows you to enter **any RPG setting** in a text field. The AI will intelligently adapt the character's description, skills, items, and artistic style to match your input.

**Some examples include:**
- `Medieval Fantasy`
- `Cyberpunk Dystopia`
- `Post-Apocalyptic Wasteland`
- `Vampire Horror in the 19th Century`
- `Space Opera with Alien Races`
- `Lovecraftian Cosmic Horror`

## 🚀 Quick Start

### Prerequisites

- A modern web browser.
- **Google Gemini API Key** ([Get one from Google AI Studio](https://makersuite.google.com/app/apikey))

### Running Locally

This project is set up as a client-side application and does not require a complex build process.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/ai-rpg-character-sheet.git
    cd ai-rpg-character-sheet
    ```

2.  **Set up the API Key**
    The application is designed to be deployed in an environment where the `API_KEY` is securely set. To run it locally, you can create a simple bootstrap file.

    Create a file named `dev-runner.html` and paste the following, replacing `your_actual_api_key_here` with your key:
    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dev Runner</title>
      <script>
        // WARNING: For local development only. Do not commit your API key.
        // This simulates setting an environment variable before the app loads.
        window.process = {
          env: {
            API_KEY: 'your_actual_api_key_here'
          }
        };
      </script>
    </head>
    <body>
      <p>Loading application...</p>
      <script>
        // Redirect to the main application file
        window.location.href = './index.html';
      </script>
    </body>
    </html>
    ```

3.  **Start a local server**
    You need a simple HTTP server to handle module imports correctly. If you have Node.js, you can use `serve`:
    ```bash
    # Install serve globally if you don't have it
    npm install -g serve

    # Run the server
    serve .
    ```
    
4.  **Open your browser**
    Navigate to the local server address and open `dev-runner.html`. This will set the key and then load the application.

## 📁 Project Structure

```
ai-rpg-character-sheet/
├── components/                 # Reusable React components
│   ├── CharacterForm.tsx
│   ├── CharacterSheet.tsx
│   ├── LanguageSwitcher.tsx
│   ├── Spinner.tsx
│   └── StatBlock.tsx
├── context/                    # React Context providers
│   └── i18n.tsx
├── locales/                    # Translation files
│   └── translations.ts
├── services/                   # API services
│   └── geminiService.ts        # Gemini & Imagen API integration
├── utils/                      # Utility functions
│   └── distribution.ts
├── App.tsx                     # Main application component
├── constants.ts                # Application constants (skills, etc.)
├── types.ts                    # TypeScript type definitions
├── index.html                  # Main HTML entry point
├── index.tsx                   # Application entry point
├── metadata.json               # Application metadata
└── README.md                   # This file
```

## 🎯 How It Works

1.  **User Input:** The user fills out a simple form with the character's name, race, alignment, and RPG setting.
2.  **AI Generation:** On submission, the app makes parallel calls to the Google Gemini API:
    - **`gemini-2.5-flash`** is prompted to generate a JSON array of extra skills, a unique weapon name, and a shield name, all based on the setting.
    - After stats are rolled, `gemini-2.5-flash` is prompted again to write a detailed character history, weaving together all the known attributes.
    - **`imagen-3.0-generate-002`** is prompted twice: once to generate the character's portrait and once to create an atmospheric background landscape matching the setting.
3.  **Sheet Assembly:** The React front-end combines the user's input, the randomly distributed stats, and all the AI-generated content into a single data object.
4.  **Dynamic Display:** The character sheet is rendered with the appropriate theme (e.g., sepia filter for fantasy, red/black for horror), and the long history text is made collapsible with a "Read more" button.

## 🎨 Customization

-   **Modify Skills:** Add, remove, or change the main and secondary skills directly in the `constants.ts` file. The point distribution logic will adapt automatically.
-   **Tweak AI Prompts:** Adjust the prompts sent to Gemini by editing the strings in `locales/translations.ts`. This allows you to change the tone, length, or style of the AI-generated content.
-   **Adjust Theming:** The logic for applying themes based on setting keywords is located in `App.tsx`. You can add new keywords or create entirely new themes.

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a feature branch, and open a Pull Request.

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgments

-   **Google Gemini** for the powerful generative AI capabilities.
-   **React** and **Tailwind CSS** for the modern development framework and styling.
-   The global **TTRPG community** for being a constant source of inspiration.

---

Made with ❤️ for Game Masters and Players everywhere.
