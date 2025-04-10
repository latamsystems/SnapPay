package com.example.snappay.core.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import com.example.snappay.config.api.ApiClient
import com.example.snappay.core.navigation.type.settingsInfoType
import com.example.snappay.core.screen.DetailsScreen
import com.example.snappay.core.screen.HomeScreen
import com.example.snappay.core.screen.LoginScreen
import com.example.snappay.core.screen.SettingsScreen
import kotlin.reflect.typeOf

@Composable
fun NavigationWarper(navController: NavHostController) {

    NavHost(navController, startDestination =
        if (ApiClient.token != null) { AppScreen.Home } else { AppScreen.Login }
    ) {

        // Login
        composable<AppScreen.Login>{
            if (ApiClient.token != null) {
                LaunchedEffect(Unit) {
                    navController.navigate(AppScreen.Home) {
                        launchSingleTop = true
                        popUpTo(AppScreen.Login) { inclusive = true }
                    }
                }
            } else {
                LoginScreen(navigationToHome = {
                    navController.navigate(AppScreen.Home)
                })
            }
        }

        // Home
        composable<AppScreen.Home>{
            HomeScreen { name ->
                navController.navigate(AppScreen.Detail(name = name))
            }
        }

        // Detalles
        composable<AppScreen.Detail>{ backStackEntry ->
            val detail = backStackEntry.toRoute<AppScreen.Detail>()
            DetailsScreen(
                name = detail.name,
                navigationToSettings = {
                    navController.navigate(AppScreen.Settings(it))
                },
                navigationToLogin = {
//                    navController.navigateUp()
                  navController.navigate(AppScreen.Login){
                    popUpTo<AppScreen.Login>{inclusive = false}
                  }
                }
            )
        }

        //  Configuraciones
        composable<AppScreen.Settings>(typeMap = mapOf(typeOf<SettingInfo>() to settingsInfoType)) { backstackEntry ->
            if (ApiClient.token != null && !ApiClient.isTokenExpired()) {
                val setting: AppScreen.Settings = backstackEntry.toRoute()
                SettingsScreen(
                    settingsInfo = setting.info,
                    navigationToBack = {
                        navController.popBackStack()
                    },
                    onLogout = {
                        navController.navigate(AppScreen.Home) {
                            popUpTo(AppScreen.Login) { inclusive = true }
                        }
                    }
                )
            } else {
                ApiClient.token = null
                LaunchedEffect(Unit) {
                    navController.navigate(AppScreen.Login) {
                        launchSingleTop = true
                        popUpTo(AppScreen.Login) { inclusive = true }
                    }
                }
            }
        }
    }
}