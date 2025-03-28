package com.example.snappay.core.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import com.example.snappay.core.navigation.type.settingsInfoType
import com.example.snappay.core.screen.DetailsScreen
import com.example.snappay.core.screen.HomeScreen
import com.example.snappay.core.screen.LoginScreen
import com.example.snappay.core.screen.SettingsScreen
import kotlin.reflect.typeOf

@Composable
fun NavigationWarper(navController: NavHostController) {

    NavHost(navController, startDestination = AppScreen.Login) {

        // Login
        composable<AppScreen.Login>{
            LoginScreen {
                navController.navigate(AppScreen.Home)
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
            val setting : AppScreen.Settings = backstackEntry.toRoute()
            SettingsScreen(setting.info) {
                navController.popBackStack()
            }
        }
    }
}