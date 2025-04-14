package com.example.snappay.core.navigation

import kotlinx.serialization.Serializable

sealed class AppScreen {

    @Serializable
    object Home

    @Serializable
    object Payments

    @Serializable
    object Pay

    @Serializable
    object Dates

    @Serializable
    object Fine


    // Admin

    @Serializable
    object Login

    @Serializable
    object Settings









    // Examples

    @Serializable
    object First

    @Serializable
    data class Detail(val name: String)

    @Serializable
    data class Last(val info: LastInfo)
}
