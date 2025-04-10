package com.example.snappay.core.screen.example

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.example.snappay.core.navigation.LastInfo
import com.example.snappay.src.auth.AuthService
import com.example.snappay.src.example.MainScreen
import kotlinx.coroutines.launch

@Composable
fun LastScreen(lastInfo: LastInfo, navigationToBack: () -> Unit, onLogout: () -> Unit) {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var logoutMsg by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Last Screen")
        Text(lastInfo.name)
        Text("${lastInfo.age}")

        MainScreen()

        Button(onClick = {
            navigationToBack()
        }) { Text("Regresar") }

        Spacer(modifier = Modifier.height(20.dp))

        Button(onClick = {
            scope.launch {
                try {
                    val msg = AuthService.logout()
                    logoutMsg = msg
                    onLogout()
                } catch (e: Exception) {
                    logoutMsg = e.message
                }
            }
        }) {
            Text("Cerrar sesión")
        }

        logoutMsg?.let {
            Spacer(modifier = Modifier.height(12.dp))
            Text(it)
        }
    }
}
