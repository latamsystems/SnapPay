package com.example.snappay.config.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.example.snappay.R
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
    val isDark = isSystemInDarkTheme()
    val logoRes = if (isDark) R.drawable.logo_horizontal_white else R.drawable.logo_horizintal_black

    ModalDrawerSheet(
        modifier = Modifier
            .fillMaxHeight()
            .width(280.dp)
    ) {
        // Encabezado
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(id = logoRes),
                contentDescription = "Logo",
                modifier = Modifier
                    .width(140.dp)
                    .clip(CircleShape)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "by Josue Velasquez",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )

        }

        Divider()

        Spacer(modifier = Modifier.height(12.dp))

        // Ítems de navegación
        NavigationDrawerItem(
            icon = { Icon(Icons.Default.Home, contentDescription = null) },
            label = { Text("Inicio") },
            selected = routeKey == AppScreen.Home::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Home)
                }
            },
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Ítems de navegación
        NavigationDrawerItem(
            icon = { Icon(Icons.Default.Settings, contentDescription = null) },
            label = { Text("Ajustes") },
            selected = routeKey == AppScreen.Settings::class,
            onClick = {
                scope.launch {
                    closeDrawer()
                    navController.navigate(AppScreen.Settings)
                }
            },
            modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
        )

        Spacer(modifier = Modifier.weight(1f))

        Divider()

        // Opción de cierre o contacto abajo
        Text(
            text = "Versión 1.0.0",
            style = MaterialTheme.typography.bodySmall,
            modifier = Modifier
                .padding(16.dp)
                .align(Alignment.CenterHorizontally),
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
        )
    }
}
