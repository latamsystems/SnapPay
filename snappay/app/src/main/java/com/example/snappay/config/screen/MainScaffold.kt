package com.example.snappay.config.screen

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.snappay.core.navigation.*
import com.example.snappay.src.admin.auth.SessionManager

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScaffold() {
    val scope = rememberCoroutineScope()
    val navController = rememberNavController()
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = currentBackStackEntry?.destination?.route

    val screenConfigs = accessScreen()
    val routeKey = getRouteKey(currentDestination)
    val config = screenConfigs[routeKey] ?: ScreenConfig()

    val drawerState = remember(config.showDrawer) {
        DrawerState(initialValue = DrawerValue.Closed)
    }

    // Cierra el drawer automáticamente al navegar
    LaunchedEffect(currentDestination) {
        if (drawerState.isOpen) {
            drawerState.close()
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            if (config.showDrawer) {
                AppDrawer (
                    routeKey = routeKey,
                    scope = scope,
                    navController = navController,
                    closeDrawer = { drawerState.close() }
                )
            }
        },
        gesturesEnabled = SessionManager.isLoggedIn()
    ) {
        Scaffold(
            topBar = {
                if (config.showTopBar) {
                    AppTopBar (
                        title = config.title,
                        scope = scope,
                        onMenuClick = { drawerState.open() }
                    )
                }
            },
            bottomBar = {
                if (config.showBottomBar) {
                    AppBottomBar (
                        routeKey = routeKey,
                        navController = navController,
                        scope = scope,
                        closeDrawer = { drawerState.close() }
                    )
                }
            },
            floatingActionButton = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    horizontalAlignment = Alignment.End
                ) {
                    if (config.showRefreshFab) {
                        FloatingActionButton(
                            onClick = {
                                // Navegación temporal para recargar la vista
                                navController.navigate(currentDestination ?: "") {
                                    popUpTo(currentDestination ?: "") { inclusive = true }
                                }
                            },
                            containerColor = MaterialTheme.colorScheme.secondaryContainer
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Refrescar")
                        }
                    }

                    if (config.showFab) {
                        AppFloatingActionButton(onClick = {
                            navController.navigate(AppScreen.Pay)
                        })
                    }
                }
            }

        ) { innerPadding ->
            val scrollState = rememberScrollState()
            Column(
                modifier = Modifier
                    .verticalScroll(scrollState)
                    .padding(innerPadding)
                    .padding(16.dp)
            ) {
                NavigationWarper(navController)
            }
        }
    }
}

@Preview(showSystemUi = true)
@Composable
fun MainScaffoldPreview() {
    MainScaffold()
}
