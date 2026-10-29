export type Language = 'es' | 'en';

export interface Translations {
  navbar: {
    portalB2b: string;
    live: string;
    systemInfoTooltip: string;
    ownerView: string;
    managerView: string;
    supportTicket: string;
    supportTooltip: string;
    allBranches: string;
    singleBranch: string;
    multiBranchUpsell: string;
    brandProfile: string;
    soundOn: string;
    soundOff: string;
    testAlert: string;
    lightMode: string;
    darkMode: string;
    logout: string;
    languageSelector: string;
  };
  tabs: {
    radar: string;
    complaints: string;
    qr: string;
    reactivate: string;
    giveaways: string;
    ai: string;
    reports: string;
    profile: string;
    branchesBadge: string;
  };
  radar: {
    title: string;
    badge: string;
    subtitle: string;
    statTotal: string;
    statRating: string;
    statPending: string;
    statResponseRate: string;
    filterAll: string;
    filterUnanswered: string;
    filterAnswered: string;
    filterFiveStars: string;
    filterCritical: string;
    searchPlaceholder: string;
    noReviews: string;
    noMatches: string;
    loading: string;
    arrival: string;
    unansweredPriority: string;
    answered: string;
    officialReplyTitle: string;
    attendedIn: string;
    repliedOn: string;
    attendedBy: string;
    teamPrestigia: string;
    generateAiReply: string;
    regenerateAiReply: string;
    manualReply: string;
    editManualReply: string;
    cancelManualReply: string;
    saveManualReply: string;
    manualReplyPlaceholder: string;
    openInMaps: string;
    copyReview: string;
    copiedReview: string;
    copyReply: string;
    copiedReply: string;
  };
  dashboard: {
    priorityAlertTitle: string;
    unansweredGoogleReviewsSingular: string;
    unansweredGoogleReviewsPlural: string;
    andConjunction: string;
    unrescuedPrivateComplaintsSingular: string;
    unrescuedPrivateComplaintsPlural: string;
    viewGoogleReviews: string;
    viewWhatsappComplaints: string;
    metricTodayTitle: string;
    metricTodayBadge: string;
    onGoogleMaps: string;
    privateQr: string;
    metricAnsweredTitle: string;
    metricEffectiveness: string;
    shiftFullAttention: string;
    ofAttendedToday: string;
    metricPendingTitle: string;
    metricRequiresAction: string;
    metricUpToDate: string;
    onGoogle: string;
    privateComplaints: string;
    metricRatingTitle: string;
    complaintsNeutralized: string;
    pushBannerTitle: string;
    pushBannerText: string;
    pushBannerButton: string;
    alertRescueAi: string;
    alertViewComplaint: string;
    alertReplyAi: string;
    alertViewRadar: string;
    alertDismiss: string;
    priorityBadge: string;
  };
  complaints: {
    title: string;
    blockedBadge: string;
    subtitle: string;
    loading: string;
    empty: string;
    hiddenInBasic: string;
    arrival: string;
    pendingBadge: string;
    resolvedBadge: string;
    complaintReasonLabel: string;
    attendedByLabel: string;
    resolvedOn: string;
    rescuedIn: string;
    resolvedBy: string;
    rescueWithAi: string;
    contactWaUpsell: string;
    directWa: string;
    directWaComposeTitle: string;
    directWaSendAndResolve: string;
    directWaPlaceholder: string;
    officialRescueTitle: string;
    copyRescue: string;
    copiedRescue: string;
    markAsResolved: string;
    filterAll: string;
    filterPending: string;
    filterResolved: string;
    searchPlaceholder: string;
    noMatches: string;
  };
  qr: {
    activeBadge: string;
    title: string;
    subtitlePrefix: string;
    downloadPng: string;
    testQr: string;
    branchSelectorLabel: string;
    formatTabMobile: string;
    formatTabPrint: string;
    downloadMobilePng: string;
    downloadPrintPng: string;
    copyLink: string;
    copiedLink: string;
    guideTitle: string;
    guideSubtitle: string;
    guidePoint1Title: string;
    guidePoint1Desc: string;
    guidePoint2Title: string;
    guidePoint2Desc: string;
    guidePoint3Title: string;
    guidePoint3Desc: string;
    statusTitle: string;
    statusActive: string;
    tableTentTitle: string;
    tableTentSubtitle: string;
    downloadTableTentBtn: string;
    downloadOnlyQrBtn: string;
    tableTentStyleDark: string;
    tableTentStylePrint: string;
    tableTentQuestion: string;
    tableTentScanPrompt: string;
    tableTentTakesSeconds: string;
    tableTentCreatedBy: string;
  };
  reactivate: {
    badge: string;
    planTag: string;
    title: string;
    subtitle: string;
    shieldRate: string;
    shieldSafety: string;
    shieldZeroComplaints: string;
    step1Title: string;
    step1Name: string;
    step1Desc: string;
    step2Title: string;
    step2Name: string;
    step2Desc: string;
    step3Title: string;
    step3Name: string;
    step3Desc: string;
    step4Title: string;
    step4Name: string;
    step4Desc: string;
    hookTitle: string;
    highConversion: string;
    hookLabel: string;
    hookPlaceholder: string;
    hookTip: string;
    targetBranch: string;
    previewTitle: string;
    previewBubbleGreeting: string;
    previewBubbleThanks: string;
    previewBubblePrompt: string;
    previewBubbleReward: string;
    loadTitle: string;
    loadEasy: string;
    clientNameLabel: string;
    clientNamePlaceholder: string;
    clientPhoneLabel: string;
    clientPhonePlaceholder: string;
    addClientBtn: string;
    orBatch: string;
    openExcelBtn: string;
    closeExcelBtn: string;
    pasteLabel: string;
    pastePlaceholder: string;
    autoDetectTip: string;
    processImportBtn: string;
    totalContacts: string;
    sentInvitations: string;
    pendingInvitations: string;
    progress: string;
    filterAll: string;
    filterPending: string;
    filterInvited: string;
    demosBtn: string;
    demosTooltip: string;
    searchPlaceholder: string;
    emptySearch: string;
    colCustomer: string;
    colWhatsapp: string;
    colSource: string;
    colStatus: string;
    colLauncher: string;
    sourceDefault: string;
    statusInvited: string;
    statusReady: string;
    statusPending: string;
    btnResend: string;
    btnSendWa: string;
    btnLaunchTitle: string;
    btnDeleteTitle: string;
    quickIncentivesLabel: string;
    addIncentiveBtn: string;
    maxIncentivesReached: string;
    manualHookLabel: string;
    copyCampaignLink: string;
    copiedCampaignLink: string;
    branchSelectorTitle: string;
    strategyModeImmediate: string;
    strategyModeGiveaway: string;
    strategyModeNone: string;
    giveawayHookLabel: string;
    giveawayHookPlaceholder: string;
    giveawayWinnersLabel: string;
    noPrizeNoticeTitle: string;
    noPrizeNoticeDesc: string;
    campaignGoalLabel: string;
    goalReviewsTitle: string;
    goalReviewsDesc: string;
    goalTrafficTitle: string;
    goalTrafficDesc: string;
    trafficHookLabel: string;
    trafficHookPlaceholder: string;
    trafficHookTip: string;
    weeklyRaffleTitle: string;
    weeklyRaffleBadge: string;
    btnPickReactivationWinner: string;
    filterInactive: string;
    filterVip: string;
    filterRecent: string;
    daysAgo: string;
    visitsBadge: string;
    reactivationModalTitle: string;
    reactivationModalSubtitle: string;
  };
  giveaways: {
    lockedBadge: string;
    lockedTitle: string;
    lockedDesc: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    viewPlansBtn: string;
    badge: string;
    eliteTag: string;
    proTag: string;
    title: string;
    subtitle: string;
    monthlyParticipants: string;
    habeasDataActive: string;
    cardTitle: string;
    cardSubtitle: string;
    activeStatus: string;
    pausedStatus: string;
    managerNoticeTitle: string;
    managerNoticeDesc: string;
    scopeLabel: string;
    scopeGlobalBadge: string;
    scopeBranchBadge: string;
    btnAllBranches: string;
    btnPerBranch: string;
    branchSelectLabel: string;
    campaignTitleLabel: string;
    campaignTitlePlaceholder: string;
    prizeLabel: string;
    prizePlaceholder: string;
    prizeTip: string;
    winnersCountLabel: string;
    winnersCountTip: string;
    drawDateLabel: string;
    endOfMonthBtn: string;
    endOfMonthTooltip: string;
    drawDateBadge: string;
    drawDateTip: string;
    termsLabel: string;
    termsPlaceholder: string;
    btnSaving: string;
    btnSaved: string;
    btnSaveBranch: string;
    btnSaveGlobal: string;
    simulatorTitle: string;
    activePalette: string;
    simPaused: string;
    simRatingPrompt: string;
    simOfficialSite: string;
    statParticipants: string;
    statAverage: string;
    statDrawDate: string;
    statEndMonth: string;
    statStatus: string;
    statWinnerReady: string;
    statInProgress: string;
    raffleTitle: string;
    raffleDesc: string;
    btnSpinning: string;
    btnSelectWinner: string;
    btnSelectWinnerElite: string;
    btnSelectWinnersPlural: string;
    btnSelectWinnersPluralElite: string;
    tableTitle: string;
    allBranchesOption: string;
    searchPlaceholder: string;
    emptySearch: string;
    colCustomer: string;
    colWhatsapp: string;
    colBranch: string;
    colRating: string;
    colDate: string;
    colStatus: string;
    winnerBadge: string;
    participatingBadge: string;
  };
  ai: {
    title: string;
    subtitle: string;
    unlockPro: string;
    respondingTo: string;
    clear: string;
    noReviewSelected: string;
    goToRadar: string;
    generating: string;
    selectToneTitle: string;
    copyResponse: string;
    copied: string;
    pasteToGoogle: string;
    editCustomize: string;
    doneEditing: string;
    badgeAiCenter: string;
    titleAiCenter: string;
    subtitleAiCenter: string;
    queueGoogle: string;
    queueComplaints: string;
    queueComplaintsEliteOnly: string;
    allCaughtUpTitle: string;
    allCaughtUpDesc: string;
    generatingRescue: string;
    sendWaAndResolve: string;
    unlockedProBadge: string;
    unlockedEliteBadge: string;
    selectPrompt: string;
    rescueStrategyTitle: string;
    privateComplaintBadge: string;
    googleReviewBadge: string;
    attendedByPrefix: string;
    complaintReasonPrefix: string;
    markAnsweredNotice: string;
  };
  reports: {
    title: string;
    badge: string;
    subtitle: string;
    periodLabel: string;
    exportCsv: string;
    exportPdf: string;
    managerBadge: string;
    managerTitlePrefix: string;
    managerSubtitle: string;
    dailyBtn: string;
    weeklyBtn: string;
    monthlyBtn: string;
    annualBtn: string;
    shiftUpToDate: string;
    shiftNeedsAttention: string;
    shiftUpToDateDesc: string;
    shiftNeedsAttentionDesc: string;
    shiftSendOwnerElite: string;
    shiftSendOwnerLocked: string;
    btnReplyGoogle: string;
    btnRescueWa: string;
    kpiReceivedToday: string;
    kpiReceivedTodayDesc: string;
    kpiAnsweredToday: string;
    kpiAnsweredTodayRate: string;
    kpiPendingToday: string;
    kpiPendingTodayDescAlert: string;
    kpiPendingTodayDescOk: string;
    channelPublicTitle: string;
    channelPrivateTitle: string;
    channelPublicToday: string;
    channelPrivateToday: string;
    answeredWithAi: string;
    unanswered: string;
    rescuedClients: string;
    pendingToContact: string;
    openGoogleRadar: string;
    openRescueWa: string;
    logbookTitle: string;
    noReviewsToday: string;
    logGoogleTag: string;
    logStatusAnswered: string;
    logReplyWithAi: string;
    logStatusResolved: string;
    logContactWa: string;
    incidentsTitle: string;
    incidentsBadge: string;
    incidentsSubtitle: string;
    incidentsCountSuffix: string;
    incidentInputPlaceholder: string;
    incidentSaving: string;
    incidentRegisterBtn: string;
    noIncidents: string;
    incidentBy: string;
    incidentHandled: string;
    rankingTitle: string;
    rankingSubtitle: string;
    rankingTop1: string;
    rankingTop2: string;
    rankingTop3: string;
    rankingPositiveMentions: string;
    rankingComplaintsNeutralized: string;
    rankingSpeed: string;
    weeklyReceived: string;
    weeklyReceivedDiff: string;
    weeklyFiveStars: string;
    weeklyFiveStarsDesc: string;
    weeklyBlocked: string;
    weeklyBlockedDesc: string;
    weeklyResponseRate: string;
    weeklyAvgTime: string;
    weeklyStaffTitle: string;
    weeklyStaffSubtitle: string;
    weeklyTipTitle: string;
    weeklyTipDesc: string;
    confidentialNotice: string;
    ownerBadge: string;
    ownerAllBranches: string;
    ownerFilteredPrefix: string;
    ownerTitle: string;
    ownerSubtitle: string;
    periodToday: string;
    periodYesterday: string;
    periodThisWeek: string;
    periodThisMonth: string;
    periodAnnual: string;
    periodCustom: string;
    periodHoursTitle: string;
    periodAllHours: string;
    periodMorningShift: string;
    periodAfternoonShift: string;
    periodEveningShift: string;
    periodSpecificHour: string;
    dateRangeFrom: string;
    dateRangeTo: string;
    customerBehaviorTitle: string;
    customerBehaviorSubtitle: string;
    hourlyTrafficTitle: string;
    hourlyTrafficSubtitle: string;
    peakHoursBadge: string;
    riskHoursBadge: string;
    goldenHoursBadge: string;
    customerFunnelTitle: string;
    customerFunnelSubtitle: string;
    exitChannelsTitle: string;
    exitChannelsSubtitle: string;
    activeTag: string;
    sec1Title: string;
    sec1PeriodPrefix: string;
    statFiveStarsGoogle: string;
    statFiveStarsGoogleDesc: string;
    statViewsGoogle: string;
    statViewsGoogleGrowth: string;
    statPositionGoogle: string;
    statPositionGoogleDesc: string;
    statVipDatabase: string;
    statVipDatabaseLocked: string;
    statVipDatabaseLockedDesc: string;
    statVipDatabaseUnlockBtn: string;
    statVipDatabaseViewBtn: string;
    sec2Title: string;
    sec2ActiveBadge: string;
    statBlockedComplaints: string;
    statBlockedComplaintsDesc: string;
    statProtectedMoney: string;
    statProtectedMoneyDesc: string;
    statRatingEvolution: string;
    statRatingEvolutionDesc: string;
    statAntiSpamCompliance: string;
    statAntiSpamComplianceDesc: string;
    roiMethodologyTitle: string;
    roiMethodologyP1: string;
    roiMethodologyP2: string;
    sec3Title: string;
    colLocation: string;
    colManager: string;
    colRating: string;
    colReviewsPeriod: string;
    colAnswered: string;
    colPending: string;
    colBlocked: string;
    colEffectiveness: string;
    colStatus: string;
    statusAllClear: string;
    statusPendingSuffix: string;
    sec4Title: string;
    sec4Subtitle: string;
    sec4PrintPdf: string;
    sec4CopySummary: string;
    sec4CopiedAlert: string;
    chartsSectionTitle: string;
    ratingsBreakdownTitle: string;
    ratingsBreakdownSubtitle: string;
    ratingsAverageBadge: string;
    volumeFlowTitle: string;
    volumeFlowSubtitle: string;
    legendPublicReviews: string;
    legendPrivateComplaints: string;
    effectivenessGaugeTitle: string;
    effectivenessGaugeSubtitle: string;
    effectivenessGaugeBadge: string;
    exportCsvBtn: string;
    dispatchPendingBtn: string;
    printDossierTitle: string;
    printDossierSubtitle: string;
    printAuditedBy: string;
    printOfficialCertificate: string;
  };
  profile: {
    headerBadge: string;
    headerTitle: string;
    headerSubtitle: string;
    saving: string;
    savedSuccess: string;
    saveChanges: string;
    syncRealtime: string;
    sec1Title: string;
    commercialBadge: string;
    clientIdLabel: string;
    taxIdLabel: string;
    taxIdPlaceholder: string;
    brandNameLabel: string;
    brandNamePlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    ownerNameLabel: string;
    ownerNamePlaceholder: string;
    ownerPhoneLabel: string;
    ownerPhonePlaceholder: string;
    subTitle: string;
    licenseValidityLabel: string;
    licenseValidityVal: string;
    planElite: string;
    planPro: string;
    planBasic: string;
    supportAllowanceLabel: string;
    supportElite: string;
    supportPro: string;
    supportBasic: string;
    billingCycleLabel: string;
    billingCycleVal: string;
    accountStatusLabel: string;
    accountStatusVal: string;
    managePlanBtn: string;
    legalContractBtn: string;
    sec2Title: string;
    designBadge: string;
    logoUrlLabel: string;
    noLogo: string;
    logoPlaceholder: string;
    logoNote: string;
    uploadLogoBtn: string;
    removeLogoBtn: string;
    logoSizeNote: string;
    requestCompanyUpdateBtn: string;
    requestBranchUpdateBtn: string;
    primaryColorLabel: string;
    customColorLabel: string;
    qrThemeLabel: string;
    qrThemeDark: string;
    qrThemeLight: string;
    sec3Title: string;
    presenceBadge: string;
    websiteLabel: string;
    managedByPrestigia: string;
    websiteNote: string;
    socialLabel: string;
    testSocialBtn: string;
    testSocialTooltip: string;
    socialNormalizedHint: string;
    vipGroupLabel: string;
    vipGroupPlaceholder: string;
    vipGroupNote: string;
    staffMaxLimitAlert: string;
    branchSecTitle: string;
    branchQuotaLabel: string;
    requestExtraBranchBtn: string;
    activateMultiBranchBtn: string;
    editingPrefix: string;
    branchNameLabel: string;
    branchAddressLabel: string;
    branchAddressPlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    localityLabel: string;
    localityPlaceholder: string;
    googleReviewLabel: string;
    testLink: string;
    googleReviewNote: string;
    managerPhoneLabel: string;
    managerPhonePlaceholder: string;
    managerPinLabel: string;
    managerPinPlaceholder: string;
    staffSectionLabel: string;
    removeStaffTooltip: string;
    staffInputPlaceholder: string;
    addStaffBtn: string;
    saveAllBtn: string;
    savingAll: string;
    savedAllSuccess: string;
  };
  modals: {
    billing: {
      tag: string;
      title: string;
      desc: string;
      basicName: string;
      basicPrice: string;
      basicDesc: string;
      basicF1: string;
      basicF2: string;
      basicF3: string;
      basicBtn: string;
      proName: string;
      proPrice: string;
      proDesc: string;
      proF1: string;
      proF2: string;
      proF3: string;
      proBtn: string;
      eliteName: string;
      eliteBadge: string;
      elitePrice: string;
      eliteDesc: string;
      eliteF1: string;
      eliteF2: string;
      eliteF3: string;
      eliteF4: string;
      eliteActive: string;
      gatewayTitle: string;
      gatewayDesc: string;
      contactBtn: string;
    };
    extraBranch: {
      title: string;
      desc: string;
      rateLabel: string;
      rateValue: string;
      details: string;
      backBtn: string;
      requestWaBtn: string;
    };
    newBranch: {
      title: string;
      desc: string;
      nameLabel: string;
      cityLabel: string;
      localityLabel: string;
      addressLabel: string;
      phoneLabel: string;
      pinLabel: string;
      cancelBtn: string;
      createBtn: string;
    };
    aiRescue: {
      badge: string;
      title: string;
      desc: string;
      clientInfo: string;
      complaintLabel: string;
      draftLabel: string;
      generating: string;
      regenerate: string;
      sendWa: string;
      copy: string;
      copied: string;
      close: string;
      staffAttended: string;
      loading: string;
      sendWaAndResolve: string;
    };
    customerDatabase: {
      badge: string;
      planElite: string;
      planPro: string;
      title: string;
      desc: string;
      exportBtn: string;
      habeasDataNotice: string;
      totalRegistered: string;
      contactsCount: string;
      downloadCsv: string;
      emptyList: string;
      habeasDataAccepted: string;
      writeWaTitle: string;
      close: string;
    };
    upsell: {
      badge: string;
      title: string;
      desc: string;
      basicName: string;
      basicLocation: string;
      basicPrice: string;
      basicPriceUsd: string;
      basicCurrentPlan: string;
      basicSelectBtn: string;
      basicF1: string;
      basicF2: string;
      basicF3: string;
      basicF4: string;
      basicF5: string;
      basicF6: string;
      basicF7: string;
      basicF8: string;
      proName: string;
      proLocation: string;
      proPrice: string;
      proPriceUsd: string;
      proCurrentPlan: string;
      proActivateBtn: string;
      proF1: string;
      proF2: string;
      proF3: string;
      proF4: string;
      proF5: string;
      proF6: string;
      proF7: string;
      proF8: string;
      eliteName: string;
      eliteBadge: string;
      eliteLocation: string;
      elitePrice: string;
      elitePriceUsd: string;
      eliteCurrentPlan: string;
      eliteUnlockBtn: string;
      eliteF1: string;
      eliteF2: string;
      eliteF3: string;
      eliteF4: string;
      eliteF5: string;
      eliteF6: string;
      eliteF7: string;
      eliteF8: string;
      supportFooterNote: string;
    };
    giveawayWinner: {
      badge: string;
      badgePlural: string;
      title: string;
      titlePlural: string;
      subtitle: string;
      subtitlePlural: string;
      registeredBranch: string;
      prizeAssigned: string;
      winnerTab: string;
      winnerCardTitle: string;
      waLabel: string;
      waEditableBadge: string;
      copied: string;
      copyBtn: string;
      closeBtn: string;
      sendWaBtn: string;
      sentBadge: string;
    };
  };
  systemModal: {
    title: string;
    ltsBadge: string;
    subtitle: string;
    globalStatus: string;
    operational: string;
    uptime: string;
    latency: string;
    encryption: string;
    bankingGrade: string;
    license: string;
    plan: string;
    authorizedBranches: string;
    vipSupport: string;
    activeModules: string;
    filterGoogle: string;
    habeasData: string;
    rescueAi: string;
    smartQrRouter: string;
    build: string;
    viewLegal: string;
    close: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    saved: string;
    confirm: string;
    back: string;
    print: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  es: {
    navbar: {
      portalB2b: 'Portal B2B',
      live: 'LIVE',
      systemInfoTooltip: 'Clic para ver Estado de la Plataforma, Seguridad y Licencia del Sistema',
      ownerView: '👑 Vista de Dueño General',
      managerView: '🏢 Encargado:',
      supportTicket: 'Soporte:',
      supportTooltip: 'Clic para solicitar asistencia técnica prioritaria vía WhatsApp VIP',
      allBranches: '👑 Todas las Sedes (Consolidado Élite)',
      singleBranch: 'Sede Única',
      multiBranchUpsell: 'Multi-Sede (Élite)',
      brandProfile: 'Perfil Marca',
      soundOn: 'Sonido ON',
      soundOff: 'Sonido OFF',
      testAlert: 'Probar Alerta',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      logout: 'Cerrar sesión',
      languageSelector: 'Idioma',
    },
    tabs: {
      radar: 'Radar Google',
      complaints: 'Contención Privada',
      qr: 'Smart QR',
      reactivate: 'Reactivar 5★',
      giveaways: 'Sorteos VIP',
      ai: 'Asistente IA',
      reports: 'Reportes',
      profile: 'Marca & Equipo',
      branchesBadge: 'Sedes',
    },
    radar: {
      title: 'Monitoreo de Reseñas en Google Maps',
      badge: 'Ficha Oficial',
      subtitle: 'Responde a tiempo para posicionar tu establecimiento en los primeros lugares de Google Maps.',
      statTotal: 'Total Reseñas',
      statRating: 'Calificación Promedio',
      statPending: 'Sin Responder',
      statResponseRate: 'Tasa de Respuesta',
      filterAll: 'Todas',
      filterUnanswered: '🚨 Sin responder',
      filterAnswered: '✅ Respondidas',
      filterFiveStars: '⭐ 5 Estrellas',
      filterCritical: '⚠️ Críticas (1-3★)',
      searchPlaceholder: 'Buscar por cliente o contenido...',
      noReviews: 'No hay reseñas registradas para esta selección.',
      noMatches: 'No se encontraron reseñas con los filtros aplicados.',
      loading: 'Cargando reseñas...',
      arrival: 'Llegada:',
      unansweredPriority: 'Sin responder (Prioridad)',
      answered: 'Respondida',
      officialReplyTitle: 'Tu Respuesta Oficial en Google Maps:',
      attendedIn: '⚡ Atendida en:',
      repliedOn: 'Respondida el:',
      attendedBy: 'Atendido por:',
      teamPrestigia: 'Equipo Prestigia',
      generateAiReply: 'Generar Respuesta con IA',
      regenerateAiReply: 'Regenerar otra con IA',
      manualReply: 'Responder Manual',
      editManualReply: 'Editar Respuesta',
      cancelManualReply: 'Cancelar',
      saveManualReply: 'Guardar y Publicar',
      manualReplyPlaceholder: 'Escribe aquí tu respuesta oficial para esta reseña...',
      openInMaps: 'Abrir en Google Maps',
      copyReview: 'Copiar reseña',
      copiedReview: '¡Copiada!',
      copyReply: 'Copiar respuesta',
      copiedReply: '¡Copiada!',
    },
    dashboard: {
      priorityAlertTitle: 'Atención Prioritaria:',
      unansweredGoogleReviewsSingular: 'reseña de Google sin responder',
      unansweredGoogleReviewsPlural: 'reseñas de Google sin responder',
      andConjunction: 'y',
      unrescuedPrivateComplaintsSingular: 'queja privada sin rescatar',
      unrescuedPrivateComplaintsPlural: 'quejas privadas sin rescatar',
      viewGoogleReviews: 'Ver Reseñas Google',
      viewWhatsappComplaints: 'Ver Quejas Privadas',
      metricTodayTitle: 'Opiniones Hoy (En Vivo)',
      metricTodayBadge: 'Hoy',
      onGoogleMaps: 'en Google Maps',
      privateQr: 'privadas QR',
      metricAnsweredTitle: 'Respondidas Hoy',
      metricEffectiveness: 'Efectividad',
      shiftFullAttention: '¡Turno al 100% de atención!',
      ofAttendedToday: 'atendidas hoy',
      metricPendingTitle: 'Faltan por Responder',
      metricRequiresAction: 'Requiere Acción',
      metricUpToDate: 'Al Día',
      onGoogle: 'en Google',
      privateComplaints: 'quejas privadas',
      metricRatingTitle: 'Calificación & Blindaje',
      complaintsNeutralized: 'quejas neutralizadas sin ir a Google',
      pushBannerTitle: 'Avisos Emergentes en Teléfono & PC:',
      pushBannerText: 'Activa las notificaciones del navegador para recibir avisos instantáneos cuando un cliente califique o envíe una queja.',
      pushBannerButton: 'Activar Avisos Emergentes',
      alertRescueAi: 'Rescatar con IA',
      alertViewComplaint: 'Ver Queja',
      alertReplyAi: 'Responder con IA',
      alertViewRadar: 'Ver Radar',
      alertDismiss: 'Cerrar Aviso',
      priorityBadge: 'Prioridad',
    },
    complaints: {
      title: 'Bandeja de Quejas Privadas (1 a 3 Estrellas)',
      blockedBadge: 'Bloqueadas de Google',
      subtitle: 'Ninguno de estos reclamos llegó a internet. Rescata al cliente abriendo WhatsApp antes de que se enfríe.',
      loading: 'Cargando quejas...',
      empty: '🎉 No hay quejas privadas pendientes. Todo el servicio está en orden.',
      hiddenInBasic: '🔒 No disponible',
      arrival: 'Llegada:',
      pendingBadge: 'Pendiente de rescate (Prioridad)',
      resolvedBadge: 'Resuelto',
      complaintReasonLabel: 'Motivo del disgusto:',
      attendedByLabel: 'Atendido por:',
      resolvedOn: 'Resuelto el:',
      rescuedIn: '⚡ Rescatado en:',
      resolvedBy: 'Resuelto por:',
      rescueWithAi: 'Rescatar con IA',
      contactWaUpsell: 'Contactar WhatsApp (Pro/Élite)',
      directWa: 'WhatsApp Directo',
      directWaComposeTitle: 'Mensaje de Rescate por WhatsApp',
      directWaSendAndResolve: 'Enviar por WhatsApp & Marcar Resuelto',
      directWaPlaceholder: 'Escribe el mensaje de rescate para el cliente...',
      officialRescueTitle: '⚡ MENSAJE DE RESCATE ENVIADO POR WHATSAPP:',
      copyRescue: 'Copiar mensaje',
      copiedRescue: '¡Copiado!',
      markAsResolved: 'Marcar como resuelto',
      filterAll: 'Todas',
      filterPending: '🚨 Pendientes',
      filterResolved: '✅ Resueltas',
      searchPlaceholder: 'Buscar por cliente, teléfono o motivo...',
      noMatches: 'No se encontraron quejas con los filtros aplicados.',
    },
    qr: {
      activeBadge: 'SMART QR ACTIVO • SEDE',
      title: 'Código QR Dinámico con Filtro de Reputación',
      subtitlePrefix: 'Apunta a tu enrutador seguro en',
      downloadPng: 'Descargar PNG para Celular',
      testQr: 'Probar QR',
      branchSelectorLabel: 'Seleccionar Sede:',
      formatTabMobile: '📱 Móvil / Pantalla',
      formatTabPrint: '🖨️ Imprenta / Mesa',
      downloadMobilePng: 'Descargar PNG Celular',
      downloadPrintPng: 'Descargar PNG Imprenta (Alta Res)',
      copyLink: 'Copiar Enlace',
      copiedLink: '¡Enlace Copiado!',
      guideTitle: 'Guía de Uso: 100% Digital o Imprenta Local',
      guideSubtitle: 'Tienes total libertad para operar sin esperar envíos físicos:',
      guidePoint1Title: 'En Celular:',
      guidePoint1Desc: 'Guarda el PNG en la galería de fotos del personal o técnico para mostrarlo al momento de cobrar.',
      guidePoint2Title: 'En Mesa o Mostrador:',
      guidePoint2Desc: 'Imprime stickers o acrílicos en cualquier imprenta local con este código en alta definición.',
      guidePoint3Title: 'Seguridad Total:',
      guidePoint3Desc: 'Si alguna vez cambias de local o de cuenta de Google, nosotros actualizamos el destino en la nube sin que tengas que volver a imprimir.',
      statusTitle: 'Estado del Enrutador QR',
      statusActive: 'Activo y Protegido (Kill Switch Operativo)',
      tableTentTitle: 'Hablador de Mesa Oficial • Listo para Imprimir',
      tableTentSubtitle: 'Diseño profesional con branding y llamado a la acción para imprimir en acrílico, sticker o cartel de mesa.',
      downloadTableTentBtn: '🖨️ Descargar Hablador de Mesa (Alta Res)',
      downloadOnlyQrBtn: '🔳 Descargar Solo QR',
      tableTentStyleDark: '🌙 Elegante / Nocturno',
      tableTentStylePrint: '☀️ Imprenta / Blanco Puro',
      tableTentQuestion: '¿Cómo estuvo tu experiencia hoy?',
      tableTentScanPrompt: '📷 Escanea con la cámara de tu celular',
      tableTentTakesSeconds: 'Solo toma 10 segundos • Sin descargar apps',
      tableTentCreatedBy: '⚡ Creado por Prestigia • Blindaje y Reputación VIP',
    },
    reactivate: {
      badge: 'Lanzador de Reseñas 5★ • Clientes Antiguos',
      planTag: 'Universal (Básico, Pro y Empresarial)',
      title: 'Reactivación Masiva de Clientes con Blindaje 2-Vías',
      subtitle: 'Importa tu base de clientes existente (Excel, WhatsApp, POS o libreta) para invitarles a calificar tu negocio con un gancho irresistible. Dispara entre 20 y 50 reseñas de 5 estrellas en las primeras 48 horas con seguridad absoluta.',
      shieldRate: 'Tasa de Blindaje',
      shieldSafety: '100% Seguro',
      shieldZeroComplaints: 'Cero quejas públicas en Google',
      step1Title: '1. Envías por WhatsApp',
      step1Name: 'Mensaje Personalizado',
      step1Desc: 'Invitación cálida prometiendo un incentivo (ej. postre o café gratis).',
      step2Title: '2. Enrutador 2-Vías',
      step2Name: 'Filtro Prestigia Activo',
      step2Desc: 'El cliente evalúa su experiencia en una escala simple de 1 a 5 estrellas.',
      step3Title: '3. Si Califica 4 ó 5★',
      step3Name: '¡Directo a Google Maps!',
      step3Desc: 'Se abre la ficha de Google para dejar su reseña 5★ y elevar tu ranking.',
      step4Title: '4. Si Califica 1 a 3★',
      step4Name: 'Rescate Privado en WhatsApp',
      step4Desc: 'Google Maps queda intacto; la inconformidad llega en privado a tu equipo.',
      hookTitle: '1. Configura el Gancho o Recompensa',
      highConversion: 'Alta Conversión',
      hookLabel: 'Incentivo ofrecido al cliente por calificar:',
      hookPlaceholder: 'Ej: un postre de cortesía, 10% de descuento, un café de la casa...',
      hookTip: '💡 Prometer un pequeño detalle multiplica la respuesta en más de un 60%.',
      targetBranch: 'Sede Destino:',
      previewTitle: 'Vista Previa del Mensaje en WhatsApp',
      previewBubbleGreeting: '¡Hola',
      previewBubbleThanks: 'queremos agradecerte por ser nuestro cliente.',
      previewBubblePrompt: 'Nos encantaría conocer tu opinión sincera en este enlace rápido de 30 segundos:',
      previewBubbleReward: '🎁 Como agradecimiento, al responder recibirás',
      loadTitle: '2. Cargar Clientes Antiguos',
      loadEasy: 'Fácil y Rápido',
      clientNameLabel: 'Nombre del Cliente:',
      clientNamePlaceholder: 'Ej: Daniel Gómez',
      clientPhoneLabel: 'WhatsApp / Celular:',
      clientPhonePlaceholder: 'Ej: 300 123 4567',
      addClientBtn: 'Agregar Cliente a la Lista',
      orBatch: 'o importa por lote',
      openExcelBtn: '📋 Pegar Lista Masiva desde Excel / WhatsApp',
      closeExcelBtn: 'Cerrar Importador de Excel',
      pasteLabel: 'Pega tus contactos aquí (uno por línea o Nombre, Teléfono):',
      pastePlaceholder: 'Ejemplo:\nSantiago Gómez, 3114567890\nMariana Pérez, 3009876543\n3158765432',
      autoDetectTip: 'Detecta automáticamente números y nombres.',
      processImportBtn: 'Procesar e Importar',
      totalContacts: 'Total Contactos',
      sentInvitations: 'Invitados Enviados',
      pendingInvitations: 'Pendientes',
      progress: 'Avance',
      filterAll: 'Todos',
      filterPending: 'Pendientes',
      filterInvited: 'Invitados',
      demosBtn: 'Demos',
      demosTooltip: 'Restaurar contactos demo de prueba',
      searchPlaceholder: 'Buscar cliente o tel...',
      emptySearch: 'No se encontraron contactos en este filtro. Agrega un cliente o importa desde Excel.',
      colCustomer: 'Cliente',
      colWhatsapp: 'WhatsApp',
      colSource: 'Origen',
      colStatus: 'Estado',
      colLauncher: 'Lanzador 1-Clic',
      sourceDefault: 'Base Clientes',
      statusInvited: 'Invitado',
      statusReady: 'Listo',
      statusPending: 'Pendiente de Envío',
      btnResend: 'Reenviar',
      btnSendWa: 'Enviar WhatsApp',
      btnLaunchTitle: 'Abre WhatsApp con el mensaje personalizado y enlace Smart QR',
      btnDeleteTitle: 'Eliminar de la lista',
      quickIncentivesLabel: 'Incentivos rápidos (1-toque, máx. 5):',
      addIncentiveBtn: '+ Agregar incentivo',
      maxIncentivesReached: 'Máximo 5 incentivos alcanzado',
      manualHookLabel: 'O personaliza el gancho manualmente para este cliente:',
      copyCampaignLink: 'Copiar Enlace',
      copiedCampaignLink: '¡Copiado!',
      branchSelectorTitle: 'Sede Destino de la Campaña:',
      strategyModeImmediate: '🎁 Incentivo Inmediato',
      strategyModeGiveaway: '🎟️ Sorteo del Mes',
      strategyModeNone: '💬 Solo Calificación (Sin Premio)',
      giveawayHookLabel: 'Premio o Sorteo al que entrará a participar:',
      giveawayHookPlaceholder: 'Ej: el sorteo mensual de una cena especial para 2 personas',
      giveawayWinnersLabel: 'Cantidad de ganadores a sortear:',
      noPrizeNoticeTitle: 'Modo 100% Orgánico Activo',
      noPrizeNoticeDesc: 'El mensaje invitará al cliente con un tono cálido y sincero a calificar su experiencia, sin prometer incentivos ni requerir presupuesto de premios.',
      campaignGoalLabel: 'Objetivo Principal de la Campaña:',
      goalReviewsTitle: '⭐ Reseñas Google 5★ (Clientes Recientes)',
      goalReviewsDesc: 'Convierte visitas recientes en estrellas públicas en Google Maps con incentivos o sorteo semanal.',
      goalTrafficTitle: '🚀 Despertar Clientes Inactivos (Llenar el Local)',
      goalTrafficDesc: 'Re-engancha tu base de datos (+30 días) para que vuelvan a consumir al local esta semana.',
      trafficHookLabel: 'Gancho Irresistible de Visita al Local:',
      trafficHookPlaceholder: 'Ej: 2x1 en cócteles este jueves y viernes / Cóctel de bienvenida de cortesía',
      trafficHookTip: 'Ofrece un beneficio exclusivo válido por tiempo limitado para provocar la visita física.',
      weeklyRaffleTitle: 'Sorteo Relámpago Semanal de Reactivación',
      weeklyRaffleBadge: '⚡ EXCLUSIVO BASE DE DATOS',
      btnPickReactivationWinner: '🎲 Sortear Ganadores de la Reactivación',
      filterInactive: '🕒 Inactivos (+30d)',
      filterVip: '👑 Clientes VIP (+3)',
      filterRecent: '🆕 Recientes (<7d)',
      daysAgo: 'hace {days} días',
      visitsBadge: '{count} visitas',
      reactivationModalTitle: '¡Ganadores del Sorteo Relámpago de Reactivación!',
      reactivationModalSubtitle: 'Clientes premiados por reactivarse con tu negocio esta semana.',
    },
    giveaways: {
      lockedBadge: '🔒 EXCLUSIVO PLAN PRO Y ÉLITE',
      lockedTitle: 'Campañas de Fidelización & Sorteos Mensuales',
      lockedDesc: 'Multiplica las calificaciones de tus clientes mostrando promociones directas en pantalla como "Califica tu experiencia y participa en el sorteo mensual". Los planes Pro y Élite incluyen el reporte de participantes y la tómbola aleatoria de ganadores con notificación a WhatsApp.',
      feature1Title: '+300% Calificaciones',
      feature1Desc: 'El incentivo visual motiva a los clientes a escanear el QR.',
      feature2Title: 'Captura de Celulares',
      feature2Desc: 'Base de datos de participantes con autorización legal Habeas Data.',
      feature3Title: 'Tómbola Empresarial',
      feature3Desc: 'Selección de ganador al azar y mensaje listo para enviar por WhatsApp.',
      viewPlansBtn: 'Ver Planes Pro y Empresarial para Activar Sorteos',
      badge: 'Módulo de Fidelización & Sorteos',
      eliteTag: '👑 Plan Empresarial (Tómbola Activa)',
      proTag: '⚡ Plan Pro (Reporte Activo)',
      title: 'Campaña de Satisfacción en el Enrutador Smart QR',
      subtitle: 'Configura la promoción que verán tus clientes al abrir el Smart QR en tu establecimiento. Cada calificación registra el número del cliente para la tómbola mensual.',
      monthlyParticipants: 'Participantes Mes',
      habeasDataActive: 'Habeas Data Activo',
      cardTitle: 'Configurar Campaña en Smart QR',
      cardSubtitle: 'Incentivo visible para motivar a los clientes a calificar',
      activeStatus: 'Campaña Activa',
      pausedStatus: 'Pausada',
      managerNoticeTitle: 'Modo Consulta (Encargado de Sede)',
      managerNoticeDesc: 'La campaña es gestionada por la Gerencia General de la marca. A la derecha puedes consultar los participantes registrados en tu local.',
      scopeLabel: 'Alcance de la Campaña:',
      scopeGlobalBadge: '1 Campaña Global',
      scopeBranchBadge: '1 Campaña por Sede',
      btnAllBranches: '🌐 Todas las Sedes',
      btnPerBranch: '📍 Por Sede Individual',
      branchSelectLabel: 'Sede a configurar:',
      campaignTitleLabel: 'Título de la Campaña:',
      campaignTitlePlaceholder: 'Ej: Gran Sorteo de Satisfacción',
      prizeLabel: 'Premio o Recompensa Ofrecida:',
      prizePlaceholder: 'Ej: Bono de compra, cortesía o producto estrella',
      prizeTip: '💡 Este texto se muestra destacado en el celular del cliente al escanear el Smart QR.',
      winnersCountLabel: 'Número de Ganadores a Sortear:',
      winnersCountTip: '¿Cuántos clientes ganarán el premio? (Ej: 1 premio principal, 3 bonos, 5 cortesías).',
      drawDateLabel: 'Fecha del Sorteo Oficial:',
      endOfMonthBtn: '⚡ Fin de este mes',
      endOfMonthTooltip: 'Fijar automáticamente el último día de este mes',
      drawDateBadge: 'Fecha del Sorteo:',
      drawDateTip: 'Selecciona la fecha exacta en el calendario para evitar errores de digitación.',
      termsLabel: 'Términos / Condiciones Rápidas:',
      termsPlaceholder: 'Ej: Válido para clientes registrados en la sede durante el mes en curso...',
      btnSaving: 'Guardando...',
      btnSaved: '¡Campaña Guardada!',
      btnSaveBranch: 'Guardar Campaña para esta Sede',
      btnSaveGlobal: 'Guardar Campaña Global',
      simulatorTitle: 'Simulador Enrutador Smart QR',
      activePalette: 'Paleta Activa',
      simPaused: 'Campaña pausada actualmente.',
      simRatingPrompt: 'Toca las estrellas para calificar tu visita',
      simOfficialSite: '🌐 Visitar Sitio Web Oficial',
      statParticipants: 'Participantes',
      statAverage: 'Promedio Votos',
      statDrawDate: 'Fecha Sorteo',
      statEndMonth: 'Fin Mes',
      statStatus: 'Estado',
      statWinnerReady: '🏆 Ganador Listo',
      statInProgress: '⏳ En Curso',
      raffleTitle: 'Tómbola Oficial de Sorteo',
      raffleDesc: 'El sistema elige al azar a un cliente verificado y redacta el mensaje de WhatsApp para que lo revises y le avises de inmediato.',
      btnSpinning: 'Girando la Tómbola...',
      btnSelectWinner: '🎲 Seleccionar 1 Ganador al Azar',
      btnSelectWinnerElite: 'Seleccionar Ganador (Élite)',
      btnSelectWinnersPlural: '🎲 Seleccionar {count} Ganadores al Azar',
      btnSelectWinnersPluralElite: 'Elegir {count} Ganadores (Élite)',
      tableTitle: 'Reporte de Clientes Registrados',
      allBranchesOption: 'Todas las Sedes',
      searchPlaceholder: 'Buscar participante...',
      emptySearch: 'No hay participantes registrados con este filtro.',
      colCustomer: 'Cliente',
      colWhatsapp: 'WhatsApp',
      colBranch: 'Sede',
      colRating: 'Voto',
      colDate: 'Fecha',
      colStatus: 'Estado',
      winnerBadge: '🏆 GANADOR DEL MES',
      participatingBadge: 'Participando',
    },
    ai: {
      title: 'Asistente IA de Respuestas Anti-Spam (Google Compliant)',
      subtitle: 'Cumple con las políticas de Google: 0 respuestas repetidas, sin números de contacto prohibidos y con supervisión humana.',
      unlockPro: 'Desbloquear con Plan Pro',
      respondingTo: 'Respondiendo a:',
      clear: 'Limpiar',
      noReviewSelected: 'Selecciona una reseña del Radar de Google para redactar una respuesta personalizada al instante.',
      goToRadar: 'Ir al Radar',
      generating: 'Generando 3 variantes únicas de respuesta con Inteligencia Artificial...',
      selectToneTitle: 'Selecciona la mejor respuesta para tu cliente:',
      copyResponse: 'Solo Copiar',
      copied: '¡Copiado al Portapapeles!',
      pasteToGoogle: 'Copiar y Abrir en Google Maps',
      editCustomize: 'Personalizar',
      doneEditing: 'Listo',
      badgeAiCenter: 'CENTRO DE DESPACHO RÁPIDO CON IA',
      titleAiCenter: 'Centro de Despacho & Respuestas Inteligentes',
      subtitleAiCenter: 'Despacha en minutos todas las respuestas pendientes de Google Maps y mensajes de rescate de WhatsApp sin cambiar de pantalla.',
      queueGoogle: 'Reseñas Google Maps',
      queueComplaints: 'Quejas Privadas en Portal',
      queueComplaintsEliteOnly: 'Rescate WhatsApp (Exclusivo Empresarial)',
      allCaughtUpTitle: '🎉 ¡Todo al Día! Reputación al 100%',
      allCaughtUpDesc: 'No tienes elementos pendientes en esta cola. Todas las opiniones y reclamos han sido atendidos profesionalmente.',
      generatingRescue: 'Redactando 3 estrategias personalizadas de rescate...',
      sendWaAndResolve: 'Enviar WhatsApp & Marcar Resuelto',
      unlockedProBadge: '⚡ Plan Pro (Google Maps Activo)',
      unlockedEliteBadge: '👑 Plan Empresarial (Google Maps + WhatsApp Activos)',
      selectPrompt: 'Selecciona un caso de la lista para generar respuestas al instante',
      rescueStrategyTitle: 'Estrategias de Rescate por WhatsApp:',
      privateComplaintBadge: '🚨 Queja Privada',
      googleReviewBadge: '⭐ Reseña Google Maps',
      attendedByPrefix: 'Atendido por:',
      complaintReasonPrefix: 'Motivo:',
      markAnsweredNotice: 'Al abrir en Google Maps, la reseña quedará registrada como respondida.',
    },
    reports: {
      title: 'Reportes Ejecutivos & ROI Reputacional',
      badge: 'Auditoría Prestigia',
      subtitle: 'Métricas de impacto, blindaje reputacional y desempeño por sedes y equipo de trabajo.',
      periodLabel: 'Período:',
      exportCsv: 'Exportar Base de Datos (CSV)',
      exportPdf: 'Generar Informe Ejecutivo (PDF)',
      managerBadge: '🏢 Panel de Control Operativo de Sede',
      managerTitlePrefix: 'Reporte de Desempeño:',
      managerSubtitle: 'Supervisión en vivo de atención a clientes y balance semanal del turno.',
      dailyBtn: 'Reporte Diario (Hoy)',
      weeklyBtn: 'Reporte Semanal',
      monthlyBtn: 'Este Mes',
      annualBtn: 'Balance Anual',
      shiftUpToDate: '¡Turno al Día!',
      shiftNeedsAttention: '¡Atención Inmediata!',
      shiftUpToDateDesc: 'Todas las reseñas y quejas de hoy en esta sede han sido respondidas.',
      shiftNeedsAttentionDesc: 'cliente(s) esperando respuesta en el turno de hoy.',
      shiftSendOwnerElite: 'Enviar Cierre a Dueño por WhatsApp (Empresarial)',
      shiftSendOwnerLocked: 'Cierre de Turno WhatsApp (Exclusivo Empresarial)',
      btnReplyGoogle: 'Responder Google',
      btnRescueWa: 'Rescatar en WhatsApp',
      kpiReceivedToday: 'Reseñas Llegadas Hoy',
      kpiReceivedTodayDesc: 'en Google Maps • por Smart QR',
      kpiAnsweredToday: 'Reseñas Respondidas Hoy',
      kpiAnsweredTodayRate: 'Tasa de respuesta del turno:',
      kpiPendingToday: 'Faltan por Responder',
      kpiPendingTodayDescAlert: 'Requieren tu atención inmediata',
      kpiPendingTodayDescOk: '¡Sin pendientes!',
      channelPublicTitle: 'Canal Público: Google Maps',
      channelPrivateTitle: 'Canal Privado: Quejas Filtro QR',
      channelPublicToday: 'hoy',
      channelPrivateToday: 'hoy',
      answeredWithAi: 'Respondidas con IA:',
      unanswered: 'Sin responder:',
      rescuedClients: 'Clientes rescatados:',
      pendingToContact: 'Pendientes por contactar:',
      openGoogleRadar: 'Abrir Radar de Google Maps',
      openRescueWa: 'Abrir Bandeja de Rescate WhatsApp',
      logbookTitle: 'Bitácora en Vivo de Clientes de Hoy',
      noReviewsToday: 'Aún no se han registrado nuevas valoraciones hoy en esta sede.',
      logGoogleTag: '(Google Maps)',
      logStatusAnswered: 'Respondida',
      logReplyWithAi: 'Responder con IA',
      logStatusResolved: 'Resuelto',
      logContactWa: 'Contactar WhatsApp',
      incidentsTitle: 'Bitácora de Novedades e Incidencias del Turno',
      incidentsBadge: '👑 EMPRESARIAL',
      incidentsSubtitle: 'Registra novedades de sala, retrasos o cortesías para coordinar con la gerencia general.',
      incidentsCountSuffix: 'novedad(es) registrada(s)',
      incidentInputPlaceholder: 'Ej: Cliente reportó demora en atención; se ofreció solución inmediata y el cliente se marchó satisfecho...',
      incidentSaving: 'Guardando...',
      incidentRegisterBtn: 'Registrar Novedad',
      noIncidents: '✨ No hay incidentes pendientes en este turno. El servicio fluye con normalidad.',
      incidentBy: 'Por:',
      incidentHandled: 'Gestionado',
      rankingTitle: 'Ranking de Colaboradores & Personal del Turno',
      rankingSubtitle: 'Gamificación aplicable a asesores, recepcionistas, especialistas, técnicos o ejecutivos de atención.',
      rankingTop1: '🥇 Top 1',
      rankingTop2: '🥈 Top 2',
      rankingTop3: '🥉 Top 3',
      rankingPositiveMentions: 'valoraciones 5★',
      rankingComplaintsNeutralized: 'queja neutralizada amablemente',
      rankingSpeed: 'Excelente velocidad y atención',
      weeklyReceived: 'Reseñas Captadas (Semana)',
      weeklyReceivedDiff: '+28% vs semana pasada',
      weeklyFiveStars: 'Reseñas 5★ en Google',
      weeklyFiveStarsDesc: 'Canalizadas con éxito',
      weeklyBlocked: 'Quejas Blindadas (Privadas)',
      weeklyBlockedDesc: 'No llegaron a Google Maps',
      weeklyResponseRate: 'Tasa de Respuesta',
      weeklyAvgTime: 'Tiempo medio: 14 min',
      weeklyStaffTitle: 'Desempeño del Personal en Esta Sede (Semanal)',
      weeklyStaffSubtitle: 'Monitorea qué colaboradores reciben más elogios de los clientes para incentivar el servicio.',
      weeklyTipTitle: 'Tip Operativo de la Semana para',
      weeklyTipDesc: 'La exhibición del código Smart QR en el cobro aumentó un 28% la tasa de captación de reseñas. Continúa incentivando a los clientes satisfechos a escanearlo.',
      confidentialNotice: '🔒 Nota: Los balances mensuales, anuales consolidados y estimaciones financieras están reservados para el perfil de Gerencia General.',
      ownerBadge: '👑 Centro de Control Ejecutivo & ROI Prestigia',
      ownerAllBranches: 'Todas las Sedes (Consolidado)',
      ownerFilteredPrefix: 'Filtrado:',
      ownerTitle: 'Alcance, Beneficio y Retorno de Inversión',
      ownerSubtitle: 'Demostración cuantitativa del impacto económico y reputacional de tener Prestigia operando.',
      periodToday: 'Hoy (Diario)',
      periodYesterday: 'Ayer',
      periodThisWeek: 'Esta Semana (7 Días)',
      periodThisMonth: 'Este Mes (30 Días)',
      periodAnnual: 'Balance Anual',
      periodCustom: 'Personalizado 📅',
      periodHoursTitle: 'Filtro Horario / Turnos Operativos',
      periodAllHours: 'Todo el Horario (08:00 - 23:00)',
      periodMorningShift: 'Mañana (08:00 - 12:00)',
      periodAfternoonShift: 'Tarde (12:00 - 18:00)',
      periodEveningShift: 'Noche / Cierre (18:00 - 23:00)',
      periodSpecificHour: 'Hora Específica',
      dateRangeFrom: 'Desde:',
      dateRangeTo: 'Hasta:',
      customerBehaviorTitle: 'Radar de Comportamiento del Cliente 360° & Flujo Horario',
      customerBehaviorSubtitle: 'Inteligencia operativa en tiempo real sobre afluencia, conversión de escaneos, fricción contenida y canales de interacción.',
      hourlyTrafficTitle: 'Distribución y Afluencia por Horas (08:00 - 23:00)',
      hourlyTrafficSubtitle: 'Monitoreo interactivo hora a hora de escaneos QR, reseñas 5★ ganadas y quejas privadas neutralizadas. Haz clic en una hora para auditarla.',
      peakHoursBadge: 'Hora Pico de Afluencia',
      riskHoursBadge: 'Hora de Mayor Fricción Contenida',
      goldenHoursBadge: 'Franja de Oro (Máxima Conversión 5★)',
      customerFunnelTitle: 'Embudo de Comportamiento & Conversión del Cliente',
      customerFunnelSubtitle: 'De la interacción con el QR al posicionamiento en Google y fidelización en base de datos.',
      exitChannelsTitle: 'Distribución de Canales de Interacción y Salida',
      exitChannelsSubtitle: 'Canales preferidos por los clientes al interactuar con el establecimiento.',
      activeTag: 'Activo',
      sec1Title: '1. Alcance & Tráfico de Clientes Generado en Google Maps',
      sec1PeriodPrefix: 'Periodo:',
      statFiveStarsGoogle: 'Reseñas 5★ en Google',
      statFiveStarsGoogleDesc: 'Canalizadas por el Smart QR',
      statViewsGoogle: 'Vistas en Google Maps',
      statViewsGoogleGrowth: '+142% crecimiento local',
      statPositionGoogle: 'Posición en Google Maps',
      statPositionGoogleDesc: 'Búsqueda local en tu categoría',
      statVipDatabase: 'Base de Datos Club VIP',
      statVipDatabaseLocked: '🔒 Bloqueada',
      statVipDatabaseLockedDesc: 'Entrega de datos de clientes registrados no incluida en Plan Básico.',
      statVipDatabaseUnlockBtn: 'Desbloquear en Pro / Empresarial',
      statVipDatabaseViewBtn: 'Ver / Descargar Base de Datos',
      sec2Title: '2. Beneficio Tangible & Facturación Protegida (ROI Financiero)',
      sec2ActiveBadge: 'Blindaje Activo',
      statBlockedComplaints: 'Quejas Bloqueadas',
      statBlockedComplaintsDesc: 'Crisis neutralizadas antes de Google',
      statProtectedMoney: 'Dinero Protegido Estimado',
      statProtectedMoneyDesc: 'Fórmula Harvard Business Review',
      statRatingEvolution: 'Evolución del Rating',
      statRatingEvolutionDesc: '+0.7 estrellas ganadas',
      statAntiSpamCompliance: 'Cumplimiento Anti-Spam',
      statAntiSpamComplianceDesc: '0 suspensiones en Google Maps',
      roiMethodologyTitle: '💡 ¿Cómo se calcula el dinero protegido con Prestigia?',
      roiMethodologyP1: 'Según investigaciones de Harvard Business Review y BrightLocal, un cliente insatisfecho que publica 1 o 2 estrellas en Google Maps ahuyenta en promedio a 25 a 30 clientes potenciales que buscan opciones en la zona (un estimado significativo en ventas y reservas perdidas por incidente).',
      roiMethodologyP2: 'Al interceptar las quejas en privado mediante el Smart QR y canalizarlas directamente al Portal Clientes para su resolución interna, tu marca evita la pérdida de clientes nuevos y retiene al cliente inconforme, pagando la suscripción de Prestigia con solo 1 incidente neutralizado.',
      sec3Title: '3. Rendimiento Comparativo Entre Sedes',
      colLocation: 'Sede / Ubicación',
      colManager: 'Encargado Responsable',
      colRating: 'Calificación',
      colReviewsPeriod: 'Reseñas Periodo',
      colAnswered: 'Respondidas',
      colPending: 'Faltan',
      colBlocked: 'Quejas Blindadas',
      colEffectiveness: 'Efectividad',
      colStatus: 'Estado',
      statusAllClear: 'Al Día',
      statusPendingSuffix: 'Pendiente(s)',
      sec4Title: 'Informe Ejecutivo Listo para Presentación o Archivo',
      sec4Subtitle: 'Exporta las métricas consolidadas del periodo para socios o comités directivos.',
      sec4PrintPdf: 'Imprimir / Guardar en PDF',
      sec4CopySummary: 'Copiar Resumen Ejecutivo',
      sec4CopiedAlert: '¡Resumen copiado al portapapeles!',
      chartsSectionTitle: 'Análisis Visual & Desglose Gráfico de Reputación',
      ratingsBreakdownTitle: 'Filtro Inteligente: 2 Bifurcaciones',
      ratingsBreakdownSubtitle: '4★ y 5★ enviadas a Google Maps • 1★ a 3★ escudadas en privado',
      ratingsAverageBadge: 'Google Maps',
      volumeFlowTitle: 'Flujo y Tendencia de Opiniones del Periodo',
      volumeFlowSubtitle: 'Comparativa de reseñas públicas en Google vs quejas capturadas en privado',
      legendPublicReviews: 'Reseñas Públicas (Google Maps)',
      legendPrivateComplaints: 'Quejas Privadas Blindadas (QR)',
      effectivenessGaugeTitle: 'Índice de Efectividad & Retención',
      effectivenessGaugeSubtitle: 'Tasa de resolución y clientes atendidos en tiempo récord',
      effectivenessGaugeBadge: 'Blindaje Activo',
      exportCsvBtn: 'Exportar Reporte a Excel (CSV)',
      dispatchPendingBtn: 'Despachar con IA',
      printDossierTitle: 'Informe Ejecutivo de Auditoría y Blindaje Reputacional',
      printDossierSubtitle: 'Certificado oficial de reputación digital y gestión operativa',
      printAuditedBy: 'Auditado y respaldado por la Plataforma Prestigia',
      printOfficialCertificate: 'Documento confidencial para uso exclusivo de Gerencia General y Junta Directiva.',
    },
    profile: {
      headerBadge: 'Identidad Visual, Redes & Equipo',
      headerTitle: 'Identidad de Marca, Redes & Colaboradores',
      headerSubtitle: 'Personaliza tu identidad visual (logotipo y colores), configura los canales y redes oficiales de cada sede, y gestiona el equipo de colaboradores. Los datos de la empresa y la creación de sedes son administrados centralmente por Prestigia.',
      saving: 'Guardando...',
      savedSuccess: '¡Guardado con Éxito!',
      saveChanges: 'Guardar Cambios',
      syncRealtime: 'Todos los cambios en tu marca y sedes se han sincronizado en tiempo real.',
      sec1Title: '1. Datos de la Empresa & Plan',
      commercialBadge: 'Comercial',
      clientIdLabel: 'ID de Cliente Prestigia:',
      taxIdLabel: 'Identificación Tributaria (NIT / RFC / RUT / CIF):',
      taxIdPlaceholder: 'Ej: 901.458.723-1 o B-12345678',
      brandNameLabel: 'Nombre Comercial de la Marca:',
      brandNamePlaceholder: 'Ej: Prestigia / Clínica San Lucas / AutoExpress',
      categoryLabel: 'Categoría del Negocio:',
      categoryPlaceholder: 'Ej: Salud, Belleza, Automotriz, Retail, Gastronomía, Hotelería',
      ownerNameLabel: 'Nombre del Propietario:',
      ownerNamePlaceholder: 'Ej: Carlos Gómez',
      ownerPhoneLabel: 'WhatsApp de Gerencia:',
      ownerPhonePlaceholder: 'Ej: +57 300 123 4567',
      subTitle: 'Suscripción & Facturación',
      licenseValidityLabel: 'Vigencia de Licencia:',
      licenseValidityVal: 'Vigente & Activa (Renovación Automática)',
      planElite: '👑 PLAN ÉLITE (EMPRESARIAL)',
      planPro: '⭐ PLAN PRO (CRECIMIENTO)',
      planBasic: 'PLAN BÁSICO (INICIAL)',
      supportAllowanceLabel: 'Cuota de Soporte Técnico:',
      supportElite: '4 tickets/mes (VIP prioritario)',
      supportPro: '2 tickets/mes',
      supportBasic: '1 ticket/mes',
      billingCycleLabel: 'Ciclo de Cobro:',
      billingCycleVal: 'Mensual Recurrente',
      accountStatusLabel: 'Estado de Cuenta:',
      accountStatusVal: '● Al Día (Activo)',
      managePlanBtn: 'Gestionar Plan & Pagos',
      legalContractBtn: 'Contrato B2B & Legal',
      sec2Title: '2. Identidad Visual (Look & Feel)',
      designBadge: 'Diseño',
      logoUrlLabel: 'URL del Logotipo Oficial:',
      noLogo: 'Sin Logo',
      logoPlaceholder: 'https://tu-sitio.com/logo.png',
      logoNote: 'Formato cuadrado recomendado (PNG o JPG).',
      uploadLogoBtn: 'Subir Archivo',
      removeLogoBtn: 'Quitar Logo',
      logoSizeNote: 'Formatos recomendados: PNG o JPG con fondo transparente (máx. 2MB).',
      requestCompanyUpdateBtn: 'Solicitar Cambio Oficial de Datos a Soporte Prestigia',
      requestBranchUpdateBtn: 'Solicitar Modificación de Sede',
      primaryColorLabel: 'Color Corporativo Primario:',
      customColorLabel: 'Personalizado:',
      qrThemeLabel: 'Contraste del Smart QR:',
      qrThemeDark: 'Obsidiana (Fondo Oscuro)',
      qrThemeLight: 'Mármol (Fondo Blanco / Impresión)',
      sec3Title: '3. Canales Digitales & Redes',
      presenceBadge: 'Presencia',
      websiteLabel: 'Sitio Web Oficial de la Marca:',
      managedByPrestigia: 'Gestionado por Prestigia',
      websiteNote: '🌐 Dominio oficial incluido y optimizado para SEO local. Para cambiar de dominio solicita soporte VIP.',
      socialLabel: 'Redes Sociales (Visibles en Smart QR):',
      testSocialBtn: 'Probar',
      testSocialTooltip: 'Abre este enlace en una pestaña nueva para verificar tu perfil o post.',
      socialNormalizedHint: 'Normalización activa: Puedes escribir @tu_marca o el link directo.',
      vipGroupLabel: 'Enlace a Comunidad VIP de WhatsApp:',
      vipGroupPlaceholder: 'https://chat.whatsapp.com/tu-grupo-vip o wa.me/...',
      vipGroupNote: '💬 Los clientes que califiquen 5 estrellas recibirán la invitación automática a este canal.',
      staffMaxLimitAlert: 'Has alcanzado el límite máximo de 30 colaboradores para esta sede.',
      branchSecTitle: 'Administración de Sedes & Personal',
      branchQuotaLabel: 'Cupo de Sedes en Plan Élite:',
      requestExtraBranchBtn: 'Solicitar Sede Adicional',
      activateMultiBranchBtn: 'Activar Multi-Sede (Élite)',
      editingPrefix: 'Editando:',
      branchNameLabel: 'Nombre de la Sede:',
      branchAddressLabel: 'Dirección Física:',
      branchAddressPlaceholder: 'Ej: Calle 67 # 9-20',
      cityLabel: 'Ciudad:',
      cityPlaceholder: 'Ej: Bogotá',
      localityLabel: 'Localidad / Zona:',
      localityPlaceholder: 'Ej: Chapinero',
      googleReviewLabel: 'Enlace de Reseñas de Google Maps (Destino 5★):',
      testLink: 'Probar Enlace',
      googleReviewNote: 'A este enlace exacto se dirigen los clientes que califican 4 o 5 estrellas desde el Smart QR.',
      managerPhoneLabel: 'WhatsApp del Encargado (Alertas):',
      managerPhonePlaceholder: 'Ej: +57 300 111 2233',
      managerPinLabel: 'Clave de Acceso Sede (PIN):',
      managerPinPlaceholder: 'PIN numérico o contraseña',
      staffSectionLabel: 'Colaboradores / Trabajadores Asignados a esta Sede:',
      removeStaffTooltip: 'Eliminar trabajador',
      staffInputPlaceholder: 'Ej: Daniel (Atención), Dra. Andrea (Especialista), Carlos (Recepción)...',
      addStaffBtn: 'Añadir',
      saveAllBtn: 'Guardar Todos los Cambios del Perfil y Sedes',
      savingAll: 'Sincronizando Cambios en la Nube...',
      savedAllSuccess: '¡Configuración de Marca y Sedes Guardada!',
    },
    modals: {
      billing: {
        tag: 'CENTRO DE PLANES & FACTURACIÓN PRESTIGIA',
        title: 'Gestión de Suscripción y Pagos',
        desc: 'Puedes cambiar de plan, añadir sedes o solicitar soporte de cobros en cualquier momento.',
        basicName: 'PLAN BÁSICO',
        basicPrice: 'Tarifa Corporativa Personalizada',
        basicDesc: 'Filtrado esencial Smart QR sin alertas en vivo. 1 Pantalla Central de Dueño.',
        basicF1: '1 Sede • Solo 1 Pantalla Dueño',
        basicF2: 'Smart QR con filtro 5★',
        basicF3: '1 soporte técnico/mes',
        basicBtn: 'Cotizar con Asesor Comercial',
        proName: 'PLAN PRO',
        proPrice: 'Tarifa Corporativa Personalizada',
        proDesc: 'Para negocios que requieren rescate instantáneo de clientes y respuestas con IA.',
        proF1: '1 Sede • 1 Pantalla Dueño + 2 Pantallas Local',
        proF2: 'Asistente IA Google + Alertas en Vivo',
        proF3: '2 soportes técnicos/mes',
        proBtn: 'Cotizar con Asesor Comercial',
        eliteName: 'PLAN ÉLITE',
        eliteBadge: 'Tu Plan Actual',
        elitePrice: 'Tarifa Corporativa Personalizada',
        eliteDesc: 'Potencia completa Multi-Sede, Campañas & Sorteos automáticos y Rescate IA WhatsApp.',
        eliteF1: 'Hasta 3 Sedes (1 Dueño + 2 por Sede + TV)',
        eliteF2: 'Campañas de Sorteo con Ruleta',
        eliteF3: 'Rescate WhatsApp con IA',
        eliteF4: '4 soportes VIP al mes',
        eliteActive: '👑 Plan Activo y Vigente',
        gatewayTitle: 'Pasarela de Pago Certificada (Wompi, Bold, PSE y Tarjeta)',
        gatewayDesc: 'Facturación electrónica directa enviada a tu correo tributario.',
        contactBtn: 'Contactar Facturación Prestigia',
      },
      extraBranch: {
        title: 'Límite de 3 Sedes Alcanzado',
        desc: 'Tu suscripción Plan Élite incluye hasta un máximo de 3 sedes físicas integradas en tu cuota base.',
        rateLabel: 'Tarifa por Sede Adicional:',
        rateValue: '+$99.000 COP / mes ($29 USD / mes)',
        details: 'Cada sede adicional incluye Smart QR individual, 2 pantallas activas de local, radar de Google Maps independiente, personal asignado y soporte técnico prioritario.',
        backBtn: 'Volver',
        requestWaBtn: 'Solicitar por WhatsApp',
      },
      newBranch: {
        title: 'Agregar Nueva Sucursal',
        desc: 'Ingresa los datos físicos de tu nueva sede.',
        nameLabel: 'Nombre de la Sede:',
        cityLabel: 'Ciudad:',
        localityLabel: 'Localidad / Zona:',
        addressLabel: 'Dirección Física:',
        phoneLabel: 'WhatsApp Encargado:',
        pinLabel: 'PIN de Acceso Sede:',
        cancelBtn: 'Cancelar',
        createBtn: 'Crear Sede',
      },
      aiRescue: {
        badge: '✨ RESCATE DE CLIENTE CON IA • PLAN ÉLITE',
        title: '3 Estrategias Hiperpersonalizadas de Retención',
        desc: 'Elige la estrategia de compensación o disculpa que mejor se adapte al caso. Se enviará directamente al WhatsApp del cliente y se marcará como resuelto.',
        clientInfo: 'Información del Cliente:',
        complaintLabel: 'Motivo del Reclamo:',
        draftLabel: 'Propuesta de Mensaje redactada por la IA:',
        generating: 'Generando propuesta con IA...',
        regenerate: 'Regenerar otra opción con IA',
        sendWa: 'Abrir Chat y Enviar por WhatsApp',
        copy: 'Copiar',
        copied: '¡Copiado!',
        close: 'Cerrar',
        staffAttended: 'Personal que atendió:',
        loading: 'Analizando el motivo de la queja y redactando 3 tácticas de rescate con Inteligencia Artificial...',
        sendWaAndResolve: 'Enviar por WhatsApp & Marcar Resuelto',
      },
      customerDatabase: {
        badge: '📁 BASE DE DATOS OFICIAL DE CLIENTES & HABEAS DATA',
        planElite: 'Multi-Sede Total',
        planPro: 'Sede Única (Plan Pro)',
        title: 'Clientes Registrados & Consentimiento de Fidelización',
        desc: 'Contactos captados a través del Smart QR con autorización legal de tratamiento de datos (Habeas Data).',
        exportBtn: 'Descargar CSV Completo',
        habeasDataNotice: 'Auditado bajo la Ley 1581 de Habeas Data.',
        totalRegistered: 'Total Registrados:',
        contactsCount: 'contactos',
        downloadCsv: 'Descargar Base de Datos Completa (CSV)',
        emptyList: 'No hay contactos registrados aún en esta sede.',
        habeasDataAccepted: 'Habeas Data Aceptado',
        writeWaTitle: 'Escribir al WhatsApp del cliente',
        close: 'Cerrar',
      },
      upsell: {
        badge: '👑 NIVELES DE POTENCIA PRESTIGIA',
        title: 'Escala el Blindaje, Operación y Facturación de tu Marca',
        desc: 'Selecciona el plan ideal para tu estructura comercial. Puedes cambiar de plan en cualquier momento.',
        basicName: 'BÁSICO (1 SEDE)',
        basicLocation: '1 Sede • Solo 1 Pantalla Dueño',
        basicPrice: 'Tarifa Corporativa Personalizada',
        basicPriceUsd: 'Sujeto a cotización oficial según sedes y volumen',
        basicCurrentPlan: 'Tu Plan Actual',
        basicSelectBtn: 'Cotizar Plan Básico',
        basicF1: 'Filtro Smart QR anti-reseñas 1 a 3★',
        basicF2: 'Radar de Google Maps básico',
        basicF3: '1 Pantalla de Dueño (Sin acceso para local/caja)',
        basicF4: '1 Soporte técnico al mes (horarios/datos)',
        basicF5: 'Sin Alertas en Vivo (revisión manual)',
        basicF6: 'Sin Reportes Diarios ni Semanales',
        basicF7: 'Sin Entrega de Datos de clientes (CSV)',
        basicF8: 'Sin Asistente IA Google ni Sorteos',
        proName: 'PRO (1 SEDE)',
        proLocation: '1 Sede • 1 Dueño + 2 Local',
        proPrice: 'Tarifa Corporativa Personalizada',
        proPriceUsd: 'Sujeto a cotización oficial según sedes y volumen',
        proCurrentPlan: 'Tu Plan Actual',
        proActivateBtn: 'Cotizar Plan Pro',
        proF1: 'Todo lo de Básico',
        proF2: '1 Pantalla Dueño + 2 Pantallas en Local/Caja',
        proF3: 'Asistente IA Google (Anti-Spam)',
        proF4: 'Alertas en Vivo Sonoras & Push (Sala y Celular)',
        proF5: 'Reportes Diarios en Vivo y Semanales',
        proF6: 'Sorteo del Mes Oficial (1 Ganador)',
        proF7: 'Entrega de Datos de Clientes (1 Sede + CSV)',
        proF8: '2 Soportes técnicos al mes',
        eliteName: 'ÉLITE TOTAL',
        eliteBadge: 'RECOMENDADO PARA MARCAS',
        eliteLocation: 'Hasta 3 Sedes • Multidispositivo',
        elitePrice: 'Tarifa Corporativa Personalizada',
        elitePriceUsd: 'Sujeto a cotización oficial según sedes y volumen',
        eliteCurrentPlan: '👑 Tu Plan Actual (Élite)',
        eliteUnlockBtn: 'Cotizar Plan Élite',
        eliteF1: 'Hasta 3 Sedes (1 Dueño + 2 por Sede)',
        eliteF2: 'Pantalla TV Wallboard en Vivo para Área Operativa / Recepción',
        eliteF3: 'Rescate WhatsApp con IA (3 tácticas)',
        eliteF4: 'Sorteos Multi-Ganador (1 a 10+) por Sede o Global',
        eliteF5: 'Alertas Omnicanal en Vivo (Sala y Celular)',
        eliteF6: 'Todos los Reportes (Diario, Semanal, Mensual, Anual y ROI)',
        eliteF7: 'Entrega Total Multi-Sede de Clientes (CSV)',
        eliteF8: '4 Soportes prioritarios VIP al mes',
        supportFooterNote: 'Soportes mensuales aplican para cambios de precios, servicios, catálogos, fotos y dudas técnicas de plataforma. Sin permanencia mínima.',
      },
      giveawayWinner: {
        badge: '¡TENEMOS UN GANADOR OFICIAL! • PLAN ÉLITE',
        badgePlural: '¡{count} GANADORES OFICIALES SELECCIONADOS! • PLAN ÉLITE',
        title: 'Resultado de la Tómbola de Satisfacción',
        titlePlural: 'Tómbola de Ganadores del Mes',
        subtitle: 'El sistema seleccionó al azar a un cliente verificado de tu lista de participantes.',
        subtitlePlural: 'El sistema seleccionó al azar a {count} clientes verificados de tu lista de participantes.',
        registeredBranch: 'Sede de Registro:',
        prizeAssigned: '🎁 Premio Asignado:',
        winnerTab: 'Ganador',
        winnerCardTitle: 'Ganador Seleccionado',
        waLabel: 'Mensaje Oficial de WhatsApp (Léelo y modifícalo antes de enviar):',
        waEditableBadge: '100% Editable',
        copied: '¡Copiado!',
        copyBtn: 'Copiar Texto',
        closeBtn: 'Cerrar',
        sendWaBtn: '📲 Enviar WhatsApp Oficial al Ganador',
        sentBadge: 'WhatsApp Enviado',
      },
    },
    systemModal: {
      title: 'Prestigia Enterprise Core',
      ltsBadge: 'v2.4 LTS',
      subtitle: 'Infraestructura Cloud de Alta Disponibilidad & Blindaje Reputacional',
      globalStatus: 'Estado Global',
      operational: 'Operativo',
      uptime: 'SLA 99.9% Uptime',
      latency: 'Latencia Cloud',
      encryption: 'Cifrado Datos',
      bankingGrade: 'Grado Bancario',
      license: 'Licencia Corporativa:',
      plan: 'Nivel de Plan:',
      authorizedBranches: 'Sedes Físicas Habilitadas:',
      vipSupport: 'Soporte VIP Garantizado:',
      activeModules: 'Módulos de Blindaje Activos',
      filterGoogle: 'Filtro Anti-Reseñas Google Maps',
      habeasData: 'Ley 1581 Habeas Data Auditada',
      rescueAi: 'IA de Rescate WhatsApp 24/7',
      smartQrRouter: 'Enrutador Dinámico Smart QR',
      build: 'Build: 2026.09.22-Enterprise',
      viewLegal: 'Ver Contratos & Términos Legales',
      close: 'Cerrar Información',
    },
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      saved: '¡Guardado con éxito!',
      confirm: 'Confirmar',
      back: 'Regresar',
      print: 'Imprimir / PDF',
    },
  },

  en: {
    navbar: {
      portalB2b: 'B2B Portal',
      live: 'LIVE',
      systemInfoTooltip: 'Click to view Platform Status, Security & System License',
      ownerView: '👑 General Owner View',
      managerView: '🏢 Branch Manager:',
      supportTicket: 'VIP Support:',
      supportTooltip: 'Click to request priority technical assistance via VIP WhatsApp',
      allBranches: '👑 All Locations (Elite Consolidated)',
      singleBranch: 'Single Location',
      multiBranchUpsell: 'Multi-Location (Elite)',
      brandProfile: 'Brand Profile',
      soundOn: 'Sound ON',
      soundOff: 'Sound OFF',
      testAlert: 'Test Alert',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      logout: 'Log out',
      languageSelector: 'Language',
    },
    tabs: {
      radar: 'Google Radar',
      complaints: 'Private Containment',
      qr: 'Smart QR',
      reactivate: 'Reactivate 5★',
      giveaways: 'VIP Giveaways',
      ai: 'AI Assistant',
      reports: 'Analytics',
      profile: 'Brand & Team',
      branchesBadge: 'Branches',
    },
    radar: {
      title: 'Google Maps Reviews Monitoring',
      badge: 'Official Profile',
      subtitle: 'Respond promptly to rank your establishment higher on Google Maps local search.',
      statTotal: 'Total Reviews',
      statRating: 'Average Rating',
      statPending: 'Pending Replies',
      statResponseRate: 'Response Rate',
      filterAll: 'All',
      filterUnanswered: '🚨 Unanswered',
      filterAnswered: '✅ Answered',
      filterFiveStars: '⭐ 5 Stars',
      filterCritical: '⚠️ Critical (1-3★)',
      searchPlaceholder: 'Search by reviewer name or text...',
      noReviews: 'No reviews registered for this selection.',
      noMatches: 'No reviews found matching your search filters.',
      loading: 'Loading reviews...',
      arrival: 'Arrival:',
      unansweredPriority: 'Unanswered (Priority)',
      answered: 'Answered',
      officialReplyTitle: 'Your Official Google Maps Response:',
      attendedIn: '⚡ Attended in:',
      repliedOn: 'Replied on:',
      attendedBy: 'Attended by:',
      teamPrestigia: 'Prestigia Team',
      generateAiReply: 'Generate AI Response',
      regenerateAiReply: 'Regenerate with AI',
      manualReply: 'Manual Reply',
      editManualReply: 'Edit Reply',
      cancelManualReply: 'Cancel',
      saveManualReply: 'Save & Publish',
      manualReplyPlaceholder: 'Write your official response to this review here...',
      openInMaps: 'Open in Google Maps',
      copyReview: 'Copy review',
      copiedReview: 'Copied!',
      copyReply: 'Copy reply',
      copiedReply: 'Copied!',
    },
    dashboard: {
      priorityAlertTitle: 'Priority Attention:',
      unansweredGoogleReviewsSingular: 'unanswered Google review',
      unansweredGoogleReviewsPlural: 'unanswered Google reviews',
      andConjunction: 'and',
      unrescuedPrivateComplaintsSingular: 'unrescued private complaint',
      unrescuedPrivateComplaintsPlural: 'unrescued private complaints',
      viewGoogleReviews: 'View Google Reviews',
      viewWhatsappComplaints: 'View WhatsApp Complaints',
      metricTodayTitle: 'Feedback Today (Live)',
      metricTodayBadge: 'Today',
      onGoogleMaps: 'on Google Maps',
      privateQr: 'private QR',
      metricAnsweredTitle: 'Answered Today',
      metricEffectiveness: 'Effectiveness',
      shiftFullAttention: '100% Shift Attention Achieved!',
      ofAttendedToday: 'attended today',
      metricPendingTitle: 'Pending Responses',
      metricRequiresAction: 'Requires Action',
      metricUpToDate: 'Up to Date',
      onGoogle: 'on Google',
      privateComplaints: 'private complaints',
      metricRatingTitle: 'Rating & Reputation Shield',
      complaintsNeutralized: 'complaints neutralized before hitting Google',
      pushBannerTitle: 'Push Notifications on Phone & PC:',
      pushBannerText: 'Enable browser notifications to receive instant alerts whenever a customer leaves feedback or registers a complaint.',
      pushBannerButton: 'Enable Push Notifications',
      alertRescueAi: 'Rescue with AI',
      alertViewComplaint: 'View Complaint',
      alertReplyAi: 'Reply with AI',
      alertViewRadar: 'View Radar',
      alertDismiss: 'Dismiss Alert',
      priorityBadge: 'Priority',
    },
    complaints: {
      title: 'Private Complaints Inbox (1 to 3 Stars)',
      blockedBadge: 'Blocked from Google',
      subtitle: 'None of these complaints reached the internet. Rescue the customer by opening WhatsApp before they cool off.',
      loading: 'Loading complaints...',
      empty: '🎉 No pending private complaints. All customer service is up to date.',
      hiddenInBasic: '🔒 Not available',
      arrival: 'Arrival:',
      pendingBadge: 'Pending Rescue (Priority)',
      resolvedBadge: 'Resolved',
      complaintReasonLabel: 'Reason for dissatisfaction:',
      attendedByLabel: 'Attended by:',
      resolvedOn: 'Resolved on:',
      rescuedIn: '⚡ Rescued in:',
      resolvedBy: 'Resolved by:',
      rescueWithAi: 'Rescue with AI',
      contactWaUpsell: 'Contact via WhatsApp (Pro/Elite)',
      directWa: 'Direct WhatsApp',
      directWaComposeTitle: 'WhatsApp Rescue Message',
      directWaSendAndResolve: 'Send via WhatsApp & Mark Resolved',
      directWaPlaceholder: 'Write the rescue message for the customer...',
      officialRescueTitle: '⚡ OFFICIAL WHATSAPP RESCUE MESSAGE SENT:',
      copyRescue: 'Copy message',
      copiedRescue: 'Copied!',
      markAsResolved: 'Mark as resolved',
      filterAll: 'All',
      filterPending: '🚨 Pending',
      filterResolved: '✅ Resolved',
      searchPlaceholder: 'Search by customer, phone, or reason...',
      noMatches: 'No complaints found matching the applied filters.',
    },
    qr: {
      activeBadge: 'SMART QR ACTIVE • LOCATION',
      title: 'Dynamic Smart QR Code with Reputation Shield',
      subtitlePrefix: 'Directs to your secure router at',
      downloadPng: 'Download PNG for Mobile',
      testQr: 'Test QR',
      branchSelectorLabel: 'Select Location:',
      formatTabMobile: '📱 Mobile / Screen',
      formatTabPrint: '🖨️ Print / Table Stands',
      downloadMobilePng: 'Download Mobile PNG',
      downloadPrintPng: 'Download Print PNG (High Res)',
      copyLink: 'Copy Link',
      copiedLink: 'Link Copied!',
      guideTitle: 'Usage Guide: 100% Digital or Local Print Shop',
      guideSubtitle: 'You have complete freedom to operate immediately without waiting for physical mail:',
      guidePoint1Title: 'On Mobile:',
      guidePoint1Desc: 'Save the PNG to the staff or technician photo gallery to present when collecting payments.',
      guidePoint2Title: 'On Tables or Counters:',
      guidePoint2Desc: 'Print stickers or acrylic stands at any local print shop using this high-resolution code.',
      guidePoint3Title: 'Total Peace of Mind:',
      guidePoint3Desc: 'If you ever change address or your Google profile, we update the destination in the cloud with no reprinting needed.',
      statusTitle: 'QR Router Status',
      statusActive: 'Active & Protected (Kill Switch Operational)',
      tableTentTitle: 'Official Table Tent Stand • Ready to Print',
      tableTentSubtitle: 'Professional branded flyer ready for acrylic stands, table stickers, or posters.',
      downloadTableTentBtn: '🖨️ Download Table Tent (High Res)',
      downloadOnlyQrBtn: '🔳 Download QR Only',
      tableTentStyleDark: '🌙 Luxury / Dark',
      tableTentStylePrint: '☀️ Print Shop / Pure White',
      tableTentQuestion: 'How was your experience today?',
      tableTentScanPrompt: '📷 Scan with your phone camera',
      tableTentTakesSeconds: 'Takes 10 seconds • No app download required',
      tableTentCreatedBy: '⚡ Created by Prestigia • VIP Reputation Shield',
    },
    reactivate: {
      badge: '5★ Review Launcher • Historical Customers',
      planTag: 'Universal (Basic, Pro & Enterprise)',
      title: 'Mass Customer Reactivation with 2-Way Reputation Shield',
      subtitle: 'Import your existing customer database (Excel, WhatsApp, POS or notebook) to invite them to review your business with an irresistible hook. Spark 20 to 50 5-star reviews in the first 48 hours with absolute confidence.',
      shieldRate: 'Reputation Shield Rate',
      shieldSafety: '100% Protected',
      shieldZeroComplaints: 'Zero public complaints on Google',
      step1Title: '1. Send via WhatsApp',
      step1Name: 'Personalized Message',
      step1Desc: 'A warm invitation offering an incentive (e.g., complimentary dessert or coffee).',
      step2Title: '2. 2-Way Router',
      step2Name: 'Prestigia Filter Active',
      step2Desc: 'Customer rates their overall experience on a straightforward 1 to 5 star scale.',
      step3Title: '3. If 4 or 5★',
      step3Name: 'Direct to Google Maps!',
      step3Desc: 'Opens Google Maps review modal to post their 5★ review and boost your local ranking.',
      step4Title: '4. If 1 to 3★',
      step4Name: 'Private WhatsApp Rescue',
      step4Desc: 'Google Maps stays clean; the issue is routed privately to your management team.',
      hookTitle: '1. Configure the Incentive Hook',
      highConversion: 'High Conversion',
      hookLabel: 'Customer incentive offered for reviewing:',
      hookPlaceholder: 'e.g., complimentary dessert, 10% discount, house coffee...',
      hookTip: '💡 Offering a small courtesy boosts customer conversion by over 60%.',
      targetBranch: 'Target Location:',
      previewTitle: 'WhatsApp Message Preview',
      previewBubbleGreeting: 'Hi',
      previewBubbleThanks: 'we want to thank you for being our valued customer.',
      previewBubblePrompt: 'We would love to hear your honest feedback via this quick 30-second link:',
      previewBubbleReward: '🎁 As our token of gratitude, upon completing it you will receive',
      loadTitle: '2. Load Past Customers',
      loadEasy: 'Fast & Easy',
      clientNameLabel: 'Customer Name:',
      clientNamePlaceholder: 'e.g. John Doe',
      clientPhoneLabel: 'WhatsApp / Mobile:',
      clientPhonePlaceholder: 'e.g. +1 555 123 4567',
      addClientBtn: 'Add Customer to List',
      orBatch: 'or import in bulk',
      openExcelBtn: '📋 Paste Bulk List from Excel / WhatsApp',
      closeExcelBtn: 'Close Excel Importer',
      pasteLabel: 'Paste your contacts here (one per line or Name, Phone):',
      pastePlaceholder: 'Example:\nJohn Doe, 5551234567\nJane Smith, 5559876543\n5558765432',
      autoDetectTip: 'Automatically detects phone numbers and customer names.',
      processImportBtn: 'Process & Import',
      totalContacts: 'Total Contacts',
      sentInvitations: 'Invitations Sent',
      pendingInvitations: 'Pending',
      progress: 'Progress',
      filterAll: 'All',
      filterPending: 'Pending',
      filterInvited: 'Invited',
      demosBtn: 'Demos',
      demosTooltip: 'Restore demo test contacts',
      searchPlaceholder: 'Search customer or phone...',
      emptySearch: 'No contacts found with this filter. Add a customer or import from Excel.',
      colCustomer: 'Customer',
      colWhatsapp: 'WhatsApp',
      colSource: 'Source',
      colStatus: 'Status',
      colLauncher: '1-Click Launcher',
      sourceDefault: 'Customer Base',
      statusInvited: 'Invited',
      statusReady: 'Ready',
      statusPending: 'Pending Delivery',
      btnResend: 'Resend',
      btnSendWa: 'Send WhatsApp',
      btnLaunchTitle: 'Opens WhatsApp with personalized message and Smart QR link',
      btnDeleteTitle: 'Remove from list',
      quickIncentivesLabel: 'Quick 1-touch incentives (max 5):',
      addIncentiveBtn: '+ Add incentive',
      maxIncentivesReached: 'Maximum 5 incentives reached',
      manualHookLabel: 'Or customize the hook manually for this customer:',
      copyCampaignLink: 'Copy Link',
      copiedCampaignLink: 'Copied!',
      branchSelectorTitle: 'Campaign Target Location:',
      strategyModeImmediate: '🎁 Direct Incentive',
      strategyModeGiveaway: '🎟️ Monthly Giveaway',
      strategyModeNone: '💬 Organic Review Only (No Prize)',
      giveawayHookLabel: 'Giveaway Prize or Raffle customer will enter:',
      giveawayHookPlaceholder: 'e.g., this month\'s dinner for 2 raffle',
      giveawayWinnersLabel: 'Number of winners to draw:',
      noPrizeNoticeTitle: '100% Organic Mode Active',
      noPrizeNoticeDesc: 'The message invites the customer with a warm and genuine tone to review their experience, without promising prizes or requiring promotional budget.',
      campaignGoalLabel: 'Primary Campaign Goal:',
      goalReviewsTitle: '⭐ Google 5★ Reviews (Recent Guests)',
      goalReviewsDesc: 'Turn recent visits into 5-star Google Maps reviews using quick incentives or a weekly flash raffle.',
      goalTrafficTitle: '🚀 Wake Up Inactive Database (Drive Foot Traffic)',
      goalTrafficDesc: 'Re-engage your database (+30 days) to bring customers back to your venue this week.',
      trafficHookLabel: 'Irresistible In-Venue Visit Hook:',
      trafficHookPlaceholder: 'e.g., 2-for-1 cocktails this Thursday & Friday / Free welcome signature drink',
      trafficHookTip: 'Offer an exclusive time-limited benefit to motivate an immediate physical visit.',
      weeklyRaffleTitle: 'Weekly Flash Reactivation Raffle',
      weeklyRaffleBadge: '⚡ DATABASE EXCLUSIVE',
      btnPickReactivationWinner: '🎲 Draw Reactivation Winners',
      filterInactive: '🕒 Inactive (+30d)',
      filterVip: '👑 VIP Guests (+3)',
      filterRecent: '🆕 Recent (<7d)',
      daysAgo: '{days} days ago',
      visitsBadge: '{count} visits',
      reactivationModalTitle: 'Weekly Reactivation Raffle Winners!',
      reactivationModalSubtitle: 'Guests rewarded for re-engaging with your venue this week.',
    },
    giveaways: {
      lockedBadge: '🔒 EXCLUSIVE TO PRO & ELITE PLANS',
      lockedTitle: 'Customer Loyalty Campaigns & Monthly Giveaways',
      lockedDesc: 'Boost your customer ratings by featuring direct incentives on screen such as "Rate your experience and enter this month\'s giveaway". Pro and Elite plans include participant tracking, CSV reports, and a random lucky raffle with direct WhatsApp notifications.',
      feature1Title: '+300% Ratings',
      feature1Desc: 'Visual incentive motivates patrons to scan the QR code.',
      feature2Title: 'Mobile Capture',
      feature2Desc: 'Participant database with legal data privacy consent.',
      feature3Title: 'Enterprise Lucky Raffle',
      feature3Desc: 'Random winner selection with pre-formatted WhatsApp message ready to send.',
      viewPlansBtn: 'View Pro & Enterprise Plans to Activate Giveaways',
      badge: 'Loyalty & Giveaways Module',
      eliteTag: '👑 Enterprise Plan (Raffle Active)',
      proTag: '⚡ Pro Plan (Report Active)',
      title: 'Satisfaction Campaign on Smart QR Router',
      subtitle: 'Configure the promotion customers see when opening the Smart QR at their tables. Each rating logs the customer mobile number for your monthly raffle.',
      monthlyParticipants: 'Monthly Participants',
      habeasDataActive: 'Data Privacy Active',
      cardTitle: 'Configure Campaign on Smart QR',
      cardSubtitle: 'Visible incentive to motivate customers to rate',
      activeStatus: 'Campaign Active',
      pausedStatus: 'Paused',
      managerNoticeTitle: 'View-Only Mode (Branch Manager)',
      managerNoticeDesc: 'The campaign is managed by General Management. On the right you can view participants registered at your location.',
      scopeLabel: 'Campaign Scope:',
      scopeGlobalBadge: '1 Global Campaign',
      scopeBranchBadge: '1 Campaign per Location',
      btnAllBranches: '🌐 All Locations',
      btnPerBranch: '📍 Per Individual Location',
      branchSelectLabel: 'Location to configure:',
      campaignTitleLabel: 'Campaign Title:',
      campaignTitlePlaceholder: 'e.g. Grand Customer Satisfaction Giveaway',
      prizeLabel: 'Prize or Reward Offered:',
      prizePlaceholder: 'e.g. Dinner for 2',
      prizeTip: '💡 This text is highlighted on the customer mobile screen upon scanning the Smart QR.',
      winnersCountLabel: 'Number of Winners to Draw:',
      winnersCountTip: 'How many customers will win this prize? (e.g. 1 grand prize, 3 vouchers, 5 complimentary services).',
      drawDateLabel: 'Official Draw Date:',
      endOfMonthBtn: '⚡ End of this month',
      endOfMonthTooltip: 'Automatically select the last day of this month',
      drawDateBadge: 'Draw Date:',
      drawDateTip: 'Select the exact date on the calendar to avoid typos.',
      termsLabel: 'Quick Terms & Conditions:',
      termsPlaceholder: 'e.g. Valid for customers registered at our locations during the month...',
      btnSaving: 'Saving to Cloud...',
      btnSaved: 'Configuration Saved!',
      btnSaveBranch: 'Save Campaign for This Location',
      btnSaveGlobal: 'Save Global Campaign (All Locations)',
      simulatorTitle: 'Live Simulator: Customer Smart QR',
      activePalette: 'Active Palette',
      simPaused: 'Campaign temporarily paused',
      simRatingPrompt: 'How would you rate your experience?',
      simOfficialSite: 'Official Website',
      statParticipants: 'Participants',
      statAverage: 'Average',
      statDrawDate: 'Draw Date',
      statEndMonth: 'End of Month',
      statStatus: 'Status',
      statWinnerReady: '🏆 Winner Ready',
      statInProgress: '⏳ In Progress',
      raffleTitle: 'Official Raffle Draw',
      raffleDesc: 'The system randomly picks a customer and drafts a WhatsApp message for your review to notify them immediately.',
      btnSpinning: 'Spinning the Raffle...',
      btnSelectWinner: '🎲 Select 1 Winner at Random',
      btnSelectWinnerElite: 'Select Winner (Elite)',
      btnSelectWinnersPlural: '🎲 Select {count} Winners at Random',
      btnSelectWinnersPluralElite: 'Select {count} Winners (Elite)',
      tableTitle: 'Registered Customers Report',
      allBranchesOption: 'All Locations',
      searchPlaceholder: 'Search participant...',
      emptySearch: 'No registered participants found with this filter.',
      colCustomer: 'Customer',
      colWhatsapp: 'WhatsApp',
      colBranch: 'Location',
      colRating: 'Rating',
      colDate: 'Date',
      colStatus: 'Status',
      winnerBadge: '🏆 WINNER OF THE MONTH',
      participatingBadge: 'Participating',
    },
    ai: {
      title: 'Anti-Spam AI Review Response Engine (Google Compliant)',
      subtitle: 'Strictly complies with Google policies: zero duplicate templates, no prohibited phone numbers, and full human review.',
      unlockPro: 'Unlock with Pro Plan',
      respondingTo: 'Replying to:',
      clear: 'Clear',
      noReviewSelected: 'Select any review from Google Radar to draft an instant, personalized reply.',
      goToRadar: 'Go to Radar',
      generating: 'Generating 3 unique AI response variants...',
      selectToneTitle: 'Select the best response tone for your customer:',
      copyResponse: 'Copy Only',
      copied: 'Copied to Clipboard!',
      pasteToGoogle: 'Copy & Open in Google Maps',
      editCustomize: 'Customize',
      doneEditing: 'Done',
      badgeAiCenter: 'AI RAPID DISPATCH COMMAND CENTER',
      titleAiCenter: 'Intelligent Response & Rescue Dispatch Center',
      subtitleAiCenter: 'Dispatch all pending Google Maps replies and WhatsApp recovery messages in minutes without leaving this screen.',
      queueGoogle: 'Google Maps Reviews',
      queueComplaints: 'WhatsApp Grievances',
      queueComplaintsEliteOnly: 'WhatsApp Rescue (Exclusive to Enterprise)',
      allCaughtUpTitle: '🎉 All Caught Up! 100% Reputation Shield',
      allCaughtUpDesc: 'No pending items in this queue. All public opinions and private complaints have been professionally addressed.',
      generatingRescue: 'Drafting 3 customized customer recovery strategies...',
      sendWaAndResolve: 'Send WhatsApp & Mark Resolved',
      unlockedProBadge: '⚡ Pro Plan (Google Maps Active)',
      unlockedEliteBadge: '👑 Enterprise Plan (Google Maps + WhatsApp Active)',
      selectPrompt: 'Select an incoming customer case to generate instant responses',
      rescueStrategyTitle: 'WhatsApp Customer Recovery Strategies:',
      privateComplaintBadge: '🚨 Private Grievance',
      googleReviewBadge: '⭐ Google Maps Review',
      attendedByPrefix: 'Served by:',
      complaintReasonPrefix: 'Reason:',
      markAnsweredNotice: 'Opening on Google Maps will record this review as answered.',
    },
    reports: {
      title: 'Executive Reports & Reputation ROI',
      badge: 'Prestigia Audit',
      subtitle: 'Impact metrics, reputation shield telemetry, and branch & team performance analysis.',
      periodLabel: 'Timeframe:',
      exportCsv: 'Export Customer Database (CSV)',
      exportPdf: 'Generate Executive PDF Report',
      managerBadge: '🏢 Location Operations Control Center',
      managerTitlePrefix: 'Performance Report:',
      managerSubtitle: 'Live monitoring of customer care and weekly shift balance.',
      dailyBtn: 'Daily Report (Today)',
      weeklyBtn: 'Weekly Report',
      monthlyBtn: 'This Month',
      annualBtn: 'Annual Balance',
      shiftUpToDate: 'Shift Up to Date!',
      shiftNeedsAttention: 'Immediate Action Needed!',
      shiftUpToDateDesc: 'All reviews and complaints today at this location have been answered.',
      shiftNeedsAttentionDesc: 'customer(s) waiting for response in today\'s shift.',
      shiftSendOwnerElite: 'Send Shift Closing to Owner via WhatsApp (Enterprise)',
      shiftSendOwnerLocked: 'WhatsApp Shift Closing (Exclusive to Enterprise)',
      btnReplyGoogle: 'Reply on Google',
      btnRescueWa: 'Rescue on WhatsApp',
      kpiReceivedToday: 'Reviews Received Today',
      kpiReceivedTodayDesc: 'on Google Maps • via Smart QR',
      kpiAnsweredToday: 'Reviews Answered Today',
      kpiAnsweredTodayRate: 'Shift response rate:',
      kpiPendingToday: 'Pending Responses',
      kpiPendingTodayDescAlert: 'Require your immediate attention',
      kpiPendingTodayDescOk: 'No pending items!',
      channelPublicTitle: 'Public Channel: Google Maps',
      channelPrivateTitle: 'Private Channel: QR Shield Complaints',
      channelPublicToday: 'today',
      channelPrivateToday: 'today',
      answeredWithAi: 'Answered with AI:',
      unanswered: 'Unanswered:',
      rescuedClients: 'Rescued customers:',
      pendingToContact: 'Pending to contact:',
      openGoogleRadar: 'Open Google Maps Radar',
      openRescueWa: 'Open WhatsApp Rescue Inbox',
      logbookTitle: 'Today\'s Live Customer Logbook',
      noReviewsToday: 'No new feedback recorded today at this location yet.',
      logGoogleTag: '(Google Maps)',
      logStatusAnswered: 'Answered',
      logReplyWithAi: 'Reply with AI',
      logStatusResolved: 'Resolved',
      logContactWa: 'Contact on WhatsApp',
      incidentsTitle: 'Shift Incident & Logbook Telemetry',
      incidentsBadge: '👑 ENTERPRISE',
      incidentsSubtitle: 'Record front-of-house incidents, delays, or courtesies to coordinate with general management.',
      incidentsCountSuffix: 'incident(s) recorded',
      incidentInputPlaceholder: 'e.g. Customer reported delay in service; resolution offered immediately and customer left satisfied...',
      incidentSaving: 'Saving...',
      incidentRegisterBtn: 'Log Incident',
      noIncidents: '✨ No pending incidents this shift. Service is operating smoothly.',
      incidentBy: 'By:',
      incidentHandled: 'Handled',
      rankingTitle: 'Team & Staff Recognition Ranking',
      rankingSubtitle: 'Gamification applicable to advisors, specialists, consultants, technicians, or customer care staff.',
      rankingTop1: '🥇 Top 1',
      rankingTop2: '🥈 Top 2',
      rankingTop3: '🥉 Top 3',
      rankingPositiveMentions: '5★ reviews',
      rankingComplaintsNeutralized: 'complaint courteously neutralized',
      rankingSpeed: 'Excellent response and customer service',
      weeklyReceived: 'Captured Reviews (Week)',
      weeklyReceivedDiff: '+28% vs previous week',
      weeklyFiveStars: '5★ Reviews on Google',
      weeklyFiveStarsDesc: 'Successfully routed',
      weeklyBlocked: 'Shielded Complaints (Private)',
      weeklyBlockedDesc: 'Prevented from reaching Google',
      weeklyResponseRate: 'Response Rate',
      weeklyAvgTime: 'Avg time: 14 min',
      weeklyStaffTitle: '⭐ Hall of Fame: Most Praised Staff Members',
      weeklyStaffSubtitle: 'Track which team members earn top compliments from guests to reward service.',
      weeklyTipTitle: 'Operational Tip of the Week for',
      weeklyTipDesc: 'Presenting the Smart QR code at checkout increased review capture rate by 28%. Continue encouraging satisfied patrons to scan it.',
      confidentialNotice: '🔒 Note: Consolidated monthly, annual financial balances, and revenue telemetry are reserved for General Management.',
      ownerBadge: '👑 Executive Command Center & Prestigia ROI',
      ownerAllBranches: 'All Locations (Consolidated)',
      ownerFilteredPrefix: 'Filtered:',
      ownerTitle: 'Reach, Benefit & Return on Investment',
      ownerSubtitle: 'Quantitative telemetry of economic and reputational returns generated by Prestigia.',
      periodToday: 'Today (Daily)',
      periodYesterday: 'Yesterday',
      periodThisWeek: 'This Week (7 Days)',
      periodThisMonth: 'This Month (30 Days)',
      periodAnnual: 'Annual Balance',
      periodCustom: 'Custom Range 📅',
      periodHoursTitle: 'Hourly / Operating Shifts Filter',
      periodAllHours: 'All Operating Hours (08:00 - 23:00)',
      periodMorningShift: 'Morning (08:00 - 12:00)',
      periodAfternoonShift: 'Afternoon (12:00 - 18:00)',
      periodEveningShift: 'Evening / Closing (18:00 - 23:00)',
      periodSpecificHour: 'Specific Hour',
      dateRangeFrom: 'From:',
      dateRangeTo: 'To:',
      customerBehaviorTitle: '360° Customer Behavior & Hourly Flow Radar',
      customerBehaviorSubtitle: 'Real-time operational intelligence on traffic flow, QR scan conversion, shielded friction, and interaction channels.',
      hourlyTrafficTitle: 'Hourly Flow & Traffic Distribution (08:00 - 23:00)',
      hourlyTrafficSubtitle: 'Interactive hour-by-hour monitoring of QR scans, 5★ reviews generated, and private complaints neutralized. Click any hour to audit.',
      peakHoursBadge: 'Peak Customer Volume Hour',
      riskHoursBadge: 'Peak Shielded Friction Hour',
      goldenHoursBadge: 'Golden Window (Peak 5★ Conversion)',
      customerFunnelTitle: 'Customer Behavior & Conversion Funnel',
      customerFunnelSubtitle: 'From initial QR scan to verified 5-star Google review and VIP database capture.',
      exitChannelsTitle: 'Customer Exit & Interaction Channels',
      exitChannelsSubtitle: 'Preferred touchpoints chosen by customers when interacting with your business.',
      activeTag: 'Active',
      sec1Title: '1. Reach & Customer Traffic Generated on Google Maps',
      sec1PeriodPrefix: 'Timeframe:',
      statFiveStarsGoogle: '5★ Reviews on Google',
      statFiveStarsGoogleDesc: 'Routed via Smart QR',
      statViewsGoogle: 'Google Maps Impressions',
      statViewsGoogleGrowth: '+142% local growth',
      statPositionGoogle: 'Google Maps Ranking',
      statPositionGoogleDesc: 'Local search in your category',
      statVipDatabase: 'VIP Club Database',
      statVipDatabaseLocked: '🔒 Locked',
      statVipDatabaseLockedDesc: 'Customer database export is not included in Basic Plan.',
      statVipDatabaseUnlockBtn: 'Unlock with Pro / Enterprise',
      statVipDatabaseViewBtn: 'View / Download Database',
      sec2Title: '2. Tangible Value & Protected Revenue (Financial ROI)',
      sec2ActiveBadge: 'Active Shield',
      statBlockedComplaints: 'Complaints Shielded',
      statBlockedComplaintsDesc: 'Crises neutralized before Google',
      statProtectedMoney: 'Estimated Protected Revenue',
      statProtectedMoneyDesc: 'Harvard Business Review Methodology',
      statRatingEvolution: 'Rating Evolution',
      statRatingEvolutionDesc: '+0.7 stars gained',
      statAntiSpamCompliance: 'Anti-Spam Compliance',
      statAntiSpamComplianceDesc: '0 suspensions on Google Maps',
      roiMethodologyTitle: '💡 How is protected revenue calculated in Prestigia?',
      roiMethodologyP1: 'According to research by Harvard Business Review and BrightLocal, a dissatisfied customer who posts a 1 or 2-star review on Google Maps deters an average of 25 to 30 prospective customers searching for nearby options (a substantial loss in sales and bookings per incident).',
      roiMethodologyP2: 'By intercepting complaints privately through the Smart QR and offering immediate WhatsApp service recovery, your brand prevents customer defection and retains patrons, paying for the Prestigia subscription with a single neutralized crisis.',
      sec3Title: '3. Comparative Performance Across Locations',
      colLocation: 'Location / Area',
      colManager: 'Branch Manager',
      colRating: 'Rating',
      colReviewsPeriod: 'Reviews in Period',
      colAnswered: 'Answered',
      colPending: 'Pending',
      colBlocked: 'Shielded Complaints',
      colEffectiveness: 'Effectiveness',
      colStatus: 'Status',
      statusAllClear: 'Up to Date',
      statusPendingSuffix: 'Pending',
      sec4Title: 'Executive Report Ready for Presentation or Archiving',
      sec4Subtitle: 'Export consolidated period metrics for business partners or board review.',
      sec4PrintPdf: 'Print / Save as PDF',
      sec4CopySummary: 'Copy Executive Summary',
      sec4CopiedAlert: 'Summary copied to clipboard!',
      chartsSectionTitle: 'Visual Analytics & Reputation Graphic Breakdown',
      ratingsBreakdownTitle: 'Smart Filter: 2 Bifurcations',
      ratingsBreakdownSubtitle: '4★ & 5★ routed to Google Maps • 1★ to 3★ shielded privately',
      ratingsAverageBadge: 'Google Maps',
      volumeFlowTitle: 'Period Feedback Flow & Volume Trend',
      volumeFlowSubtitle: 'Comparative breakdown: Public Google reviews vs Privately shielded complaints',
      legendPublicReviews: 'Public Reviews (Google Maps)',
      legendPrivateComplaints: 'Shielded Private Complaints (QR)',
      effectivenessGaugeTitle: 'Effectiveness & Retention Index',
      effectivenessGaugeSubtitle: 'Resolution rate and customers handled in record time',
      effectivenessGaugeBadge: 'Active Shield',
      exportCsvBtn: 'Export Report to Excel (CSV)',
      dispatchPendingBtn: 'Dispatch with AI',
      printDossierTitle: 'Executive Reputation Shield & Audit Report',
      printDossierSubtitle: 'Official digital reputation and operational management certificate',
      printAuditedBy: 'Audited and certified by Prestigia Platform',
      printOfficialCertificate: 'Confidential document for the exclusive use of General Management and Board of Directors.',
    },
    profile: {
      headerBadge: 'Visual Identity, Socials & Staff',
      headerTitle: 'Brand Identity, Socials & Team Members',
      headerSubtitle: 'Customize your visual identity (logo and colors), configure official social channels per branch, and manage staff members. Master business data and branch creation are managed centrally by Prestigia.',
      saving: 'Saving...',
      savedSuccess: 'Saved Successfully!',
      saveChanges: 'Save Changes',
      syncRealtime: 'All changes to your brand and branches have been synchronized in real time.',
      sec1Title: '1. Company Information & Subscription',
      commercialBadge: 'Commercial',
      clientIdLabel: 'Prestigia Client ID:',
      taxIdLabel: 'Tax Identification Number (NIT / EIN / RFC / VAT / CIF):',
      taxIdPlaceholder: 'e.g., 901.458.723-1 or US-1234567',
      brandNameLabel: 'Brand Commercial Name:',
      brandNamePlaceholder: 'e.g., Prestigia / Saint Lucas Clinic / AutoExpress',
      categoryLabel: 'Business Category:',
      categoryPlaceholder: 'e.g., Health, Beauty, Automotive, Retail, Hospitality, Dining',
      ownerNameLabel: 'General Owner Name:',
      ownerNamePlaceholder: 'e.g., Alex Morgan',
      ownerPhoneLabel: 'Management WhatsApp:',
      ownerPhonePlaceholder: 'e.g., +1 555 123 4567',
      subTitle: 'Subscription & Billing',
      licenseValidityLabel: 'License Validity:',
      licenseValidityVal: 'Active & In Good Standing (Auto-Renewal)',
      planElite: '👑 ELITE PLAN (ENTERPRISE)',
      planPro: '⭐ PRO PLAN (GROWTH)',
      planBasic: 'BASIC PLAN (STARTER)',
      supportAllowanceLabel: 'Technical Support Allowance:',
      supportElite: '4 tickets/mo (Priority VIP)',
      supportPro: '2 tickets/mo',
      supportBasic: '1 ticket/mo',
      billingCycleLabel: 'Billing Cycle:',
      billingCycleVal: 'Monthly Recurring',
      accountStatusLabel: 'Account Status:',
      accountStatusVal: '● Up to Date (Active)',
      managePlanBtn: 'Manage Plan & Billing',
      legalContractBtn: 'B2B Contract & Legal Terms',
      sec2Title: '2. Visual Identity (Look & Feel)',
      designBadge: 'Design',
      logoUrlLabel: 'Official Logo URL:',
      noLogo: 'No Logo',
      logoPlaceholder: 'https://your-domain.com/logo.png',
      logoNote: 'Square format recommended (PNG or JPG).',
      uploadLogoBtn: 'Upload Image',
      removeLogoBtn: 'Remove Logo',
      logoSizeNote: 'Recommended formats: PNG or JPG with transparent background (max 2MB).',
      requestCompanyUpdateBtn: 'Request Official Info Update via Prestigia WhatsApp',
      requestBranchUpdateBtn: 'Request Branch Modification',
      primaryColorLabel: 'Primary Corporate Color:',
      customColorLabel: 'Custom Color:',
      qrThemeLabel: 'Smart QR Card Style:',
      qrThemeDark: 'Obsidian (Dark Modern)',
      qrThemeLight: 'Marble (White / Print Ready)',
      sec3Title: '3. Digital Channels & Social',
      presenceBadge: 'Presence',
      websiteLabel: 'Official Brand Website:',
      managedByPrestigia: 'Managed by Prestigia',
      websiteNote: '🌐 Official domain included and optimized for local SEO. To change domains, contact VIP support.',
      socialLabel: 'Social Networks (Visible on Smart QR):',
      testSocialBtn: 'Test',
      testSocialTooltip: 'Opens this link in a new tab to verify your profile or post.',
      socialNormalizedHint: 'Auto-formatting active: You can type @your_brand or direct link.',
      vipGroupLabel: 'VIP WhatsApp Community Link:',
      vipGroupPlaceholder: 'https://chat.whatsapp.com/your-vip-group or wa.me/...',
      vipGroupNote: '💬 Customers who rate 5 stars will automatically receive an invitation to join this channel.',
      staffMaxLimitAlert: 'You have reached the maximum limit of 30 staff members for this location.',
      branchSecTitle: 'Locations & Staff Management',
      branchQuotaLabel: 'Location Capacity in Elite Plan:',
      requestExtraBranchBtn: 'Request Extra Location',
      activateMultiBranchBtn: 'Activate Multi-Location (Elite)',
      editingPrefix: 'Editing:',
      branchNameLabel: 'Location Name:',
      branchAddressLabel: 'Physical Address:',
      branchAddressPlaceholder: 'e.g., 123 Main Street',
      cityLabel: 'City:',
      cityPlaceholder: 'e.g., New York',
      localityLabel: 'District / Area:',
      localityPlaceholder: 'e.g., Downtown',
      googleReviewLabel: 'Google Maps Review Link (5★ Destination):',
      testLink: 'Test Link',
      googleReviewNote: 'Customers rating 4 or 5 stars on Smart QR are redirected to this exact link.',
      managerPhoneLabel: 'Branch Manager WhatsApp (Alerts):',
      managerPhonePlaceholder: 'e.g., +1 555 987 6543',
      managerPinLabel: 'Branch Access PIN / Password:',
      managerPinPlaceholder: 'Numeric PIN or password',
      staffSectionLabel: 'Team Members / Staff Assigned to this Branch:',
      removeStaffTooltip: 'Remove team member',
      staffInputPlaceholder: 'e.g., Daniel (Customer Care), Dr. Sarah (Specialist), Carlos (Front Desk)...',
      addStaffBtn: 'Add',
      saveAllBtn: 'Save All Profile & Locations Changes',
      savingAll: 'Syncing Changes to Cloud...',
      savedAllSuccess: 'Brand & Locations Settings Saved!',
    },
    modals: {
      billing: {
        tag: 'PRESTIGIA PLANS & BILLING CENTER',
        title: 'Subscription & Billing Management',
        desc: 'You can upgrade your plan, add locations, or request billing support at any time.',
        basicName: 'BASIC PLAN',
        basicPrice: 'Custom Enterprise Rate',
        basicDesc: 'Essential Smart QR filtering without real-time alerts. 1 Single Central Owner Screen.',
        basicF1: '1 Location • 1 Owner Screen Only',
        basicF2: 'Smart QR with 5★ filtering',
        basicF3: '1 technical support ticket/mo',
        basicBtn: 'Quote with Commercial Advisor',
        proName: 'PRO PLAN',
        proPrice: 'Custom Enterprise Rate',
        proDesc: 'For businesses requiring instant customer rescue and AI review replies.',
        proF1: '1 Location • 1 Owner + 2 Branch Screens',
        proF2: 'AI Google Assistant + Real-time Alerts',
        proF3: '2 technical support tickets/mo',
        proBtn: 'Quote with Commercial Advisor',
        eliteName: 'ELITE PLAN',
        eliteBadge: 'Your Current Plan',
        elitePrice: 'Custom Enterprise Rate',
        eliteDesc: 'Full Multi-Location power, VIP Giveaways & Automated campaigns plus AI WhatsApp Rescue.',
        eliteF1: 'Up to 3 Locations (1 Owner + 2 per Branch + TV)',
        eliteF2: 'Roulette Giveaway Campaigns',
        eliteF3: 'AI WhatsApp Customer Rescue',
        eliteF4: '4 VIP support tickets/mo',
        eliteActive: '👑 Active Plan',
        gatewayTitle: 'Certified Payment Gateway (Card, Transfer & Secure Checkout)',
        gatewayDesc: 'Electronic invoice issued directly to your registered tax email.',
        contactBtn: 'Contact Prestigia Billing',
      },
      extraBranch: {
        title: '3-Location Limit Reached',
        desc: 'Your Elite Plan subscription includes up to 3 physical locations integrated in your base package.',
        rateLabel: 'Add-on Location Rate:',
        rateValue: '+$99,000 COP / mo ($29 USD / mo)',
        details: 'Each additional location includes dedicated Smart QR routing, 2 active branch counter screens, independent Google Maps tracking, staff roles, and priority support.',
        backBtn: 'Back',
        requestWaBtn: 'Request via WhatsApp',
      },
      newBranch: {
        title: 'Add New Branch Location',
        desc: 'Enter the physical details of your new branch.',
        nameLabel: 'Location Name:',
        cityLabel: 'City:',
        localityLabel: 'District / Area:',
        addressLabel: 'Physical Address:',
        phoneLabel: 'Manager WhatsApp:',
        pinLabel: 'Branch Access PIN:',
        cancelBtn: 'Cancel',
        createBtn: 'Create Location',
      },
      aiRescue: {
        badge: '✨ AI CUSTOMER RESCUE • ELITE PLAN',
        title: '3 Hyper-Personalized Retention Strategies',
        desc: 'Select the compensation or apology strategy best suited for this case. It will be sent directly to the customer WhatsApp and marked as resolved.',
        clientInfo: 'Customer Information:',
        complaintLabel: 'Grievance / Feedback:',
        draftLabel: 'AI Recovery Message Draft:',
        generating: 'Generating AI proposal...',
        regenerate: 'Regenerate another with AI',
        sendWa: 'Open Chat & Send via WhatsApp',
        copy: 'Copy',
        copied: 'Copied!',
        close: 'Close',
        staffAttended: 'Staff member who attended:',
        loading: 'Analyzing complaint reason and drafting 3 AI retention strategies...',
        sendWaAndResolve: 'Send via WhatsApp & Mark Resolved',
      },
      customerDatabase: {
        badge: '📁 OFFICIAL CUSTOMER DATABASE & DATA PRIVACY',
        planElite: 'Total Multi-Location',
        planPro: 'Single Location (Pro Plan)',
        title: 'Registered Customers & Retention Consent',
        desc: 'Contacts captured via Smart QR with full legal consent and data privacy authorization.',
        exportBtn: 'Download Full CSV',
        habeasDataNotice: 'Fully compliant with GDPR and Data Privacy Law.',
        totalRegistered: 'Total Registered:',
        contactsCount: 'contacts',
        downloadCsv: 'Download Full Database (CSV)',
        emptyList: 'No contacts registered at this location yet.',
        habeasDataAccepted: 'Data Privacy Accepted',
        writeWaTitle: 'Message customer on WhatsApp',
        close: 'Close',
      },
      upsell: {
        badge: '👑 PRESTIGIA POWER TIERS',
        title: 'Scale Your Brand Reputation, Operations & Revenue',
        desc: 'Choose the ideal plan for your commercial operations. You can switch plans at any time.',
        basicName: 'BASIC (1 LOCATION)',
        basicLocation: '1 Location • 1 Owner Screen Only',
        basicPrice: 'Custom Enterprise Rate',
        basicPriceUsd: 'Subject to official quote based on branches and volume',
        basicCurrentPlan: 'Your Current Plan',
        basicSelectBtn: 'Quote Basic Plan',
        basicF1: 'Smart QR filter for 1 to 3★ reviews',
        basicF2: 'Basic Google Maps radar',
        basicF3: '1 Central Owner Screen (No counter/branch screens)',
        basicF4: '1 technical support ticket / month (hours/data)',
        basicF5: 'No Live Alerts (manual review)',
        basicF6: 'No Daily or Weekly Reports',
        basicF7: 'No Customer Data Export (CSV)',
        basicF8: 'No AI Google Assistant or Giveaways',
        proName: 'PRO (1 LOCATION)',
        proLocation: '1 Location • 1 Owner + 2 Branch',
        proPrice: 'Custom Enterprise Rate',
        proPriceUsd: 'Subject to official quote based on branches and volume',
        proCurrentPlan: 'Your Current Plan',
        proActivateBtn: 'Quote Pro Plan',
        proF1: 'Everything in Basic',
        proF2: '1 Owner Screen + 2 Counter/Branch Screens',
        proF3: 'AI Google Assistant (Anti-Spam)',
        proF4: 'Live Audio & Push Alerts (Floor & Mobile)',
        proF5: 'Live Daily & Weekly Reports',
        proF6: 'Official Monthly Raffle (1 Winner)',
        proF7: 'Customer Data Export (1 Location + CSV)',
        proF8: '2 technical support tickets / month',
        eliteName: 'ELITE TOTAL',
        eliteBadge: 'RECOMMENDED FOR BRANDS',
        eliteLocation: 'Up to 3 Locations • Multi-Device',
        elitePrice: 'Custom Enterprise Rate',
        elitePriceUsd: 'Subject to official quote based on branches and volume',
        eliteCurrentPlan: '👑 Your Current Plan (Elite)',
        eliteUnlockBtn: 'Quote Elite Plan',
        eliteF1: 'Up to 3 Locations (1 Owner + 2 per Branch)',
        eliteF2: 'Live TV Wallboard Screen for Operations / Reception Area',
        eliteF3: 'AI WhatsApp Customer Rescue (3 tactics)',
        eliteF4: 'Multi-Winner Raffles (1 to 10+) per Branch or Global',
        eliteF5: 'Live Omnichannel Alerts (Floor & Mobile)',
        eliteF6: 'All Reports (Daily, Weekly, Monthly, Annual & ROI)',
        eliteF7: 'Full Multi-Location Customer Export (CSV)',
        eliteF8: '4 VIP priority support tickets / month',
        supportFooterNote: 'Monthly support tickets apply to service, pricing, catalog updates and platform inquiries. No long-term lock-in.',
      },
      giveawayWinner: {
        badge: 'WE HAVE AN OFFICIAL WINNER! • ELITE PLAN',
        badgePlural: '🏆 {count} OFFICIAL WINNERS SELECTED! • ELITE PLAN',
        title: 'Satisfaction Raffle Result',
        titlePlural: 'Monthly Lucky Winners Raffle',
        subtitle: 'The system randomly selected a verified customer from your participant database.',
        subtitlePlural: 'The system randomly selected {count} verified customers from your participant database.',
        registeredBranch: 'Registered Location:',
        prizeAssigned: '🎁 Assigned Prize:',
        winnerTab: 'Winner',
        winnerCardTitle: 'Selected Winner',
        waLabel: 'Official WhatsApp Notification (Review & edit before sending):',
        waEditableBadge: '100% Editable',
        copied: 'Copied!',
        copyBtn: 'Copy Text',
        closeBtn: 'Close',
        sendWaBtn: '📲 Send Official WhatsApp to Winner',
        sentBadge: 'WhatsApp Sent',
      },
    },
    systemModal: {
      title: 'Prestigia Enterprise Core',
      ltsBadge: 'v2.4 LTS',
      subtitle: 'High-Availability Cloud Infrastructure & Reputation Shield',
      globalStatus: 'Global Status',
      operational: 'Operational',
      uptime: '99.9% Uptime SLA',
      latency: 'Cloud Latency',
      encryption: 'Data Encryption',
      bankingGrade: 'Banking Grade',
      license: 'Enterprise License:',
      plan: 'Active Plan Tier:',
      authorizedBranches: 'Enabled Locations:',
      vipSupport: 'Guaranteed VIP Support:',
      activeModules: 'Active Shield Modules',
      filterGoogle: 'Google Maps Anti-Bad Review Filter',
      habeasData: 'Data Privacy & GDPR Compliant',
      rescueAi: '24/7 AI Customer Rescue Engine',
      smartQrRouter: 'Dynamic Smart QR Router',
      build: 'Build: 2026.09.22-Enterprise',
      viewLegal: 'View Contracts & Legal Terms',
      close: 'Close System Info',
    },
    common: {
      loading: 'Loading...',
      save: 'Save Changes',
      cancel: 'Cancel',
      saved: 'Saved successfully!',
      confirm: 'Confirm',
      back: 'Back',
      print: 'Print / PDF',
    },
  },
};
