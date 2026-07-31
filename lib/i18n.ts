export const locales = ["fr", "it", "en", "es", "ru", "zh"] as const;
import { supplementalMessages } from "./i18n-supplement";
import { publicMessages } from "./i18n-public";
import { generatedMessages } from "./i18n-generated";
import { reviewedMessages } from "./i18n-reviewed";
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, { short: string; native: string }> = {
  fr: { short: "FR", native: "Français" },
  it: { short: "IT", native: "Italiano" },
  en: { short: "EN", native: "English" },
  es: { short: "ES", native: "Español" },
  ru: { short: "RU", native: "Русский" },
  zh: { short: "中文", native: "简体中文" },
};

type Localized = Record<Exclude<Locale, "fr">, string>;
const t = (it: string, en: string, es: string, ru: string, zh: string): Localized => ({ it, en, es, ru, zh });

/*
 * These are transcreations, not literal translations. Short calls to action,
 * trust language and luxury vocabulary are adapted to the conventions of each
 * audience while preserving the same AUREVIA promise.
 */
export const messages: Record<string, Localized> = {
  "Services": t("Servizi", "Services", "Servicios", "Услуги", "服务"),
  "Propriétés": t("Proprietà", "Properties", "Propiedades", "Объекты", "精选房源"),
  "Expériences": t("Esperienze", "Experiences", "Experiencias", "Впечатления", "礼遇体验"),
  "À propos": t("La nostra storia", "Our story", "Nuestra historia", "О нас", "关于我们"),
  "Simulateur": t("Simulatore", "Revenue estimator", "Simulador", "Калькулятор", "收益测算"),
  "Contact": t("Contatti", "Contact", "Contacto", "Связаться", "联系我们"),
  "Connexion": t("Accesso", "Sign in", "Acceso", "Войти", "登录"),
  "Connexion administrateur": t("Accesso amministratore", "Administrator sign-in", "Acceso de administración", "Вход администратора", "管理员登录"),
  "Évaluer mon bien": t("Valuta il mio immobile", "Assess my property", "Valorar mi propiedad", "Оценить объект", "评估我的房产"),
  "Confier ma propriété": t("Affidaci il tuo immobile", "Entrust your property", "Confiar mi propiedad", "Доверить объект", "委托我的房产"),
  "Découvrir nos services": t("Scopri i nostri servizi", "Explore our services", "Descubrir nuestros servicios", "Наши услуги", "探索我们的服务"),
  "Découvrir le service": t("Scopri il servizio", "Explore the service", "Descubrir el servicio", "Подробнее", "了解服务"),
  "Découvrir la prestation": t("Scopri come lo organizziamo", "See how we arrange it", "Ver cómo lo organizamos", "Как мы это организуем", "了解如何安排"),
  "Demander une évaluation": t("Richiedi una valutazione", "Request an assessment", "Solicitar una valoración", "Запросить оценку", "申请评估"),
  "Demander une évaluation privée": t("Richiedi una valutazione riservata", "Request a private assessment", "Solicitar una valoración privada", "Запросить конфиденциальную оценку", "申请专属评估"),
  "Évaluation confidentielle, gratuite et sans engagement.": t("Valutazione riservata, gratuita e senza impegno.", "Private, complimentary and without obligation.", "Valoración confidencial, gratuita y sin compromiso.", "Конфиденциальная бесплатная оценка без обязательств.", "全程保密、免费且无任何承诺。"),
  "L’art de prendre soin": t("L’arte di prendersi cura", "The art of caring for", "El arte de cuidar", "Искусство заботиться", "悉心守护"),
  "de ce qui compte.": t("di ciò che conta.", "what matters.", "lo que de verdad importa.", "о самом важном.", "真正重要的一切。"),
  "Une présence locale": t("Una presenza locale", "A trusted local presence", "Una presencia local", "Надёжное присутствие рядом", "值得信赖的本地守护"),
  "Une exigence sans compromis": t("Un’esigenza senza compromessi", "Uncompromising standards", "Una exigencia sin concesiones", "Бескомпромиссные стандарты", "始终如一的卓越标准"),
  "Gestion et valorisation de propriétés d’exception.": t("Gestione e valorizzazione di proprietà d’eccezione.", "Management and stewardship of exceptional homes.", "Gestión y puesta en valor de propiedades excepcionales.", "Управление и сохранение ценности исключительных объектов.", "为卓越宅邸提供管理与价值守护。"),
  "Explorer": t("Esplora", "Explore", "Descubrir", "Разделы", "探索"),
  "Propriétaires": t("Proprietari", "Owners", "Propietarios", "Владельцам", "业主"),
  "Gestion AUREVIA": t("Gestione AUREVIA", "AUREVIA management", "Gestión AUREVIA", "Управление AUREVIA", "AUREVIA 管理"),
  "Évaluation privée": t("Valutazione riservata", "Private assessment", "Valoración privada", "Конфиденциальная оценка", "专属评估"),
  "Questions fréquentes": t("Domande frequenti", "Frequently asked questions", "Preguntas frecuentes", "Частые вопросы", "常见问题"),
  "Contact privé": t("Contatto riservato", "Private enquiries", "Contacto privado", "Конфиденциальная связь", "专属咨询"),
  "Gênes, Italie": t("Genova, Italia", "Genoa, Italy", "Génova, Italia", "Генуя, Италия", "意大利·热那亚"),
  "Chaque demande est étudiée personnellement et traitée avec la plus grande discrétion.": t("Ogni richiesta viene esaminata personalmente, con assoluta discrezione.", "Every enquiry is reviewed personally and handled in complete confidence.", "Cada solicitud se estudia personalmente y con absoluta discreción.", "Каждое обращение рассматривается лично и строго конфиденциально.", "每一份咨询均由专人审阅，并以最高标准保密处理。"),
  "Confidentialité": t("Privacy", "Privacy", "Privacidad", "Конфиденциальность", "隐私"),
  "Conditions": t("Condizioni", "Terms", "Condiciones", "Условия", "条款"),
  "Votre confidentialité, sans compromis": t("La tua privacy, senza compromessi", "Your privacy, without compromise", "Su privacidad, sin concesiones", "Ваша конфиденциальность — без компромиссов", "您的隐私，绝不妥协"),
  "Le site utilise uniquement les éléments essentiels à son fonctionnement. Aucun cookie publicitaire n’est déposé sans votre accord.": t("Utilizziamo soltanto gli elementi essenziali al funzionamento del sito. Nessun cookie pubblicitario viene installato senza il tuo consenso.", "We use only what is essential for the site to function. No advertising cookies are placed without your consent.", "Utilizamos únicamente lo esencial para el funcionamiento del sitio. No instalamos cookies publicitarias sin su consentimiento.", "Мы используем только необходимые файлы cookie. Рекламные cookie не устанавливаются без вашего согласия.", "本网站仅使用保障正常运行所必需的 Cookie，未经同意不会设置广告 Cookie。"),
  "Consulter notre politique de confidentialité": t("Consulta la nostra informativa sulla privacy", "Read our privacy policy", "Consultar nuestra política de privacidad", "Политика конфиденциальности", "查看隐私政策"),
  "Accepter": t("Accetta", "Accept", "Aceptar", "Принять", "接受"),
  "Continuer sans accepter": t("Continua senza accettare", "Continue without accepting", "Continuar sin aceptar", "Продолжить без согласия", "拒绝并继续"),

  "Discrétion absolue": t("Discrezione assoluta", "Absolute discretion", "Discreción absoluta", "Абсолютная конфиденциальность", "绝对私密"),
  "Gestion complète": t("Gestione completa", "Complete management", "Gestión integral", "Полное управление", "全程管理"),
  "Valeur optimisée": t("Valore ottimizzato", "Optimised value", "Valor optimizado", "Рост ценности", "价值优化"),
  "Hospitalité d’excellence": t("Ospitalità d’eccellenza", "Exceptional hospitality", "Hospitalidad excelente", "Безупречное гостеприимство", "卓越款待"),
  "Accompagnement dédié": t("Assistenza dedicata", "Dedicated stewardship", "Atención dedicada", "Персональное сопровождение", "专属陪伴"),
  "Un interlocuteur unique": t("Un unico referente", "One dedicated point of contact", "Un único interlocutor", "Единый персональный контакт", "专属对接人"),
  "Une présence locale à Gênes": t("Presenza locale a Genova", "A local presence in Genoa", "Presencia local en Génova", "Местное присутствие в Генуе", "扎根热那亚"),
  "Tarification dynamique": t("Tariffe dinamiche", "Dynamic pricing", "Tarificación dinámica", "Динамическое ценообразование", "动态定价"),
  "Prestataires coordonnés": t("Fornitori coordinati", "Trusted partners, coordinated", "Proveedores coordinados", "Координация подрядчиков", "服务商统一协调"),
  "Suivi propriétaire clair": t("Report chiari per il proprietario", "Clear owner reporting", "Seguimiento claro para el propietario", "Прозрачная отчётность для владельца", "清晰的业主报告"),
  "Votre bien préservé": t("Il tuo immobile, sempre tutelato", "Your home, carefully preserved", "Su propiedad, siempre cuidada", "Бережная забота о вашей собственности", "悉心守护您的房产"),
  "Pour les propriétaires": t("Per i proprietari", "For property owners", "Para propietarios", "Владельцам", "致业主"),
  "Un partenaire de confiance pour votre propriété": t("Un referente di fiducia per il tuo immobile", "A trusted steward for your home", "Un aliado de confianza para su propiedad", "Надёжный партнёр для вашего дома", "值得托付的宅邸管家"),
  "AUREVIA accompagne les propriétaires exigeants qui souhaitent valoriser leur bien sans en gérer les contraintes quotidiennes.": t("AUREVIA affianca proprietari esigenti che desiderano valorizzare il proprio immobile senza portarne il peso quotidiano.", "AUREVIA gives discerning owners the confidence to enhance their property without carrying its daily demands.", "AUREVIA acompaña a propietarios exigentes que desean valorizar su bien sin asumir la carga diaria.", "AUREVIA помогает взыскательным владельцам раскрыть потенциал объекта, не погружаясь в повседневные заботы.", "AUREVIA 帮助重视品质的业主提升房产价值，同时卸下日常管理的繁琐。"),
  "Une relation privilégiée": t("Un rapporto privilegiato", "One privileged relationship", "Una relación privilegiada", "Особые доверительные отношения", "专属信任关系"),
  "Une prise en charge intégrale": t("Una gestione completa", "Complete stewardship", "Una gestión integral", "Полная ответственность", "全方位托管"),
  "Des standards d’exception": t("Standard d’eccezione", "Exceptional standards", "Estándares excepcionales", "Исключительные стандарты", "卓越标准"),
  "Une gestion sur mesure": t("Una gestione su misura", "Management shaped around you", "Una gestión a medida", "Индивидуальное управление", "量身定制"),
  "Découvrir l’approche AUREVIA": t("Scopri l’approccio AUREVIA", "Discover the AUREVIA approach", "Descubrir el enfoque AUREVIA", "Подход AUREVIA", "了解 AUREVIA 方式"),
  "L’excellence dans chaque détail": t("L’eccellenza in ogni dettaglio", "Excellence, down to the last detail", "Excelencia en cada detalle", "Совершенство в каждой детали", "卓越，尽在细节"),
  "Simulateur privé": t("Simulatore riservato", "Private estimator", "Simulador privado", "Персональный расчёт", "专属收益测算"),
  "Découvrez le potentiel de votre propriété": t("Scopri il potenziale del tuo immobile", "Discover your property’s potential", "Descubra el potencial de su propiedad", "Раскройте потенциал вашего объекта", "发现房产潜力"),
  "Obtenez une première projection selon la localisation, le standing, les équipements et la période de disponibilité.": t("Ottieni una prima proiezione basata su posizione, livello, dotazioni e disponibilità.", "Receive an initial projection shaped by location, finish, amenities and availability.", "Obtenga una primera proyección según ubicación, categoría, equipamiento y disponibilidad.", "Получите первичный прогноз с учётом локации, уровня объекта, оснащения и доступности.", "根据地段、品质、设施及可出租时间，获得初步收益测算。"),
  "Essayer le simulateur": t("Prova il simulatore", "Try the estimator", "Probar el simulador", "Рассчитать потенциал", "开始测算"),
  "Projection AUREVIA": t("Proiezione AUREVIA", "AUREVIA projection", "Proyección AUREVIA", "Прогноз AUREVIA", "AUREVIA 收益预测"),
  "Situation estimée avant gestion": t("Stima prima della gestione", "Estimated before management", "Estimación antes de la gestión", "Оценка до управления", "托管前预估"),
  "Potentiel optimisé": t("Potenziale ottimizzato", "Optimised potential", "Potencial optimizado", "Потенциал с AUREVIA", "优化后潜力"),
  "Progression indicative": t("Crescita indicativa", "Indicative uplift", "Mejora indicativa", "Ориентировочный рост", "预期提升"),
  "Occupation projetée": t("Occupazione prevista", "Projected occupancy", "Ocupación prevista", "Прогноз загрузки", "预计入住率"),
  "L’expérience propriétaire": t("L’esperienza del proprietario", "The owner experience", "La experiencia del propietario", "Опыт владельца", "业主体验"),
  "Vous partez.": t("Tu parti.", "You leave.", "Usted se marcha.", "Вы уезжаете.", "您从容离开。"),
  "Elle reste entre de bonnes mains.": t("Il tuo immobile resta in buone mani.", "Your home remains in trusted hands.", "Su propiedad queda en buenas manos.", "Ваш дом остаётся в надёжных руках.", "您的家，始终有人悉心守护。"),
  "Le calme de ne plus avoir à y penser.": t("La serenità di non doverci più pensare.", "The freedom of no longer having to think about it.", "La tranquilidad de no tener que pensar en ello.", "Спокойствие, когда больше не нужно обо всём думать.", "无需时时牵挂的安心。"),
  "Les décisions importantes. Rien de plus.": t("Solo le decisioni che contano.", "Only the decisions that truly matter.", "Solo las decisiones importantes.", "Только действительно важные решения.", "您只需专注真正重要的决定。"),
  "Propriétés sélectionnées": t("Proprietà selezionate", "Selected properties", "Propiedades seleccionadas", "Избранные объекты", "精选房源"),
  "Notre méthode": t("Il nostro metodo", "Our method", "Nuestro método", "Наш подход", "我们的方法"),
  "Votre propriété, orchestrée": t("Il tuo immobile, orchestrato", "Your property, expertly orchestrated", "Su propiedad, perfectamente coordinada", "Ваш объект — под точным управлением", "您的房产，井然有序"),
  "avec précision à chaque étape": t("con precisione in ogni fase", "with precision at every stage", "con precisión en cada etapa", "на каждом этапе", "每一步都精准到位"),
  "La confiance, racontée": t("La fiducia, raccontata", "Trust, in their words", "La confianza, contada", "Доверие словами владельцев", "业主的信任"),
  "Une présence discrète et constante": t("Una presenza discreta e costante", "A discreet, constant presence", "Una presencia discreta y constante", "Незаметное, постоянное присутствие", "低调而始终如一的守护"),
  "Votre propriété mérite": t("Il tuo immobile merita", "Your property deserves", "Su propiedad merece", "Ваш объект достоин", "您的房产值得"),
  "une gestion à sa hauteur": t("una gestione all’altezza", "management of equal distinction", "una gestión a su altura", "управления соответствующего уровня", "与之匹配的卓越管理"),

  "Gestion de propriété": t("Gestione della proprietà", "Property management", "Gestión de la propiedad", "Управление объектом", "房产管理"),
  "Gestion intégrale du bien": t("Gestione integrale del bene", "Complete property stewardship", "Gestión integral del bien", "Комплексное управление", "全方位房产托管"),
  "Assistance sur mesure": t("Assistenza su misura", "Bespoke assistance", "Asistencia a medida", "Персональный сервис", "专属礼宾服务"),
  "Conciergerie personnalisée": t("Concierge personalizzata", "Bespoke concierge", "Conserjería personalizada", "Персональный консьерж", "定制礼宾"),
  "Accueil des voyageurs": t("Accoglienza degli ospiti", "Guest welcome", "Recepción de huéspedes", "Приём гостей", "宾客接待"),
  "Ménage et linge": t("Pulizia e biancheria", "Housekeeping and linen", "Limpieza y ropa de hogar", "Уборка и бельё", "清洁与布草"),
  "Entretien & linge": t("Cura e biancheria", "Care and linen", "Cuidado y ropa de hogar", "Уход и бельё", "养护与布草"),
  "Maintenance": t("Manutenzione", "Maintenance", "Mantenimiento", "Техническое обслуживание", "维护保养"),
  "Optimisation des revenus": t("Ottimizzazione dei ricavi", "Revenue optimisation", "Optimización de ingresos", "Оптимизация дохода", "收益优化"),
  "Performance locative": t("Performance locativa", "Rental performance", "Rendimiento del alquiler", "Доходность аренды", "出租表现"),
  "Sécurité": t("Sicurezza", "Security", "Seguridad", "Безопасность", "安全保障"),
  "Administration": t("Amministrazione", "Administration", "Administración", "Администрирование", "行政管理"),
  "Suivi administratif": t("Gestione amministrativa", "Administrative oversight", "Seguimiento administrativo", "Административное сопровождение", "行政跟进"),
  "Un service complet, conçu sur mesure": t("Un servizio completo, disegnato su misura", "Complete management, shaped around you", "Un servicio integral, diseñado a medida", "Полный сервис, созданный под вас", "全方位服务，为您量身定制"),
  "Nos solutions de gestion": t("Le nostre soluzioni di gestione", "Our management solutions", "Nuestras soluciones de gestión", "Наши решения", "管理方案"),
  "Deux cadres, une même exigence": t("Due formule, la stessa esigenza", "Two solutions. One exacting standard.", "Dos fórmulas, una misma exigencia", "Два формата. Один стандарт.", "两种方案，同一卓越标准"),
  "Gestion Sérénité": t("Gestione Serenità", "Serenity Management", "Gestión Serenidad", "Управление «Спокойствие»", "安心托管"),
  "Solution Privilège": t("Soluzione Privilegio", "Privilege Solution", "Solución Privilegio", "Решение «Привилегия»", "尊享方案"),
  "Sur devis": t("Su preventivo", "By proposal", "A medida", "По индивидуальному предложению", "专属报价"),
  "Choisir la solution Sérénité": t("Scegli Gestione Serenità", "Choose Serenity Management", "Elegir Gestión Serenidad", "Выбрать «Спокойствие»", "选择安心托管"),
  "Recevoir mon devis": t("Richiedi una proposta", "Request a proposal", "Solicitar una propuesta", "Получить предложение", "获取专属方案"),

  "Des moments exclusifs, organisés sur mesure": t("Momenti esclusivi, organizzati su misura", "Exceptional experiences, arranged around you", "Momentos exclusivos, organizados a medida", "Исключительные впечатления — по вашему сценарию", "专属体验，悉心定制"),
  "Le meilleur de la Ligurie, orchestré avec soin et discrétion.": t("Il meglio della Liguria, organizzato con cura e discrezione.", "The finest of Liguria, arranged with care and discretion.", "Lo mejor de Liguria, organizado con cuidado y discreción.", "Лучшее в Лигурии — с безупречной организацией и деликатностью.", "精心呈现利古里亚的非凡体验。"),
  "SUR DEMANDE": t("SU RICHIESTA", "BY REQUEST", "BAJO PETICIÓN", "ПО ЗАПРОСУ", "按需定制"),
  "Yacht privé": t("Yacht privato", "Private yacht", "Yate privado", "Частная яхта", "私人游艇"),
  "Jet privé": t("Jet privato", "Private aviation", "Jet privado", "Частная авиация", "私人航空"),
  "Chef privé": t("Chef privato", "Private chef", "Chef privado", "Личный шеф-повар", "私人主厨"),
  "Transfert privé": t("Transfer privato", "Private transfer", "Traslado privado", "Индивидуальный трансфер", "私人接送"),
  "Expériences locales": t("Esperienze locali", "Local experiences", "Experiencias locales", "Местные впечатления", "本地体验"),
  "Bien-être": t("Benessere", "Wellbeing", "Bienestar", "Велнес", "身心康养"),
  "Événements privés": t("Eventi privati", "Private events", "Eventos privados", "Частные события", "私人活动"),

  "Parlons de votre propriété": t("Parliamo del tuo immobile", "Let’s discuss your property", "Hablemos de su propiedad", "Обсудим ваш объект", "让我们聊聊您的房产"),
  "Premier échange": t("Primo incontro", "A first conversation", "Primera conversación", "Первый разговор", "初次沟通"),
  "Une réponse claire,": t("Una risposta chiara,", "A clear,", "Una respuesta clara,", "Ясный,", "清晰、"),
  "confidentielle": t("riservata", "confidential", "confidencial", "конфиденциальный", "私密且"),
  "et personnalisée": t("e personalizzata", "and personal response", "y personalizada", "и персональный ответ", "为您定制的答复"),
  "Coordonnées directes": t("Contatto diretto", "Direct contact", "Contacto directo", "Прямая связь", "直接联系"),
  "E-mail confidentiel": t("E-mail riservata", "Confidential e-mail", "Correo confidencial", "Конфиденциальная почта", "保密邮箱"),
  "Zone d’intervention": t("Area operativa", "Area covered", "Zona de intervención", "Зона работы", "服务区域"),
  "Gênes et Riviera ligure": t("Genova e Riviera ligure", "Genoa and the Ligurian Riviera", "Génova y la Riviera ligur", "Генуя и Лигурийская Ривьера", "热那亚及利古里亚海岸"),
  "Engagement de réponse": t("Tempi di risposta", "Response commitment", "Compromiso de respuesta", "Срок ответа", "响应承诺"),
  "Sous 1 jour ouvré": t("Entro 1 giorno lavorativo", "Within one working day", "En un día laborable", "В течение одного рабочего дня", "一个工作日内"),
  "Votre demande": t("La tua richiesta", "Your enquiry", "Su solicitud", "Ваш запрос", "您的需求"),
  "Prénom": t("Nome", "First name", "Nombre", "Имя", "名字"),
  "Nom": t("Cognome", "Last name", "Apellidos", "Фамилия", "姓氏"),
  "E-mail": t("E-mail", "E-mail", "Correo electrónico", "Электронная почта", "电子邮箱"),
  "Vous êtes": t("Profilo", "You are", "Usted es", "Вы", "您的身份"),
  "Objet de la demande": t("Oggetto della richiesta", "Enquiry type", "Motivo de la consulta", "Тема обращения", "咨询事项"),
  "Localisation du bien": t("Località dell’immobile", "Property location", "Ubicación del inmueble", "Местоположение объекта", "房产位置"),
  "Type de bien": t("Tipologia", "Property type", "Tipo de propiedad", "Тип объекта", "房产类型"),
  "Nombre de biens": t("Numero di immobili", "Number of properties", "Número de propiedades", "Количество объектов", "房产数量"),
  "Délai souhaité": t("Tempistica desiderata", "Preferred timing", "Plazo deseado", "Желаемые сроки", "期望时间"),
  "Décrivez votre besoin": t("Descrivi la tua esigenza", "Tell us what you need", "Describa su necesidad", "Расскажите о задаче", "请描述您的需求"),
  "Envoyer le message": t("Invia il messaggio", "Send enquiry", "Enviar mensaje", "Отправить", "提交咨询"),
  "Vos coordonnées": t("I tuoi recapiti", "Your details", "Sus datos", "Ваши данные", "您的信息"),
  "La propriété": t("L’immobile", "The property", "La propiedad", "Объект", "房产信息"),
  "Votre projet": t("Il tuo progetto", "Your plans", "Su proyecto", "Ваш проект", "您的计划"),
  "Continuer": t("Continua", "Continue", "Continuar", "Продолжить", "继续"),
  "Retour": t("Indietro", "Back", "Volver", "Назад", "返回"),
  "Envoyer la demande confidentielle": t("Invia la richiesta riservata", "Send private enquiry", "Enviar solicitud confidencial", "Отправить конфиденциальный запрос", "提交保密申请"),

  "Notre raison d’être": t("La nostra ragione d’essere", "Our purpose", "Nuestra razón de ser", "Наша миссия", "我们的初心"),
  "Prendre soin de ce qui compte.": t("Prendersi cura di ciò che conta.", "Caring for what matters.", "Cuidar lo que importa.", "Заботиться о самом важном.", "守护真正重要的一切。"),
  "L’histoire AUREVIA": t("La storia AUREVIA", "The AUREVIA story", "La historia de AUREVIA", "История AUREVIA", "AUREVIA 的故事"),
  "Tout commence lorsque vous fermez la porte.": t("Tutto comincia quando chiudi la porta.", "It begins when you close the door.", "Todo comienza cuando cierra la puerta.", "Всё начинается, когда вы закрываете дверь.", "一切，从您关上门的那一刻开始。"),
  "Un territoire vivant": t("Un territorio vivo", "A living territory", "Un territorio vivo", "Живая территория", "一方鲜活的土地"),
  "Gênes ne se visite pas. Elle se révèle.": t("Genova non si visita. Si rivela.", "Genoa is not simply visited. It reveals itself.", "Génova no se visita. Se descubre.", "Геную не просто посещают — её открывают.", "热那亚，不止于到访，更待细细发现。"),
  "Notre promesse": t("La nostra promessa", "Our promise", "Nuestra promesa", "Наше обещание", "我们的承诺"),
  "Rendre l’excellence presque invisible.": t("Rendere l’eccellenza quasi invisibile.", "Making excellence feel effortless.", "Hacer que la excelencia parezca invisible.", "Совершенство, которое не требует внимания.", "让卓越自然发生。"),
  "La confiance ne se proclame pas. Elle se vit.": t("La fiducia non si proclama. Si vive.", "Trust is not declared. It is experienced.", "La confianza no se proclama. Se vive.", "Доверие не заявляют — его ощущают.", "信任无需宣告，而在每一次体验中发生。"),

  "Moins de contraintes. Plus de maîtrise.": t("Meno vincoli. Più controllo.", "Less burden. Greater control.", "Menos carga. Más control.", "Меньше забот. Больше контроля.", "少些负担，多些掌控。"),
  "Ce qui change pour vous": t("Cosa cambia per te", "What changes for you", "Lo que cambia para usted", "Что изменится для вас", "为您带来的改变"),
  "Votre propriété ne dicte plus votre quotidien.": t("Il tuo immobile non detta più le tue giornate.", "Your property no longer dictates your day.", "Su propiedad deja de dictar su día a día.", "Объект больше не управляет вашим временем.", "您的生活，不再被房产事务牵着走。"),
  "Avec AUREVIA": t("Con AUREVIA", "With AUREVIA", "Con AUREVIA", "С AUREVIA", "选择 AUREVIA"),
  "Lorsque vous gérez seul": t("Quando gestisci da solo", "When you manage alone", "Cuando gestiona solo", "При самостоятельном управлении", "自行管理时"),
};

export function translate(source: string, locale: Locale) {
  if (locale === "fr") return source;
  const normalized = source
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([:;?!])/g, "$1")
    .trim();
  const direct = reviewedMessages[source] ?? publicMessages[source] ?? supplementalMessages[source] ?? messages[source] ?? generatedMessages[source];
  if (direct) return direct[locale];
  const normalizedEntry = Object.entries({ ...generatedMessages, ...messages, ...supplementalMessages, ...publicMessages, ...reviewedMessages })
    .find(([key]) => key.replace(/\u00a0/g, " ").replace(/\s+/g, " ").replace(/\s+([:;?!])/g, "$1").trim() === normalized);
  return normalizedEntry?.[1][locale] ?? source;
}
