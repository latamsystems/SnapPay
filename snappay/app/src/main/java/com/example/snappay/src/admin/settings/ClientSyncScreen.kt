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
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Sincronizar Compra")

        OutlinedTextField(
            value = idSale,
            onValueChange = { idSale = it },
            label = { Text("ID Compra") },
            enabled = !isLoading
        )
        OutlinedTextField(
            value = fid,
            onValueChange = { fid = it },
            label = { Text("FID") },
            enabled = !isLoading
        )
        OutlinedTextField(
            value = identificationClient,
            onValueChange = { identificationClient = it },
            label = { Text("Identificación Cliente") },
            enabled = !isLoading
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                // Validación
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

                        // Limpiar campos
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
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .height(20.dp)
                        .width(20.dp),
                    strokeWidth = 2.dp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sincronizando...", color = MaterialTheme.colorScheme.primary)
            } else {
                Text("Enviar sincronización")
            }
        }
    }
}

