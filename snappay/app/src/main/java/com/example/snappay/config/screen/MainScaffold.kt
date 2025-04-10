package com.example.snappay.config.screen

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.snappay.core.navigation.*

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScaffold() {
//    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
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
        }
    ) {
        Scaffold(
            topBar = {
                if (config.showTopBar) {
                    AppTopBar (
                        title = config.title,
                        scope = scope,
                        showDrawer = config.showDrawer,
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
                if (config.showFab) {
                    AppFloatingActionButton (onClick = { /* Acción del FAB */ })
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
