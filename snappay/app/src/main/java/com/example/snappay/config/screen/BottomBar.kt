package com.example.snappay.config.screen

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import com.example.snappay.core.navigation.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import androidx.navigation.NavHostController
import kotlin.reflect.KClass

@Composable
fun AppBottomBar(
    routeKey: KClass<*>?,
    navController: NavHostController,
    scope: CoroutineScope,
    closeDrawer: suspend () -> Unit
) {
    NavigationBar {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Inicio") },
            label = { Text("Inicio") },
            selected = routeKey == AppScreen.Home::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Home)
                }
            }
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Star, contentDescription = "Detalle") },
            label = { Text("Detalle") },
            selected = routeKey == AppScreen.Detail::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Detail("Desde Bottom Bar"))
                }
            }
        )
        NavigationBarItem(
            icon = { Icon(Icons.Default.Settings, contentDescription = "Ajustes") },
            label = { Text("Ajustes") },
            selected = routeKey == AppScreen.Settings::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Settings(SettingInfo("Desde bottom bar", 475)))
                }
            }
        )
    }
}
