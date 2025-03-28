package com.example.snappay.core.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.snappay.MainViewModel

@Composable
fun MainScreen(viewModel: MainViewModel = viewModel()) {
    val data by viewModel.data.collectAsState()

    Surface(
//        modifier = Modifier.fillMaxSize()
    ) {
        Column(
            modifier = Modifier
//              .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Respuesta API:", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = data, style = MaterialTheme.typography.bodyMedium)
        }
    }
}
