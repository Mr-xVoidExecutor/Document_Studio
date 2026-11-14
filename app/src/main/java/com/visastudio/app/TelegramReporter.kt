package com.visastudio.app

import android.content.Context
import android.os.Build
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/**
 * Sends limited technical diagnostics only. It never reads SMS, contacts,
 * location, files, or document contents.
 */
object TelegramReporter {
    @Volatile private var lastSentAt = 0L
    private const val MIN_INTERVAL_MS = 60_000L

    fun report(context: Context, source: String, message: String, details: String = "") {
        if (!TelegramConfig.isConfigured) return
        synchronized(this) {
            val now = System.currentTimeMillis()
            if (now - lastSentAt < MIN_INTERVAL_MS) return
            lastSentAt = now
        }

        val safeMessage = redact(message).take(700)
        val safeDetails = redact(details).take(1400)
        val text = buildString {
            append("Document Studio error report\n")
            append("Source: ").append(source.take(40)).append('\n')
            append("App: ").append(context.packageManager.getPackageInfo(context.packageName, 0).versionName ?: "unknown").append('\n')
            append("Android: ").append(Build.VERSION.RELEASE).append(" (API ").append(Build.VERSION.SDK_INT).append(")\n")
            append("Device: ").append(Build.MANUFACTURER).append(' ').append(Build.MODEL).append('\n')
            append("Error: ").append(safeMessage.ifBlank { "Unspecified error" })
            if (safeDetails.isNotBlank()) append("\nDetails: ").append(safeDetails)
        }.take(3000)

        Thread({
            var connection: HttpURLConnection? = null
            try {
                connection = (URL("https://api.telegram.org/bot${TelegramConfig.BOT_TOKEN}/sendMessage")
                    .openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    connectTimeout = 8000
                    readTimeout = 8000
                    doOutput = true
                    setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                }
                val body = "chat_id=" + encode(TelegramConfig.CHAT_ID) + "&text=" + encode(text)
                connection.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
                connection.inputStream.close()
            } catch (_: Exception) {
                // Silent failure prevents recursive error-report loops.
            } finally {
                connection?.disconnect()
            }
        }, "telegram-error-report").apply { isDaemon = true }.start()
    }

    private fun encode(value: String): String = URLEncoder.encode(value, "UTF-8")

    private fun redact(value: String): String = value
        .replace(Regex("[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", RegexOption.IGNORE_CASE), "[email]")
        .replace(Regex("(?<!\\d)\\+?\\d[\\d .()\\-]{7,}\\d(?!\\d)"), "[number]")
}
