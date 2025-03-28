package com.example.snappay.ui.components

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.snappay.core.navigation.AppScreen
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import androidx.navigation.NavHostController
import kotlin.reflect.KClass

@Composable
fun AppDrawer(
    routeKey: KClass<*>?,
    scope: CoroutineScope,
    navController: NavHostController,
    closeDrawer: suspend () -> Unit
) {
    ModalDrawerSheet {
        Text("Menú lateral", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(16.dp))

        NavigationDrawerItem(
            label = { Text("Inicio") },
            selected = routeKey == AppScreen.Home::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Home)
                }
            }
        )
        NavigationDrawerItem(
            label = { Text("Detalle") },
            selected = routeKey == AppScreen.Detail::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Detail("Desde Drawer"))
                }
            }
        )
    }
}
