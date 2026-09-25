export type Language = 'en' | 'ta';

export const translations = {
  en: {
    // Brand & Header
    productName: "RainGuard AI",
    teamName: "Innovexa",
    tagline: "From Rainfall Intelligence to Actionable Flood Warnings.",
    goodEvening: "Good Evening",
    dashboardSubtitle: "Current rainfall and inundation situation overview.",
    liveData: "LIVE DATA",
    demoMode: "DEMO MODE",
    lastUpdated: "Last updated",

    // Navigation
    navDashboard: "Dashboard",
    navLiveMonitoring: "Live Monitoring",
    navRainfallForecast: "Rainfall Forecast",
    navInundationPrediction: "Inundation Prediction",
    navRiskMap: "Risk Map",
    navAlerts: "Alerts",
    navHistoricalAnalysis: "Historical Analysis",
    navModelInsights: "Model Insights",
    navReports: "Reports",
    navDataSources: "Data Sources",
    navSettings: "Settings",
    navEmergencyResponse: "Emergency Response",
    navExplainableAI: "Explainable AI",
    navReliability: "Reliability",
    navEarlyWarning: "Early Warning",
    navForecastVsObserved: "Forecast vs Observed",

    // Status Badges
    statusNormal: "NORMAL",
    statusWatch: "WATCH",
    statusAlert: "ALERT",
    statusSevere: "SEVERE",
    statusCritical: "CRITICAL",

    // Stat Cards
    activeAlerts: "Active Warnings",
    heavyRainfallZones: "Heavy Rainfall Zones",
    highRiskAreas: "High-Risk Areas",
    predictedInundation: "Predicted Inundation",
    monitoringStations: "Monitoring Stations",
    dataSources: "Data Sources",

    // Common Buttons
    view: "View",
    viewOnMap: "View on Map",
    acknowledge: "Acknowledge",
    escalate: "Escalate",
    close: "Close",
    exportReport: "Export Report",
    generateBriefing: "Generate Situation Briefing",
    simulate: "Run Simulation",
    refresh: "Refresh Data",
    login: "Log In",
    logout: "Log Out",
    quickDemoLogin: "Quick Demo Access",

    // Connectivity & Storage
    online: "ONLINE",
    syncing: "SYNCING",
    offline: "OFFLINE",
    offlineNotice: "Offline mode: updates are stored locally and will synchronize when connectivity is restored.",
    syncedNotice: "All available updates synchronized.",
    lowBandwidth: "Low Bandwidth Mode",
    lowBandwidthActive: "Low Bandwidth Active — High-resolution tiles paused",

    // Disclaimers
    responsibleAIDisclaimer: "RainGuard AI is an AI-based decision-support prototype. Predictions should be interpreted together with official meteorological, hydrological and disaster-management information.",
    prototypeThresholdNotice: "Prototype Warning Thresholds — Research & decision-support benchmarking only.",
    xaiDisclaimer: "Highlighted features represent variables that contributed to the model output. Model attribution indicates association with the model output and should not be interpreted as proof of physical causation.",
    reliabilityDisclaimer: "AI decision-support reliability indicator. Reliability does not represent certainty that a future event will occur.",

    // Risk & Inundation
    hazard: "Hazard",
    exposure: "Exposure",
    vulnerability: "Vulnerability",
    waterDepth: "Predicted Water Depth",
    inundationExtent: "Inundation Extent",
    reliabilityRating: "Reliability Rating",
    leadTime: "Lead Time",
    expectedWindow: "Expected Window",

    // Table Headers
    id: "ID",
    location: "Location",
    severity: "Severity",
    issued: "Issued",
    expires: "Expires",
    status: "Status",
    action: "Action"
  },
  ta: {
    // Brand & Header
    productName: "ரெயின்கார்ட் AI",
    teamName: "இன்னோவெக்சா",
    tagline: "மழைக்கால தகவல்களிலிருந்து செயல்முறை வெள்ள அபாய எச்சரிக்கைகள் வரை.",
    goodEvening: "மாலை வணக்கம்",
    dashboardSubtitle: "தற்போதைய மழைப்பொழிவு மற்றும் வெள்ளப் பெருக்கு நிலைமை மேலோட்டம்.",
    liveData: "நேரலை தரவு",
    demoMode: "செயல்விளக்க பயன்முறை",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",

    // Navigation
    navDashboard: "கட்டுப்பாட்டு மையம்",
    navLiveMonitoring: "நேரலை கண்காணிப்பு",
    navRainfallForecast: "மழைப்பொழிவு முன்னறிவிப்பு",
    navInundationPrediction: "வெள்ளநீர் தேங்குதல் கணிப்பு",
    navRiskMap: "அபாய வரைபடம்",
    navAlerts: "எச்சரிக்கைகள்",
    navHistoricalAnalysis: "வரலாற்று நிகழ்வுகள்",
    navModelInsights: "மாதிரி நுண்ணறிவு",
    navReports: "அறிக்கைகள்",
    navDataSources: "தரவு மூலங்கள்",
    navSettings: "அமைப்புகள்",
    navEmergencyResponse: "அவசர மீட்பு பணி",
    navExplainableAI: "விளக்கக்கூடிய AI (XAI)",
    navReliability: "நம்பகத்தன்மை",
    navEarlyWarning: "முன்னெச்சரிக்கை மையம்",
    navForecastVsObserved: "கணிப்பு vs கள உண்மை",

    // Status Badges
    statusNormal: "இயல்பு நிலை (NORMAL)",
    statusWatch: "கண்காணிப்பு (WATCH)",
    statusAlert: "எச்சரிக்கை (ALERT)",
    statusSevere: "தீவிர அபாயம் (SEVERE)",
    statusCritical: "அதிதீவிர அபாயம் (CRITICAL)",

    // Stat Cards
    activeAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    heavyRainfallZones: "கனமழை மண்டலங்கள்",
    highRiskAreas: "உயர் அபாயப் பகுதிகள்",
    predictedInundation: "கணிக்கப்பட்ட வெள்ளப் பரப்பு",
    monitoringStations: "வானிலை நிலையங்கள்",
    dataSources: "தரவு மூலங்கள்",

    // Common Buttons
    view: "பார்வையிடு",
    viewOnMap: "வரைபடத்தில் காண்க",
    acknowledge: "ஒப்புக்கொள்",
    escalate: "தீவிரப்படுத்து",
    close: "முடிவுக்கு கொண்டுவா",
    exportReport: "அறிக்கையை பதிவிறக்கு",
    generateBriefing: "நிலைமை அறிக்கையை உருவாக்கு",
    simulate: "மாதிரியை இயக்கு",
    refresh: "புதுப்பி",
    login: "உள்நுழைக",
    logout: "வெளியேறு",
    quickDemoLogin: "விரைவு சோதனை அணுகல்",

    // Connectivity & Storage
    online: "இணையத்தில் உள்ளது",
    syncing: "ஒத்திசைக்கப்படுகிறது",
    offline: "இணையம் இல்லை",
    offlineNotice: "ஆஃப்லைன் பயன்முறை: மாற்றங்கள் உள்ளூரில் சேமிக்கப்பட்டு, இணையம் கிடைத்ததும் ஒத்திசைக்கப்படும்.",
    syncedNotice: "அனைத்து மாற்றங்களும் ஒத்திசைக்கப்பட்டன.",
    lowBandwidth: "குறைந்த அலைவரிசை பயன்முறை",
    lowBandwidthActive: "குறைந்த அலைவரிசை பயன்முறை செயலில் உள்ளது — உயர் தெளிவுத்திறன் வரைபடங்கள் நிறுத்தப்பட்டுள்ளன",

    // Disclaimers
    responsibleAIDisclaimer: "ரெயின்கார்ட் AI என்பது முடிவெடுக்கும் ஆதரவிற்கான ஒரு AI முன்மாதிரி அமைப்பாகும். இதன் முடிவுகள் அதிகாரப்பூர்வ இந்திய வானிலை ஆய்வு மையம் (IMD) மற்றும் பேரிடர் மேலாண்மை தகவல்களுடன் ஒப்பிட்டு பரிசீலிக்கப்பட வேண்டும்.",
    prototypeThresholdNotice: "முன்மாதிரி எச்சரிக்கை வரம்புகள் — ஆராய்ச்சி மற்றும் பயிற்சி பயன்பாட்டிற்கு மட்டுமே.",
    xaiDisclaimer: "காட்டப்படும் மாறிகள் மாதிரியின் முடிவுக்கு பங்களித்த காரணிகள் மட்டுமே. இது இயற்பியல் காரண காரியத்திற்கான உறுதியான சான்றாக எடுத்துக்கொள்ளப்படக் கூடாது.",
    reliabilityDisclaimer: "AI முடிவெடுக்கும் நம்பகத்தன்மை குறியீடு. இது எதிர்கால நிகழ்வு உறுதியாக நிகழும் என்பதற்கான முழு உத்தரவாதம் அல்ல.",

    // Risk & Inundation
    hazard: "இயற்கை இடர்",
    exposure: "பாதிப்புக்குள்ளாகும் அளவு",
    vulnerability: "பாதிப்பு திறன்",
    waterDepth: "கணிக்கப்பட்ட நீர் ஆழம்",
    inundationExtent: "வெள்ளப் பரப்பு",
    reliabilityRating: "நம்பகத்தன்மை மதிப்பீடு",
    leadTime: "எச்சரிக்கை அவகாசம்",
    expectedWindow: "எதிர்பார்க்கப்படும் நேரம்",

    // Table Headers
    id: "எண்",
    location: "இடம்",
    severity: "தீவிரம்",
    issued: "வெளியிடப்பட்டது",
    expires: "காலாவதி",
    status: "நிலை",
    action: "செயல்"
  }
};
