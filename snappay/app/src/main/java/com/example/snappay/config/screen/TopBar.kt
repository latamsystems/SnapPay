package com.example.snappay.config.screen

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppTopBar(
    title: String,
    scope: CoroutineScope,
    onMenuClick: suspend () -> Unit
) {
    TopAppBar(
        title = { Text(title) },
        navigationIcon = {
            IconButton(onClick = {
                scope.launch { onMenuClick() }
            }) {
                Icon(Icons.Default.Menu, contentDescription = "Menú")
            }
        }
    )
}
