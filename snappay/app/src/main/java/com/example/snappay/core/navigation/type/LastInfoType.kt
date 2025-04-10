package com.example.snappay.core.navigation.type

import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.navigation.NavType
import com.example.snappay.core.navigation.LastInfo
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

// Example
val lastInfoType = object : NavType<LastInfo>(isNullableAllowed = true){
    override fun get(
        bundle: Bundle,
        key: String
    ): LastInfo? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            bundle.getParcelable(key, LastInfo::class.java)
        } else {
            bundle.getParcelable(key)
        }
    }

    override fun parseValue(value: String): LastInfo {
        return Json.decodeFromString<LastInfo>(value)
    }

    override fun serializeAsValue(value: LastInfo): String {
        return Uri.encode(Json.encodeToString(value))
    }

    override fun put(
        bundle: Bundle,
        key: String,
        value: LastInfo
    ) {
        bundle.putParcelable(key, value)
    }

}