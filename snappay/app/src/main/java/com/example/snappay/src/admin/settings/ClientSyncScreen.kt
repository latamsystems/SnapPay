package com.example.snappay.src.admin.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.platform.LocalContext
import com.example.snappay.src.core.sale.SaleService

@Composable
fun ClientSyncScreen() {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    var idSale by remember { mutableStateOf("") }
    var fid by remember { mutableStateOf("") }
    var identificationClient by remember { mutableStateOf("") }
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
            .padding(24.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.Start
    ) {
        // Título
        Text(
            text = "Sincronización de Dispositivo",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Subtítulo informativo
        Text(
            text = "Por favor, ingresa los datos necesarios para vincular esta venta con el teléfono del cliente. Esta operación sincroniza el dispositivo con la compra actual.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Formulario
        OutlinedTextField(
            value = idSale,
            onValueChange = { idSale = it },
            label = { Text("ID de la Compra") },
            enabled = !isLoading,
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = fid,
            onValueChange = { fid = it },
            label = { Text("FID del Dispositivo") },
            enabled = !isLoading,
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = identificationClient,
            onValueChange = { identificationClient = it },
            label = { Text("Identificación del Cliente") },
            enabled = !isLoading,
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Botón
        Button(
            onClick = {
                if (idSale.isBlank() || fid.isBlank() || identificationClient.isBlank()) {
                    Toast.makeText(context, "Completa todos los campos", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                scope.launch {
                    isLoading = true
                    message = null
                    try {
                        val request = SyncModel(
                            id_sale = idSale.toInt(),
                            fid = fid,
                            identification_client = identificationClient
                        )
                        val msg = SaleService.syncSale(request)
                        message = msg

                        idSale = ""
                        fid = ""
                        identificationClient = ""
                    } catch (e: Exception) {
                        message = e.message
                    } finally {
                        isLoading = false
                    }
                }
            },
            enabled = !isLoading,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sincronizando...")
            } else {
                Text("Enviar sincronización")
            }
        }
    }
}

