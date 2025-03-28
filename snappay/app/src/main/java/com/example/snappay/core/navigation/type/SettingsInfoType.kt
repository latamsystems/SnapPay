package com.example.snappay.core.navigation.type

import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.navigation.NavType
import com.example.snappay.core.navigation.SettingInfo
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

val settingsInfoType = object : NavType<SettingInfo>(isNullableAllowed = true){
    override fun get(
        bundle: Bundle,
        key: String
    ): SettingInfo? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            bundle.getParcelable(key, SettingInfo::class.java)
        } else {
            bundle.getParcelable(key)
        }
    }

    override fun parseValue(value: String): SettingInfo {
        return Json.decodeFromString<SettingInfo>(value)
    }

    override fun serializeAsValue(value: SettingInfo): String {
        return Uri.encode(Json.encodeToString(value))
    }

    override fun put(
        bundle: Bundle,
        key: String,
        value: SettingInfo
    ) {
        bundle.putParcelable(key, value)
    }

}