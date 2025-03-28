package com.example.snappay.core.navigation

import kotlinx.serialization.Serializable

//sealed class AppScreensX(val route: String) {
//    object FirstScreen : AppScreensX("first_screen")
//    object SecondScreen : AppScreensX("second_screen")
//}

@Serializable
object Login

@Serializable
object  Home

@Serializable
data class Detail(val name: String)

@Serializable
data class Settings(val info: SettingInfo)
