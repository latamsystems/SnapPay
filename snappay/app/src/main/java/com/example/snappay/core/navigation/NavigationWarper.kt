package com.example.snappay.core.navigation

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import com.example.snappay.config.api.ApiClient
import com.example.snappay.core.navigation.type.lastInfoType
import com.example.snappay.core.screen.DatesScreen
import com.example.snappay.core.screen.FineScreen
import com.example.snappay.core.screen.HomeScreen
import com.example.snappay.core.screen.example.DetailsScreen
import com.example.snappay.core.screen.admin.LoginScreen
import com.example.snappay.core.screen.PayScreen
import com.example.snappay.core.screen.PaymentsScreen
import com.example.snappay.core.screen.admin.SettingsScreen
import com.example.snappay.core.screen.example.FirstScreen
import com.example.snappay.core.screen.example.LastScreen
import com.example.snappay.src.admin.auth.SessionManager
import kotlin.reflect.typeOf

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun NavigationWarper(navController: NavHostController) {

    NavHost(navController, startDestination = AppScreen.Home) {

        // Login
        composable<AppScreen.Login>{
            if (SessionManager.isLoggedIn()) {
                LaunchedEffect(Unit) {
                    navController.popBackStack()
                    navController.navigate(AppScreen.Settings) {
                        launchSingleTop = true
                        popUpTo(AppScreen.Login) { inclusive = true }
                    }
                }
            } else {
                LoginScreen(
                    navigationToHome = {
                        navController.navigate(AppScreen.Home)
                    },
                    navigationToSettings = {
                        navController.navigate(AppScreen.Settings) {
                            launchSingleTop = true
                            popUpTo(AppScreen.Login) { inclusive = true }
                        }
                    },
                )
            }
        }

        // Home
        composable<AppScreen.Home>{
            HomeScreen()
        }

        // Payments
        composable<AppScreen.Payments>{
            PaymentsScreen()
        }

        // Pay
        composable<AppScreen.Pay>{
            PayScreen()
        }

        // Payments
        composable<AppScreen.Dates>{
            DatesScreen()
        }

        // Fine
        composable<AppScreen.Fine>{
            FineScreen()
        }

        //  Configuraciones
        composable<AppScreen.Settings> { backstackEntry ->
            if (SessionManager.isLoggedIn() && !ApiClient.isTokenExpired()) {
                SettingsScreen ()
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
















        // First
        composable<AppScreen.First>{
            FirstScreen { name ->
                navController.navigate(AppScreen.Detail(name = name))
            }
        }

        // Detalles
        composable<AppScreen.Detail>{ backStackEntry ->
            val detail = backStackEntry.toRoute<AppScreen.Detail>()
            DetailsScreen(
                name = detail.name,
                navigationToLast = {
                    navController.navigate(AppScreen.Last(it))
                },
                navigationToLogin = {
//                    navController.navigateUp()
                  navController.navigate(AppScreen.Login){
                    popUpTo<AppScreen.Login>{inclusive = false}
                  }
                }
            )
        }

        //  Last
        composable<AppScreen.Last>(typeMap = mapOf(typeOf<LastInfo>() to lastInfoType)) { backstackEntry ->
            val last: AppScreen.Last = backstackEntry.toRoute()
            LastScreen(
                lastInfo = last.info,
                navigationToBack = {
                    navController.popBackStack()
                },
                onLogout = {
                    navController.navigate(AppScreen.Home) {
                        popUpTo(AppScreen.Login) { inclusive = true }
                    }
                }
            )
        }

    }
}