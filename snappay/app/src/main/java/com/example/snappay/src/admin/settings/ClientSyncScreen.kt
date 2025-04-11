package com.example.snappay.src.admin.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.snappay.src.core.client.ClientService
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.ui.platform.LocalContext

@Composable
fun ClientSyncScreen() {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    var idClient by remember { mutableStateOf("") }
    var fid by remember { mutableStateOf("") }
    var identification by remember { mutableStateOf("") }
    var message by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    LaunchedEffect(message) {
        message?.let {
            Toast.makeText(context, it, Toast.LENGTH_LONG).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Sincronizar Cliente")

        OutlinedTextField(
            value = idClient,
            onValueChange = { idClient = it },
            label = { Text("ID Cliente") },
            enabled = !isLoading
        )
        OutlinedTextField(
            value = fid,
            onValueChange = { fid = it },
            label = { Text("FID") },
            enabled = !isLoading
        )
        OutlinedTextField(
            value = identification,
            onValueChange = { identification = it },
            label = { Text("Cédula Cliente") },
            enabled = !isLoading
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                // Validación
                if (idClient.isBlank() || fid.isBlank() || identification.isBlank()) {
                    Toast.makeText(context, "Completa todos los campos", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                scope.launch {
                    isLoading = true
                    message = null
                    try {
                        val request = ClientSyncModel(
                            id_client = idClient.toInt(),
                            fid = fid,
                            identification_client = identification
                        )
                        val msg = ClientService.syncClient(request)
                        message = msg
                    } catch (e: Exception) {
                        message = e.message
                    } finally {
                        isLoading = false
                    }
                }
            },
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .height(20.dp)
                        .width(20.dp),
                    strokeWidth = 2.dp
                )
            } else {
                Text("Enviar sincronización")
            }
        }
    }
}

