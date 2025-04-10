package com.example.snappay.core.screen.example

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.snappay.core.navigation.LastInfo

@Composable
fun DetailsScreen(name: String, navigationToLast: (LastInfo) -> Unit, navigationToLogin: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Text("Detail Screen $name")

        Button(onClick = {
            val lasInfo = LastInfo(name = "Details Info", age = 20)
            navigationToLast(lasInfo)
        }) { Text("Navegar a Last") }

        Button(onClick = {
            navigationToLogin()
        }) { Text("Navegar a Login") }
    }
}