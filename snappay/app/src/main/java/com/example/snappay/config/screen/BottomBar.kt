package com.example.snappay.config.screen

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
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
    val items = listOf(
        Triple("Inicio", Icons.Filled.Home, AppScreen.Home::class),
        Triple("Pagos", Icons.Filled.Payments, AppScreen.Payments::class),
        Triple("Multas", Icons.Filled.AccessTime, AppScreen.Fine::class)
    )

    Surface(
        tonalElevation = 1.dp,
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
        shadowElevation = 1.dp,
        color = MaterialTheme.colorScheme.surface,
    ) {
        NavigationBar(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 5.dp, vertical = 8.dp),
            containerColor = Color.Transparent,
        ) {
            items.forEach { (label, icon, screenClass) ->
                val selected = routeKey == screenClass

                NavigationBarItem(
                    selected = selected,
                    onClick = {
                        scope.launch {
                            closeDrawer()
                            navController.navigate(screenClass.objectInstance!!)
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = icon,
                            contentDescription = label
                        )
                    },
                    label = {
                        Text(
                            text = label,
                            style = MaterialTheme.typography.labelSmall
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                        selectedIconColor = MaterialTheme.colorScheme.primary,
                        unselectedIconColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                        selectedTextColor = MaterialTheme.colorScheme.primary,
                        unselectedTextColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                )
            }
        }
    }
}

