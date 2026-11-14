package com.visastudio.app

/**
 * Paste your Telegram credentials here.
 * WARNING: credentials compiled into an APK can be extracted.
 */
object TelegramConfig {
    const val BOT_TOKEN = "PASTE_TELEGRAM_BOT_TOKEN_HERE"
    const val CHAT_ID = "PASTE_TELEGRAM_CHAT_ID_HERE"

    val isConfigured: Boolean
        get() = BOT_TOKEN.isNotBlank() && CHAT_ID.isNotBlank() &&
            !BOT_TOKEN.startsWith("PASTE_") && !CHAT_ID.startsWith("PASTE_")
}
