package com.example.snappay.core.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberAsyncImagePainter
import com.example.snappay.src.junctions.sale_payment.PaymentsViewModel

@Composable
fun PaymentsScreen(viewModel: PaymentsViewModel = viewModel()) {
    val pagos by viewModel.pagos.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    var selectedImage by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        viewModel.loadPayments()
    }

    Box(modifier = Modifier.fillMaxSize()) {
        when {
            isLoading -> {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    CircularProgressIndicator()
                }
            }

            error != null -> {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Text("Error: $error", color = MaterialTheme.colorScheme.error)
                }
            }

            pagos.isEmpty() -> {
                Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Text("No hay pagos aún.")
                }
            }

            else -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    pagos.forEach { pago ->
                        pago.payment?.let { p ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Column(Modifier.padding(16.dp)) {
                                    Text("Documento: ${p.numDocument_payment}")
                                    Text("Valor: \$${p.value_payment}")
                                    Text("Fecha: ${p.created_at_payment.substringBefore("T")}")
                                    Text("Estado: ${estadoTexto(p.id_status)}")

                                    if (!p.media_payment.isNullOrBlank()) {
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Image(
                                            painter = rememberAsyncImagePainter(p.media_payment),
                                            contentDescription = "Voucher",
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(150.dp)
                                                .clickable {
                                                    selectedImage = p.media_payment
                                                }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Fullscreen image preview
        selectedImage?.let { imageUrl ->
            AlertDialog(
                onDismissRequest = { selectedImage = null },
                confirmButton = {},
                text = {
                    Image(
                        painter = rememberAsyncImagePainter(imageUrl),
                        contentDescription = "Comprobante",
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(400.dp)
                    )
                }
            )
        }
    }
}

fun estadoTexto(statusId: Int): String {
    return when (statusId) {
        3 -> "✅ Pagado"
        4 -> "⏳ Pendiente"
        6 -> "❌ Rechazado"
        else -> "Desconocido"
    }
}
