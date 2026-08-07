/* =========================================================
   Salli Ala Almustafa ﷺ
   Privacy Policy Website
   Language Controller
   ========================================================= */

(function () {
    "use strict";

    /* =======================================================
       Supported languages
       ======================================================= */

    const SUPPORTED_LANGUAGES = {
        ar: {
            file: "ar.html",
            direction: "rtl"
        },

        en: {
            file: "en.html",
            direction: "ltr"
        },

        id: {
            file: "id.html",
            direction: "ltr"
        },

        ru: {
            file: "ru.html",
            direction: "ltr"
        },

        fr: {
            file: "fr.html",
            direction: "ltr"
        },

        ur: {
            file: "ur.html",
            direction: "rtl"
        },

        tr: {
            file: "tr.html",
            direction: "ltr"
        },

        zh: {
            file: "zh.html",
            direction: "ltr"
        },

        uk: {
            file: "uk.html",
            direction: "ltr"
        },

        sw: {
            file: "sw.html",
            direction: "ltr"
        },

        es: {
            file: "es.html",
            direction: "ltr"
        },

        bn: {
            file: "bn.html",
            direction: "ltr"
        },

        so: {
            file: "so.html",
            direction: "ltr"
        },

        fil: {
            file: "fil.html",
            direction: "ltr"
        },

        ku: {
            file: "ku.html",
            direction: "rtl"
        }
    };

    const DEFAULT_LANGUAGE = "ar";

    const STORAGE_KEY = "salliAlmustafaPrivacyLanguage";


    /* =======================================================
       Normalize browser language
       ======================================================= */

    function normalizeLanguage(language) {
        if (!language) {
            return null;
        }

        language = language.toLowerCase().trim();

        /*
         * Examples:
         *
         * ar-SA  -> ar
         * en-US  -> en
         * fr-FR  -> fr
         * zh-CN  -> zh
         * pt-BR  -> unsupported
         */

        if (SUPPORTED_LANGUAGES[language]) {
            return language;
        }

        const baseLanguage = language.split("-")[0];

        if (SUPPORTED_LANGUAGES[baseLanguage]) {
            return baseLanguage;
        }

        return null;
    }


    /* =======================================================
       Get saved language
       ======================================================= */

    function getSavedLanguage() {
        try {
            const savedLanguage =
                localStorage.getItem(STORAGE_KEY);

            return normalizeLanguage(savedLanguage);
        } catch (error) {
            return null;
        }
    }


    /* =======================================================
       Detect browser language
       ======================================================= */

    function detectBrowserLanguage() {

        const browserLanguages =
            Array.isArray(navigator.languages)
                ? navigator.languages
                : [];

        for (const language of browserLanguages) {
            const normalized =
                normalizeLanguage(language);

            if (normalized) {
                return normalized;
            }
        }

        const navigatorLanguage =
            normalizeLanguage(navigator.language);

        if (navigatorLanguage) {
            return navigatorLanguage;
        }

        return DEFAULT_LANGUAGE;
    }


    /* =======================================================
       Save selected language
       ======================================================= */

    function saveLanguage(language) {

        language = normalizeLanguage(language);

        if (!language) {
            language = DEFAULT_LANGUAGE;
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                language
            );
        } catch (error) {
            /*
             * localStorage may be unavailable in
             * some privacy-restricted browsers.
             */
        }

        return language;
    }


    /* =======================================================
       Redirect to language page
       ======================================================= */

    function goToLanguage(language) {

        language = normalizeLanguage(language);

        if (!language) {
            language = DEFAULT_LANGUAGE;
        }

        saveLanguage(language);

        const target =
            SUPPORTED_LANGUAGES[language].file;

        /*
         * Avoid unnecessary reload if already
         * on the requested page.
         */

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        if (currentPage === target.toLowerCase()) {
            return;
        }

        window.location.href = target;
    }


    /* =======================================================
       Initialize direction
       ======================================================= */

    function initializeDirection(language) {

        const configuration =
            SUPPORTED_LANGUAGES[language];

        if (!configuration) {
            return;
        }

        document.documentElement.dir =
            configuration.direction;

        document.documentElement.lang =
            language;
    }


    /* =======================================================
       Automatically detect language on homepage
       ======================================================= */

    function initializeHomePage() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        /*
         * If the current page is index.html or
         * the root of GitHub Pages, initialize
         * the language selector.
         */

        const isHomePage =
            currentPage === "" ||
            currentPage === "index.html";

        if (!isHomePage) {
            return;
        }

        initializeDirection(DEFAULT_LANGUAGE);

        /*
         * Do NOT automatically redirect immediately.
         *
         * The homepage displays all supported
         * languages so the user can choose.
         *
         * Therefore browser-language detection is
         * used only to highlight the preferred language.
         */

        const savedLanguage =
            getSavedLanguage();

        const detectedLanguage =
            savedLanguage || detectBrowserLanguage();

        highlightSelectedLanguage(
            detectedLanguage
        );
    }


    /* =======================================================
       Highlight selected language
       ======================================================= */

    function highlightSelectedLanguage(language) {

        const buttons =
            document.querySelectorAll(
                "[data-language]"
            );

        buttons.forEach(function (button) {

            const buttonLanguage =
                normalizeLanguage(
                    button.dataset.language
                );

            if (buttonLanguage === language) {

                button.classList.add(
                    "selected-language"
                );

                button.setAttribute(
                    "aria-current",
                    "true"
                );

            } else {

                button.classList.remove(
                    "selected-language"
                );

                button.removeAttribute(
                    "aria-current"
                );
            }
        });
    }


    /* =======================================================
       Connect language buttons
       ======================================================= */

    function initializeLanguageButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-language]"
            );

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const language =
                        button.dataset.language;

                    goToLanguage(language);
                }
            );

            /*
             * Keyboard accessibility
             */

            button.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        const language =
                            button.dataset.language;

                        goToLanguage(language);
                    }
                }
            );
        });

        const savedLanguage =
            getSavedLanguage();

        const detectedLanguage =
            savedLanguage ||
            detectBrowserLanguage();

        highlightSelectedLanguage(
            detectedLanguage
        );
    }


    /* =======================================================
       Language links
       ======================================================= */

    function initializeLanguageLinks() {

        const links =
            document.querySelectorAll(
                "[data-language-link]"
            );

        links.forEach(function (link) {

            const language =
                normalizeLanguage(
                    link.dataset.languageLink
                );

            if (!language) {
                return;
            }

            link.href =
                SUPPORTED_LANGUAGES[
                    language
                ].file;

            link.addEventListener(
                "click",
                function () {
                    saveLanguage(language);
                }
            );
        });
    }


    /* =======================================================
       Back to language selection
       ======================================================= */

    function initializeHomeLinks() {

        const links =
            document.querySelectorAll(
                "[data-home-link]"
            );

        links.forEach(function (link) {

            link.href = "index.html";
        });
    }


    /* =======================================================
       Set correct direction for current page
       ======================================================= */

    function initializeCurrentPage() {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        if (!currentPage) {
            initializeDirection(DEFAULT_LANGUAGE);
            return;
        }

        for (
            const language in SUPPORTED_LANGUAGES
        ) {

            const configuration =
                SUPPORTED_LANGUAGES[language];

            if (
                configuration.file.toLowerCase() ===
                currentPage
            ) {

                initializeDirection(language);

                saveLanguage(language);

                return;
            }
        }
    }


    /* =======================================================
       Expose public functions
       ======================================================= */

    window.SalliPrivacy = {

        languages: SUPPORTED_LANGUAGES,

        defaultLanguage: DEFAULT_LANGUAGE,

        goToLanguage: goToLanguage,

        detectLanguage: detectBrowserLanguage,

        saveLanguage: saveLanguage,

        getSavedLanguage: getSavedLanguage
    };


    /* =======================================================
       Initialize application
       ======================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeCurrentPage();

            initializeHomePage();

            initializeLanguageButtons();

            initializeLanguageLinks();

            initializeHomeLinks();
        }
    );

})();
