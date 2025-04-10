package com.example.snappay.core.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.snappay.src.auth.AuthViewModel

@Composable
fun LoginScreen(navigationToHome: () -> Unit, viewModel: AuthViewModel = viewModel()) {
    val message by viewModel.message.collectAsState()

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Login", style = MaterialTheme.typography.titleMedium)

        OutlinedTextField(
            value = viewModel.email,
            onValueChange = { viewModel.email = it },
            label = { Text("Email") }
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = viewModel.password,
            onValueChange = { viewModel.password = it },
            label = { Text("Password") }
        )

        Spacer(modifier = Modifier.height(12.dp))

        Button(onClick = {
            viewModel.login(navigationToHome)
        }) {
            Text("Iniciar sesión")
        }

        Spacer(modifier = Modifier.height(12.dp))
        Text(text = message)

        Spacer(modifier = Modifier.height(50.dp))

        Button(onClick = {
            navigationToHome()
        }) { Text("Navegar a home") }
    }
}
