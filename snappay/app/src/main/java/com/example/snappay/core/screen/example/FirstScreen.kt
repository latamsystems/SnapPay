package com.example.snappay.core.screen.example

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.example.snappay.src.admin.auth.SessionManager

@Composable
fun FirstScreen(navigationToDetail: (String) -> Unit) {

    var text by remember { mutableStateOf("") }
    val user by SessionManager.user.collectAsState()

    Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
        Text("First Screen")

        TextField(
            value = text,
            onValueChange = { text = it },
            label = { Text(text = "ingresa tu nombre") }
        )

        Text("Hola " + (user?.firstname_user + " " + user?.lastname_user) ?: "Invitado")

        Button(onClick = {
            navigationToDetail(text)
        }) { Text("Navegar a Detail") }
    }
}