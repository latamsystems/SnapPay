package com.example.snappay

import android.content.Context
import java.io.File

fun guardarUidExterno(context: Context, uid: String) {
    val file = File(context.getExternalFilesDir(null), ".snappay_uid.txt")
    file.writeText(uid)
}

fun leerUidExterno(context: Context): String? {
    val file = File(context.getExternalFilesDir(null), ".snappay_uid.txt")
    return if (file.exists()) file.readText() else null
}
