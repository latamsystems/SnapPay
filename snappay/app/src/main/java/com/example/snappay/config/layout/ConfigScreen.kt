package com.example.snappay.config.layout

import com.example.snappay.core.navigation.AppScreen
import kotlin.reflect.KClass

// Config por pantalla
data class ScreenConfig(
    val showTopBar: Boolean = true,
    val showBottomBar: Boolean = true,
    val showFab: Boolean = true,
    val showDrawer: Boolean = true,
    val title: String = "Snap Pay",
    val showRefreshFab: Boolean = false
)

// Función para obtener la configuración de la pantalla
fun getRouteKey(route: String?): KClass<*>? {
    return when {
        route?.contains(AppScreen.Login::class.simpleName ?: "") == true -> AppScreen.Login::class
        route?.contains(AppScreen.Home::class.simpleName ?: "") == true -> AppScreen.Home::class
        route?.contains(AppScreen.Payments::class.simpleName ?: "") == true -> AppScreen.Payments::class
        route?.contains(AppScreen.Pay::class.simpleName ?: "") == true -> AppScreen.Pay::class
        route?.contains(AppScreen.Dates::class.simpleName ?: "") == true -> AppScreen.Dates::class
        route?.contains(AppScreen.Fine::class.simpleName ?: "") == true -> AppScreen.Fine::class
        route?.contains(AppScreen.Settings::class.simpleName ?: "") == true -> AppScreen.Settings::class
        else -> null
    }
}

// Función para acceder a la configuración de las pantallas
fun accessScreen(): Map<KClass<*>, ScreenConfig> {
    return mapOf(
        AppScreen.Login::class to ScreenConfig(showTopBar = false, showBottomBar = false, showFab = false, showDrawer = false),
        AppScreen.Home::class to ScreenConfig(title = "Inicio"),
        AppScreen.Payments::class to ScreenConfig(title = "Pagos", showRefreshFab = true),
        AppScreen.Pay::class to ScreenConfig(title = "Pagar", showFab = false),
        AppScreen.Dates::class to ScreenConfig(title = "Fechas", showRefreshFab = true),
        AppScreen.Fine::class to ScreenConfig(title = "Multas", showRefreshFab = true),
        AppScreen.Settings::class to ScreenConfig(title = "Ajustes", showFab = false)
    )
}
