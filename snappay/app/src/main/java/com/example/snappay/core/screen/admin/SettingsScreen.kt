package com.example.snappay.core.screen.admin

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.snappay.src.admin.settings.ClientSyncScreen
import com.example.snappay.src.example.MainScreen

@Composable
fun SettingsScreen() {

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Formulario de sincronizacion
        ClientSyncScreen()
    }
}
