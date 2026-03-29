export const translations = {
  en: {
    navHome: "Home",
    navDashboard: "Dashboard",
    navTutorial: "How to implement",

    themeLight: "Light mode",
    themeDark: "Dark mode",

    eyebrow: "Add leaderboards to your game easily",
    heroTitle: "Manage a leaderboard for your game.",
    heroText:
      "Scoreforge is a multi-tenant leaderboard SaaS built for game developers. Create and manage leaderboards for your games without the hassle of building and maintaining your own backend. Focus on making great games while we handle the leaderboard infrastructure.",

    featureProjectTitle: "Project-based setup",
    featureProjectText:
      "Create one project per game and keep every leaderboard isolated.",

    featureApiTitle: "Secure API keys",
    featureApiText:
      "Generate keys for game clients and backend integrations safely.",

    featureFastTitle: "Fast integration",
    featureFastText:
      "Connect your game quickly and focus on gameplay instead of backend work.",

    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    howToImplement: "How to implement",

    welcomeBack: "Welcome back",
    createYourAccount: "Create your account",

    subtitleLogin:
      "Login to manage projects, generate API keys and control your leaderboard SaaS.",
    subtitleRegister:
      "Create a dashboard account and start managing game leaderboard projects.",

    username: "Username",
    email: "Email",
    password: "Password",

    enterUsername: "Enter your username",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",

    createAccount: "Create account",
    creatingAccount: "Creating account...",
    loggingIn: "Logging in...",

    missingApiBase: "Missing NEXT_PUBLIC_API_BASE in .env.local",
    registerFailed: "Register failed",
    loginFailed: "Login failed",
    accountCreated: "Account created successfully. You can now log in.",
    somethingWentWrong: "Something went wrong",

    dashboardTitle: "Dashboard",
    viewLeaderboard: "View leaderboard",
    logout: "Logout",
    dashboardSubtitle:
      "Manage your leaderboard projects, generate API keys for your game clients, and keep your backend workflow simple and clean.",

    createProjectTitle: "Create a new project",
    createProjectText:
      "Each game should have its own project. That keeps scoreboards isolated and easier to manage.",
    enterProjectName: "Enter project name",
    createProject: "Create project",

    overview: "Overview",
    overviewText: "Quick summary of your current workspace state.",
    projects: "Projects",
    apiMode: "API Mode",
    bearerApiKey: "Bearer + API Key",

    yourProjects: "Your projects",
    yourProjectsText:
      "Generate a project key when you are ready to connect your game.",
    projectId: "Project ID",
    generateApiKey: "Generate API key",
    noProjectsYet: "No projects yet.",
    saveApiKeyNow: "Save it now. It will not be shown again.",
    yourApiKeyShownOnce: "Your API key (shown once)",

    failedLoadProjects: "Failed to load projects",
    createProjectFailed: "Create project failed",
    createKeyFailed: "Create key failed",
    apiKeyAlreadyExists: "API key already exists. Rotate it if you lost it.",

    leaderboardTitle: "Leaderboard",
    backToDashboard: "Back to dashboard",
    leaderboardSubtitle:
      "Load the public leaderboard of any project using its project ID.",
    enterProjectId: "Enter Project ID",
    loadLeaderboard: "Load leaderboard",
    pleaseEnterProjectId: "Please enter a project ID.",
    failedLoadLeaderboard: "Failed to load leaderboard",
    noLeaderboardData: "No leaderboard data loaded yet.",
    rank: "Rank",
    score: "Score",

    tutorialSectionTitle: "How to integrate it in Godot",
    tutorialSectionSubtitle:
      "This guide shows the real flow to connect a Godot game with Scoreforge: create a project, generate an API key, submit scores, and read the public leaderboard.",
    tutorialStep1Title: "1. Create your project",
    tutorialStep1Text:
      "Open the dashboard, create a project for your game, and note its project ID. Then generate the API key. The API key is shown once, so save it immediately.",
    tutorialStep2Title: "2. Submit scores from Godot",
    tutorialStep2Text:
      "Use an HTTPRequest node to send a POST request to Scoreforge with the X-API-Key header. The URL stays the Scoreforge service URL. What changes is your API key and the score data you send.",
    tutorialStep3Title: "3. Read the public leaderboard",
    tutorialStep3Text:
      "Use the project ID shown in your dashboard and request the public leaderboard endpoint. You can display the returned JSON directly inside your game UI.",

    tutorialCodeTitle: "Godot example: submit score and fetch leaderboard",
    tutorialCodeHint:
      "Keep the Scoreforge base URL as-is. Replace only YOUR_API_KEY_HERE and YOUR_PROJECT_ID_HERE with the values from your dashboard.",
    tutorialSubmitTitle: "Submit endpoint",
    tutorialSubmitText:
      "POST /scores/submit with headers Content-Type: application/json and X-API-Key: YOUR_API_KEY",
    tutorialLeaderboardTitle: "Leaderboard endpoint",
    tutorialLeaderboardText:
      "GET /scores/leaderboard/YOUR_PROJECT_ID?limit=20 to retrieve the public ranking list.",
    tutorialExtraTitle: "What you need from the dashboard",
    tutorialExtraText:
      "You need 2 things: the API key for score submission, and the project ID to read the leaderboard.",

    tutorialCodeFile: "scoreforge_example.gd",
    tutorialCodeBadge: "Godot GDScript",

    copyCode: "Copy code",
    copiedCode: "Copied!"
  },

  es: {
    navHome: "Inicio",
    navDashboard: "Panel",
    navTutorial: "Cómo implementarlo",

    themeLight: "Modo claro",
    themeDark: "Modo oscuro",

    eyebrow: "Añade leaderboards a tu juego fácilmente",
    heroTitle: "Gestiona un leaderboard para tu juego.",
    heroText:
      "Scoreforge es un SaaS multi-tenant de leaderboards creado para desarrolladores de videojuegos. Crea y gestiona leaderboards para tus juegos sin la molestia de construir y mantener tu propio backend. Concéntrate en crear grandes juegos mientras nosotros gestionamos la infraestructura del leaderboard.",

    featureProjectTitle: "Configuración por proyecto",
    featureProjectText:
      "Crea un proyecto por juego y mantén cada leaderboard aislado.",

    featureApiTitle: "API keys seguras",
    featureApiText:
      "Genera claves para clientes de juego e integraciones backend de forma segura.",

    featureFastTitle: "Integración rápida",
    featureFastText:
      "Conecta tu juego rápidamente y céntrate en el gameplay en lugar del backend.",

    login: "Iniciar sesión",
    register: "Registrarse",
    dashboard: "Panel",
    howToImplement: "Cómo implementarlo",

    welcomeBack: "Bienvenido de nuevo",
    createYourAccount: "Crea tu cuenta",

    subtitleLogin:
      "Inicia sesión para gestionar proyectos, generar API keys y controlar tu SaaS de leaderboards.",
    subtitleRegister:
      "Crea una cuenta de panel y empieza a gestionar leaderboards para tus juegos.",

    username: "Usuario",
    email: "Correo",
    password: "Contraseña",

    enterUsername: "Introduce tu usuario",
    enterEmail: "Introduce tu correo",
    enterPassword: "Introduce tu contraseña",

    createAccount: "Crear cuenta",
    creatingAccount: "Creando cuenta...",
    loggingIn: "Iniciando sesión...",

    missingApiBase: "Falta NEXT_PUBLIC_API_BASE en .env.local",
    registerFailed: "Registro fallido",
    loginFailed: "Inicio de sesión fallido",
    accountCreated: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
    somethingWentWrong: "Algo salió mal",

    dashboardTitle: "Panel",
    viewLeaderboard: "Ver leaderboard",
    logout: "Cerrar sesión",
    dashboardSubtitle:
      "Gestiona tus proyectos de leaderboard, genera API keys para tus clientes de juego y mantén tu flujo backend simple y limpio.",

    createProjectTitle: "Crea un nuevo proyecto",
    createProjectText:
      "Cada juego debería tener su propio proyecto. Así mantienes los leaderboards aislados y más fáciles de gestionar.",
    enterProjectName: "Introduce el nombre del proyecto",
    createProject: "Crear proyecto",

    overview: "Resumen",
    overviewText: "Resumen rápido del estado actual de tu espacio de trabajo.",
    projects: "Proyectos",
    apiMode: "Modo API",
    bearerApiKey: "Bearer + API Key",

    yourProjects: "Tus proyectos",
    yourProjectsText:
      "Genera una clave de proyecto cuando estés listo para conectar tu juego.",
    projectId: "ID del proyecto",
    generateApiKey: "Generar API key",
    noProjectsYet: "Aún no hay proyectos.",
    saveApiKeyNow: "Guárdala ahora. No se volverá a mostrar.",
    yourApiKeyShownOnce: "Tu API key (mostrada una sola vez)",

    failedLoadProjects: "No se pudieron cargar los proyectos",
    createProjectFailed: "No se pudo crear el proyecto",
    createKeyFailed: "No se pudo crear la clave",
    apiKeyAlreadyExists: "La API key ya existe. Rótala si la has perdido.",

    leaderboardTitle: "Leaderboard",
    backToDashboard: "Volver al panel",
    leaderboardSubtitle:
      "Carga el leaderboard público de cualquier proyecto usando su ID.",
    enterProjectId: "Introduce el ID del proyecto",
    loadLeaderboard: "Cargar leaderboard",
    pleaseEnterProjectId: "Introduce un ID de proyecto.",
    failedLoadLeaderboard: "No se pudo cargar el leaderboard",
    noLeaderboardData: "Aún no se han cargado datos del leaderboard.",
    rank: "Puesto",
    score: "Puntuación",

    tutorialSectionTitle: "Cómo integrarlo en Godot",
    tutorialSectionSubtitle:
      "Esta guía muestra el flujo real para conectar un juego en Godot con Scoreforge: crear proyecto, generar API key, enviar puntuaciones y leer el leaderboard público.",
    tutorialStep1Title: "1. Crea tu proyecto",
    tutorialStep1Text:
      "Abre el panel, crea un proyecto para tu juego y anota su project ID. Después genera la API key. La API key solo se muestra una vez, así que guárdala al momento.",
    tutorialStep2Title: "2. Envía puntuaciones desde Godot",
    tutorialStep2Text:
      "Usa un nodo HTTPRequest para enviar una petición POST a Scoreforge con la cabecera X-API-Key. La URL debe seguir siendo la del servicio Scoreforge. Lo que cambia es tu API key y los datos de puntuación que envías.",
    tutorialStep3Title: "3. Lee el leaderboard público",
    tutorialStep3Text:
      "Usa el project ID que aparece en tu panel y consulta el endpoint público del leaderboard. El JSON devuelto puedes mostrarlo directamente dentro de la UI de tu juego.",

    tutorialCodeTitle: "Ejemplo Godot: enviar score y leer leaderboard",
    tutorialCodeHint:
      "Mantén la URL base de Scoreforge tal cual. Sustituye solo YOUR_API_KEY_HERE y YOUR_PROJECT_ID_HERE con los valores de tu panel.",
    tutorialSubmitTitle: "Endpoint para enviar score",
    tutorialSubmitText:
      "POST /scores/submit con las cabeceras Content-Type: application/json y X-API-Key: TU_API_KEY",
    tutorialLeaderboardTitle: "Endpoint para leer el leaderboard",
    tutorialLeaderboardText:
      "GET /scores/leaderboard/YOUR_PROJECT_ID?limit=20 para obtener el listado público de puntuaciones.",
    tutorialExtraTitle: "Qué necesitas sacar del panel",
    tutorialExtraText:
      "Necesitas 2 cosas: la API key para enviar puntuaciones y el project ID para leer el leaderboard.",

    tutorialCodeFile: "scoreforge_example.gd",
    tutorialCodeBadge: "Godot GDScript",

    copyCode: "Copiar código",
    copiedCode: "¡Copiado!"
  }
};