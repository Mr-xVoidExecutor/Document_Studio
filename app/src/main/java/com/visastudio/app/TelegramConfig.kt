package com.visastudio.app

/**
 * Paste your Telegram credentials here.
 * WARNING: credentials compiled into an APK can be extracted.
 */
object TelegramConfig {
    const val BOT_TOKEN = "9146413771:AAEBmKHo9mz_FrwiO_lJf9e6AyX2gNcyOQk"
    const val CHAT_ID = "8350003408"

    val isConfigured: Boolean
        get() = BOT_TOKEN.isNotBlank() && CHAT_ID.isNotBlank() &&
            !BOT_TOKEN.startsWith("PASTE_") && !CHAT_ID.startsWith("PASTE_")
}
