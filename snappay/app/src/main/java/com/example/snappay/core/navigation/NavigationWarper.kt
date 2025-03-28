package com.example.snappay.core.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
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

    NavHost(navController, startDestination = Login) {

        // Login
        composable<Login>{
            LoginScreen {
                navController.navigate(Home)
            }
        }

        // Home
        composable<Home>{
            HomeScreen { name ->
                navController.navigate(Detail(name = name))
            }
        }

        // Detalles
        composable<Detail>{ backStackEntry ->
            val detail = backStackEntry.toRoute<Detail>()
            DetailsScreen(
                name = detail.name,
                navigationToSettings = {
                    navController.navigate(Settings(it))
                },
                navigationToLogin = {
//                    navController.navigateUp()
                  navController.navigate(Login){
                    popUpTo<Login>{inclusive = false}
                  }
                }
            )
        }

        //  Configuraciones
        composable<Settings>(typeMap = mapOf(typeOf<SettingInfo>() to settingsInfoType)) { backstackEntry ->
            val setting : Settings = backstackEntry.toRoute()
            SettingsScreen(setting.info) {
                navController.popBackStack()
            }
        }
    }
}