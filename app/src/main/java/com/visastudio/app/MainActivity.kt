package com.visastudio.app

import android.annotation.SuppressLint
import android.content.Context
import android.content.ContentValues
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.widget.Toast
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Bundle
import android.os.ParcelFileDescriptor
import android.print.PrintAttributes
import android.print.PrintManager
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.PermissionRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper
import com.tom_roush.pdfbox.text.TextPosition
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.util.UUID
import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private val fileChooserRequestCode = 4102
    private val permissionRequestCode = 4103
    private var pendingWebPermissionRequest: PermissionRequest? = null
    private val assetDir by lazy { File(filesDir, "template-assets").apply { mkdirs() } }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        PDFBoxResourceLoader.init(applicationContext)
        webView = findViewById(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    val requested = request.resources
                    val required = mutableListOf<String>()
                    if (PermissionRequest.RESOURCE_VIDEO_CAPTURE in requested) required.add(android.Manifest.permission.CAMERA)
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE in requested) required.add(android.Manifest.permission.RECORD_AUDIO)
                    if (required.isEmpty()) {
                        request.deny()
                    } else {
                        val missing = required.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
                        if (missing.isEmpty()) {
                            request.grant(requested)
                        } else {
                            pendingWebPermissionRequest?.deny()
                            pendingWebPermissionRequest = request
                            requestPermissions(missing.toTypedArray(), permissionRequestCode)
                        }
                    }
                }
            }

            override fun onShowFileChooser(
                view: WebView?,
                filePath: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePath
                return try {
                    val selectionIntent = fileChooserParams?.createIntent()
                        ?: Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            type = "*/*"
                            putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("application/pdf", "image/jpeg", "image/png", "image/webp"))
                        }
                    val chooser = Intent.createChooser(
                        selectionIntent,
                        fileChooserParams?.title?.toString()?.takeIf { it.isNotBlank() } ?: "Choose a PDF or image"
                    )
                    startActivityForResult(chooser, fileChooserRequestCode)
                    true
                } catch (_: Exception) {
                    this@MainActivity.filePathCallback?.onReceiveValue(null)
                    this@MainActivity.filePathCallback = null
                    false
                }
            }
        }
        webView.addJavascriptInterface(TemplateBridge(), "NativeTemplate")
        webView.addJavascriptInterface(AuthBridge(), "NativeAuth")
        webView.addJavascriptInterface(PermissionsBridge(), "NativePermissions")
        webView.addJavascriptInterface(TelegramBridge(), "NativeTelegram")
        webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun printDocument() { runOnUiThread { openPrintDialog() } }
        }, "NativePrint")
        webView.loadUrl("file:///android_asset/index.html")
    }

    private inner class AuthBridge {
        private val prefs by lazy { getSharedPreferences("document_studio_auth", Context.MODE_PRIVATE) }
        private val iterations = 120_000
        init {
            // One-time migration: install the owner's preconfigured local account.
            // Only the PBKDF2 hash and salt are stored; the plaintext password is not in the app.
            if (!prefs.getBoolean("default_credentials_v1", false)) {
                prefs.edit()
                    .putString("username", "mohammadlimon007")
                    .putString("password_salt", "RaaiC2621Zo+XCZ3ySzAdQ==")
                    .putString("password_hash", "g0v/Rclc/Ng6KJgdgvHFf14pCugqhm7TIYjXiyaOlds=")
                    .putBoolean("default_credentials_v1", true)
                    .putInt("failed_attempts", 0)
                    .putLong("locked_until", 0L)
                    .apply()
            }
        }
        @JavascriptInterface fun hasCredentials(): Boolean = !prefs.getString("password_hash", null).isNullOrBlank()
        @JavascriptInterface fun shouldAutoLogin(): Boolean = hasCredentials() && prefs.getBoolean("authenticated_once", false) && prefs.getBoolean("auto_login", true)
        @JavascriptInterface fun setAutoLogin(enabled: Boolean): Boolean {
            return try { prefs.edit().putBoolean("auto_login", enabled && hasCredentials()).putBoolean("authenticated_once", enabled || prefs.getBoolean("authenticated_once", false)).commit() } catch (_: Exception) { false }
        }
        @JavascriptInterface fun setup(username: String, password: String): Boolean {
            return try {
                val user = username.trim().lowercase()
                if (hasCredentials() || user.length !in 3..40 || !user.matches(Regex("[a-z0-9._-]+")) || password.length !in 8..128) return false
                val salt = ByteArray(16).also { SecureRandom().nextBytes(it) }
                val hash = derive(password, salt)
                prefs.edit().putString("username", user).putString("password_salt", Base64.encodeToString(salt, Base64.NO_WRAP)).putString("password_hash", Base64.encodeToString(hash, Base64.NO_WRAP)).putInt("failed_attempts", 0).apply()
                hash.fill(0)
                true
            } catch (_: Exception) { false }
        }
        @JavascriptInterface fun authenticate(username: String, password: String): Boolean {
            return try {
                if (prefs.getLong("locked_until", 0L) > System.currentTimeMillis()) return false
                val expectedUser = prefs.getString("username", null) ?: return false
                val saltText = prefs.getString("password_salt", null) ?: return false
                val hashText = prefs.getString("password_hash", null) ?: return false
                if (!MessageDigest.isEqual(expectedUser.toByteArray(), username.trim().lowercase().toByteArray())) return failed()
                val actual = derive(password, Base64.decode(saltText, Base64.NO_WRAP))
                val ok = MessageDigest.isEqual(Base64.decode(hashText, Base64.NO_WRAP), actual)
                actual.fill(0)
                if (ok) { prefs.edit().putInt("failed_attempts", 0).putLong("locked_until", 0L).apply(); true } else failed()
            } catch (_: Exception) { false }
        }
        private fun failed(): Boolean {
            val count = prefs.getInt("failed_attempts", 0) + 1
            val edit = prefs.edit().putInt("failed_attempts", count)
            if (count >= 5) edit.putLong("locked_until", System.currentTimeMillis() + 30_000L).putInt("failed_attempts", 0)
            edit.apply()
            return false
        }
        private fun derive(password: String, salt: ByteArray): ByteArray {
            val spec = PBEKeySpec(password.toCharArray(), salt, iterations, 256)
            return try { SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded } finally { spec.clearPassword() }
        }
    }

    private inner class TelegramBridge {
        @JavascriptInterface
        fun reportError(source: String, message: String, details: String) {
            TelegramReporter.report(this@MainActivity, source, message, details)
        }
    }

    private inner class PermissionsBridge {
        @JavascriptInterface
        fun getPermissionStatus(): String {
            val status = JSONObject()
            status.put("camera", hasPermission(android.Manifest.permission.CAMERA))
            status.put("microphone", hasPermission(android.Manifest.permission.RECORD_AUDIO))
            status.put("contacts", hasPermission(android.Manifest.permission.READ_CONTACTS))
            status.put("location", hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) ||
                hasPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION))
            status.put("notifications", Build.VERSION.SDK_INT < 33 ||
                hasPermission("android.permission.POST_NOTIFICATIONS"))
            status.put("phoneState", hasPermission(android.Manifest.permission.READ_PHONE_STATE))
            status.put("photos", true)
            status.put("sms", JSONObject().put("available", false).put("reason", "SMS content access is not enabled"))
            return status.toString()
        }

        @JavascriptInterface
        fun requestPermission(name: String): Boolean {
            val requested = when (name) {
                "camera" -> arrayOf(android.Manifest.permission.CAMERA)
                "microphone" -> arrayOf(android.Manifest.permission.RECORD_AUDIO)
                "contacts" -> arrayOf(android.Manifest.permission.READ_CONTACTS)
                "location" -> arrayOf(android.Manifest.permission.ACCESS_COARSE_LOCATION, android.Manifest.permission.ACCESS_FINE_LOCATION)
                "notifications" -> if (Build.VERSION.SDK_INT >= 33) arrayOf("android.permission.POST_NOTIFICATIONS") else emptyArray()
                "phoneState" -> arrayOf(android.Manifest.permission.READ_PHONE_STATE)
                "photos" -> emptyArray()
                else -> return false
            }
            if (requested.isEmpty()) return name == "photos"
            runOnUiThread {
                val missing = requested.filter { !hasPermission(it) }
                if (missing.isNotEmpty()) requestPermissions(missing.toTypedArray(), permissionRequestCode)
            }
            return true
        }

        private fun hasPermission(permission: String): Boolean =
            checkSelfPermission(permission) == PackageManager.PERMISSION_GRANTED
    }

    private data class PendingExport(
        val file: File,
        val output: FileOutputStream,
        val mime: String,
        val name: String,
        var size: Long = 0
    )

    private inner class TemplateBridge {
        private val pendingExports = mutableMapOf<String, PendingExport>()

        @JavascriptInterface
        fun beginExport(fileName: String, mime: String): String {
            return try {
                if (mime !in setOf("application/pdf", "image/png", "image/jpeg")) return ""
                val extension = when (mime) {
                    "application/pdf" -> "pdf"
                    "image/png" -> "png"
                    else -> "jpg"
                }
                val safeBase = fileName.substringAfterLast('/').substringAfterLast('\\')
                    .replace(Regex("[^A-Za-z0-9._-]"), "_")
                    .take(72).substringBeforeLast('.', fileName).ifBlank { "Document-Studio-export" }
                val name = "$safeBase.$extension"
                val token = UUID.randomUUID().toString()
                val file = File(cacheDir, "$token.export-part")
                val pending = PendingExport(file, FileOutputStream(file), mime, name)
                synchronized(pendingExports) { pendingExports[token] = pending }
                token
            } catch (_: Exception) { "" }
        }

        @JavascriptInterface
        fun appendExport(token: String, base64Chunk: String): Boolean {
            return try {
                if (!token.matches(Regex("[0-9a-fA-F-]{36}")) || base64Chunk.isBlank() || base64Chunk.length > 160_000) return false
                val pending = synchronized(pendingExports) { pendingExports[token] } ?: return false
                val bytes = Base64.decode(base64Chunk, Base64.DEFAULT)
                if (pending.size + bytes.size > 50L * 1024 * 1024) return false
                pending.output.write(bytes)
                pending.size += bytes.size
                true
            } catch (_: Exception) { false }
        }

        @JavascriptInterface
        fun finishExport(token: String): String {
            val pending = synchronized(pendingExports) { pendingExports.remove(token) } ?: return ""
            return try {
                pending.output.close()
                if (pending.size <= 0 || pending.size > 50L * 1024 * 1024) return ""
                val signature = ByteArray(8)
                val count = pending.file.inputStream().use { it.read(signature) }
                val valid = when (pending.mime) {
                    "application/pdf" -> count >= 5 && String(signature, 0, 5, Charsets.US_ASCII) == "%PDF-"
                    "image/png" -> count >= 8 && signature.contentEquals(byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A))
                    else -> count >= 3 && signature[0] == 0xFF.toByte() && signature[1] == 0xD8.toByte() && signature[2] == 0xFF.toByte()
                }
                if (!valid) return ""
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, pending.name)
                        put(MediaStore.Downloads.MIME_TYPE, pending.mime)
                        put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Document Studio")
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values) ?: return ""
                    contentResolver.openOutputStream(uri)?.use { output ->
                        pending.file.inputStream().use { input -> input.copyTo(output) }
                    } ?: return ""
                    val ready = ContentValues().apply { put(MediaStore.Downloads.IS_PENDING, 0) }
                    contentResolver.update(uri, ready, null, null)
                } else {
                    val folder = File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "Document Studio").apply { mkdirs() }
                    pending.file.copyTo(File(folder, pending.name), overwrite = true)
                }
                runOnUiThread { Toast.makeText(this@MainActivity, "Saved: ${pending.name}", Toast.LENGTH_LONG).show() }
                pending.name
            } catch (_: Exception) { "" }
            finally { pending.file.delete() }
        }

        @JavascriptInterface
        fun cancelExport(token: String) {
            val pending = synchronized(pendingExports) { pendingExports.remove(token) }
            try { pending?.output?.close() } catch (_: Exception) { }
            pending?.file?.delete()
        }

        @JavascriptInterface
        fun saveAsset(dataUrl: String, extension: String): String {
            return try {
                val ext = extension.lowercase().filter { it in "abcdefghijklmnopqrstuvwxyz0123456789" }
                if (ext !in setOf("pdf", "jpg", "jpeg", "png", "webp")) return ""
                val encoded = dataUrl.substringAfter(",", "")
                if (encoded.isBlank() || encoded.length > 36_000_000) return ""
                val bytes = Base64.decode(encoded, Base64.DEFAULT)
                if (bytes.size > 25 * 1024 * 1024) return ""
                val valid = when (ext) {
                    "pdf" -> bytes.size >= 5 && String(bytes, 0, 5, Charsets.US_ASCII) == "%PDF-"
                    "jpg", "jpeg" -> bytes.size >= 3 && bytes[0] == 0xFF.toByte() && bytes[1] == 0xD8.toByte() && bytes[2] == 0xFF.toByte()
                    "png" -> bytes.size >= 8 && bytes.take(8).toByteArray().contentEquals(byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A))
                    "webp" -> bytes.size >= 12 && String(bytes, 0, 4, Charsets.US_ASCII) == "RIFF" && String(bytes, 8, 4, Charsets.US_ASCII) == "WEBP"
                    else -> false
                }
                if (!valid) return ""
                val id = UUID.randomUUID().toString()
                FileOutputStream(File(assetDir, "$id.$ext")).use { it.write(bytes) }
                id
            } catch (_: Exception) { "" }
        }

        @JavascriptInterface
        fun loadAsset(assetId: String): String {
            return try {
                if (!assetId.matches(Regex("[0-9a-fA-F-]{36}"))) return ""
                val file = assetDir.listFiles()?.firstOrNull { it.name.startsWith("$assetId.") } ?: return ""
                if (file.length() > 25L * 1024 * 1024) return ""
                val mime = when (file.extension.lowercase()) {
                    "pdf" -> "application/pdf"
                    "png" -> "image/png"
                    "webp" -> "image/webp"
                    else -> "image/jpeg"
                }
                "data:$mime;base64," + Base64.encodeToString(file.readBytes(), Base64.NO_WRAP)
            } catch (_: Exception) { "" }
        }

        @JavascriptInterface
        fun deleteAsset(assetId: String): Boolean {
            return try {
                if (!assetId.matches(Regex("[0-9a-fA-F-]{36}"))) return false
                val files = assetDir.listFiles()?.filter { it.name.startsWith("$assetId.") } ?: return false
                files.forEach { it.delete() }
                true
            } catch (_: Exception) { false }
        }

        @JavascriptInterface
        fun nativeAnalyzePdf(dataUrl: String, pageIndex: Int): String {
            return try {
                val encoded = dataUrl.substringAfter(",", "")
                if (encoded.isBlank() || encoded.length > 25_000_000) return JSONObject().put("error", "PDF is too large for native analysis (maximum 18 MB).").toString()
                val bytes = Base64.decode(encoded, Base64.DEFAULT)
                if (bytes.size < 5 || bytes.size > 18 * 1024 * 1024 || String(bytes, 0, 5, Charsets.US_ASCII) != "%PDF-") {
                    return JSONObject().put("error", "Invalid PDF or file exceeds the 18 MB native-analysis limit.").toString()
                }
                PDDocument.load(ByteArrayInputStream(bytes)).use { document ->
                    if (document.isEncrypted) return JSONObject().put("error", "Encrypted PDFs are not supported by native analysis yet.").toString()
                    if (pageIndex !in 0 until document.numberOfPages) return JSONObject().put("error", "Page index is out of range.").toString()
                    val page = document.getPage(pageIndex)
                    val positions = mutableListOf<TextPosition>()
                    val stripper = object : PDFTextStripper() {
                        init { startPage = pageIndex + 1; endPage = pageIndex + 1 }
                        override fun processTextPosition(text: TextPosition) {
                            if (positions.size < 12000) positions.add(text)
                            super.processTextPosition(text)
                        }
                    }
                    val extracted = stripper.getText(document)
                    val runs = JSONArray()
                    var current = JSONObject()
                    var currentFont = ""
                    var currentY = Double.NaN
                    var currentRight = 0.0
                    for (position in positions) {
                        val char = position.unicode ?: continue
                        if (char.isBlank()) continue
                        val fontName = position.font?.name ?: "Unknown"
                        val x = position.xDirAdj.toDouble()
                        val yTop = position.yDirAdj.toDouble()
                        val width = position.widthDirAdj.toDouble().coerceAtLeast(0.1)
                        val height = position.heightDir.toDouble().coerceAtLeast(1.0)
                        val size = position.fontSizeInPt.toDouble().coerceIn(4.0, 144.0)
                        val sameRun = current.length() > 0 && currentFont == fontName &&
                            kotlin.math.abs(currentY - yTop) <= maxOf(2.5, size * 0.28) &&
                            x >= currentRight - size * 0.25 && x <= currentRight + size * 1.8
                        if (sameRun) {
                            current.put("text", current.optString("text") + char)
                            current.put("width", maxOf(currentRight, x + width) - current.optDouble("x"))
                        } else {
                            if (current.length() > 0) runs.put(current)
                            current = JSONObject()
                                .put("text", char)
                                .put("x", x)
                                .put("y", page.mediaBox.height.toDouble() - yTop)
                                .put("width", width)
                                .put("height", height)
                                .put("font", fontName)
                                .put("size", size)
                            currentFont = fontName
                            currentY = yTop
                            currentRight = x + width
                        }
                        if (sameRun) currentRight = maxOf(currentRight, x + width)
                        if (runs.length() >= 800) break
                    }
                    if (current.length() > 0 && runs.length() < 800) runs.put(current)
                    JSONObject()
                        .put("ok", true)
                        .put("engine", "Apache PDFBox Android")
                        .put("pageIndex", pageIndex)
                        .put("pageCount", document.numberOfPages)
                        .put("pageWidth", page.mediaBox.width.toDouble())
                        .put("pageHeight", page.mediaBox.height.toDouble())
                        .put("characterCount", positions.size)
                        .put("text", extracted.take(30000))
                        .put("runs", runs)
                        .toString()
                }
            } catch (error: Exception) {
                JSONObject().put("error", error.message ?: "Native PDF analysis failed.").toString()
            }
        }

        @JavascriptInterface
        fun pdfPageCount(assetId: String): Int {
            return try {
                val file = pdfFile(assetId) ?: return 0
                ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY).use { descriptor ->
                    PdfRenderer(descriptor).use { renderer -> renderer.pageCount }
                }
            } catch (_: Exception) { 0 }
        }

        @JavascriptInterface
        fun renderPdfPage(assetId: String, pageIndex: Int): String {
            return try {
                val file = pdfFile(assetId) ?: return ""
                ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY).use { descriptor ->
                    PdfRenderer(descriptor).use { renderer ->
                        if (pageIndex !in 0 until renderer.pageCount) return ""
                        renderer.openPage(pageIndex).use { page ->
                            val scale = minOf(2.5f, 2400f / page.width.toFloat(), 3200f / page.height.toFloat())
                            val width = (page.width * scale).toInt().coerceAtLeast(1)
                            val height = (page.height * scale).toInt().coerceAtLeast(1)
                            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                            try {
                                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                                val output = ByteArrayOutputStream()
                                bitmap.compress(Bitmap.CompressFormat.JPEG, 88, output)
                                "data:image/jpeg;base64," + Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
                            } finally {
                                bitmap.recycle()
                            }
                        }
                    }
                }
            } catch (_: Exception) { "" }
        }

        private fun pdfFile(assetId: String): File? {
            if (!assetId.matches(Regex("[0-9a-fA-F-]{36}"))) return null
            return assetDir.listFiles()?.firstOrNull { it.name == "$assetId.pdf" }
        }
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) webView.evaluateJavascript("document.body.classList.remove('template-print-mode')", null)
    }

    private fun openPrintDialog() {
        val manager = getSystemService(Context.PRINT_SERVICE) as PrintManager
        val adapter = webView.createPrintDocumentAdapter("Document-Studio")
        val attributes = PrintAttributes.Builder()
            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
            .setResolution(PrintAttributes.Resolution("document_studio", "Document Studio", 300, 300))
            .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
            .build()
        manager.print("Document Studio", adapter, attributes)
    }

    @Deprecated("Deprecated API retained for WebView file chooser compatibility")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == permissionRequestCode) {
            val request = pendingWebPermissionRequest
            if (request != null) {
                val granted = permissions.indices.filter { grantResults.getOrNull(it) == PackageManager.PERMISSION_GRANTED }
                    .mapNotNull { index ->
                        when (permissions[index]) {
                            android.Manifest.permission.CAMERA -> PermissionRequest.RESOURCE_VIDEO_CAPTURE
                            android.Manifest.permission.RECORD_AUDIO -> PermissionRequest.RESOURCE_AUDIO_CAPTURE
                            else -> null
                        }
                    }.toTypedArray()
                if (granted.isNotEmpty()) request.grant(granted) else request.deny()
                pendingWebPermissionRequest = null
            }
            if (::webView.isInitialized) {
                webView.post { webView.evaluateJavascript("window.AppPermissions && window.AppPermissions.refresh()", null) }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileChooserRequestCode) {
            val result = if (resultCode == RESULT_OK) WebChromeClient.FileChooserParams.parseResult(resultCode, data) else null
            filePathCallback?.onReceiveValue(result)
            filePathCallback = null
        }
    }

    override fun onDestroy() {
        filePathCallback?.onReceiveValue(null)
        filePathCallback = null
        webView.removeJavascriptInterface("NativeAuth")
        webView.removeJavascriptInterface("NativeTemplate")
        webView.removeJavascriptInterface("NativePrint")
        webView.removeJavascriptInterface("NativeTelegram")
        webView.destroy()
        super.onDestroy()
    }

    @Deprecated("Deprecated API retained for backward compatibility")
    override fun onBackPressed() {
        if (!::webView.isInitialized) {
            super.onBackPressed()
            return
        }
        webView.evaluateJavascript(
            "window.AppShell && window.AppShell.handleSystemBack ? window.AppShell.handleSystemBack() : false"
        ) { handled ->
            if (handled != "true") finish()
        }
    }
}