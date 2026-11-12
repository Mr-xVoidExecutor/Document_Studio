package com.visastudio.app

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
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
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private val fileChooserRequestCode = 4102
    private val assetDir by lazy { File(filesDir, "template-assets").apply { mkdirs() } }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
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
            override fun onShowFileChooser(
                view: WebView?,
                filePath: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePath
                val picker = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("application/pdf", "image/jpeg", "image/png", "image/webp"))
                    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
                }
                return try {
                    startActivityForResult(Intent.createChooser(picker, "Choose a PDF or image"), fileChooserRequestCode)
                    true
                } catch (_: Exception) {
                    this@MainActivity.filePathCallback?.onReceiveValue(null)
                    this@MainActivity.filePathCallback = null
                    false
                }
            }
        }
        webView.addJavascriptInterface(TemplateBridge(), "NativeTemplate")
        webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun printDocument() { runOnUiThread { openPrintDialog() } }
        }, "NativePrint")
        webView.loadUrl("file:///android_asset/index.html")
    }

    private inner class TemplateBridge {
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
        fun pdfPageCount(assetId: String): Int {
            return try {
                val file = pdfFile(assetId) ?: return 0
                PdfRenderer(ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)).use { it.pageCount }
            } catch (_: Exception) { 0 }
        }

        @JavascriptInterface
        fun renderPdfPage(assetId: String, pageIndex: Int): String {
            return try {
                val file = pdfFile(assetId) ?: return ""
                PdfRenderer(ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY)).use { renderer ->
                    if (pageIndex !in 0 until renderer.pageCount) return ""
                    renderer.openPage(pageIndex).use { page ->
                        val scale = minOf(2.5f, 2400f / page.width.toFloat(), 3200f / page.height.toFloat())
                        val width = (page.width * scale).toInt().coerceAtLeast(1)
                        val height = (page.height * scale).toInt().coerceAtLeast(1)
                        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                        page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                        val output = ByteArrayOutputStream()
                        bitmap.compress(Bitmap.CompressFormat.JPEG, 88, output)
                        bitmap.recycle()
                        "data:image/jpeg;base64," + Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
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
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileChooserRequestCode) {
            val result = if (resultCode == RESULT_OK) data?.data?.let { arrayOf(it) } else null
            filePathCallback?.onReceiveValue(result)
            filePathCallback = null
        }
    }

    override fun onDestroy() {
        filePathCallback?.onReceiveValue(null)
        filePathCallback = null
        webView.removeJavascriptInterface("NativeTemplate")
        webView.removeJavascriptInterface("NativePrint")
        webView.destroy()
        super.onDestroy()
    }

    @Deprecated("Deprecated API retained for backward compatibility")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }
}
