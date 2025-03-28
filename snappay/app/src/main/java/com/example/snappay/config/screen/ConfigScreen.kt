package com.example.snappay.config.screen

import com.example.snappay.core.navigation.AppScreen
import kotlin.reflect.KClass

// Config por pantalla
data class ScreenConfig(
    val showTopBar: Boolean = true,
    val showBottomBar: Boolean = true,
    val showFab: Boolean = true,
    val showDrawer: Boolean = true,
    val title: String = "Snap Pay"
)

// Función para obtener la configuración de la pantalla
fun getRouteKey(route: String?): KClass<*>? {
    return when {
        route?.contains(AppScreen.Login::class.simpleName ?: "") == true -> AppScreen.Login::class
        route?.contains(AppScreen.Home::class.simpleName ?: "") == true -> AppScreen.Home::class
        route?.contains(AppScreen.Detail::class.simpleName ?: "") == true -> AppScreen.Detail::class
        route?.contains(AppScreen.Settings::class.simpleName ?: "") == true -> AppScreen.Settings::class
        else -> null
    }
}

// Función para acceder a la configuración de las pantallas
fun accessScreen(): Map<KClass<*>, ScreenConfig> {
    return mapOf(
        AppScreen.Login::class to ScreenConfig(showTopBar = false, showBottomBar = false, showFab = false, showDrawer = false),
        AppScreen.Home::class to ScreenConfig(title = "Inicio"),
        AppScreen.Detail::class to ScreenConfig(title = "Detalle", showFab = false),
        AppScreen.Settings::class to ScreenConfig(title = "Ajustes", showBottomBar = false)
    )
}
