package com.example.snappay.core.navigation

import kotlinx.serialization.Serializable

sealed class AppScreen {

    @Serializable
    object Login

    @Serializable
    object Home

    @Serializable
    data class Detail(val name: String)

    @Serializable
    data class Settings(val info: SettingInfo)
}
