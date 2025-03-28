package com.example.snappay.core.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.snappay.MainScreen
import com.example.snappay.core.navigation.SettingInfo

@Composable
fun SettingsScreen(settingsInfo: SettingInfo, navigationToBack: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Text("Settings Screen")

        Text(settingsInfo.name)
        Text("${settingsInfo.age}")

        MainScreen()

        Button(onClick = {
            navigationToBack()
        }) { Text("Regresar") }
    }
}